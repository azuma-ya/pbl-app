import { TRPCError } from "@trpc/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getPusherInstance } from "@/lib/pusher/server";
import { privateProcedure, router } from "@/trpc/server/trpc";

const pusherServer = getPusherInstance();

export const commentRouter = router({
  createComment: privateProcedure
    .input(
      z.object({
        threadId: z.string(),
        parentId: z.string().optional(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { threadId, parentId, content } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const comment = await prisma.comment.create({
          data: {
            userId: user.id,
            content,
            threadId,
            parentId,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            parent: true,
          },
        });

        await pusherServer.trigger(threadId, "new-comment", comment);

        return comment;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "コメントに失敗しました",
          });
        }
      }
    }),
  getComments: privateProcedure
    .input(
      z.object({
        threadId: z.string(),
        limit: z.number(),
        offset: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const { threadId, limit, offset } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const thread = await prisma.thread.findUnique({
          where: {
            id: threadId,
          },
        });

        if (!thread) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "スレッドが見つかりません",
          });
        }

        if (thread.schoolId !== user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "あなたの所属学校ではありません",
          });
        }

        const comments = await prisma.comment.findMany({
          where: {
            threadId,
          },
          skip: offset,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });

        const totalComments = await prisma.comment.count({
          where: { threadId },
        });

        return { comments, totalComments };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "コメント一覧取得に失敗しました",
        });
      }
    }),
  updateComment: privateProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string().optional(),
        isSelected: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { commentId, content, isSelected } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const comment = await prisma.comment.findUnique({
          where: {
            id: commentId,
          },
        });

        if (!comment) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "コメントが見つかりませんでした",
          });
        }

        if (user.id !== comment.userId && !!content) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "コメントの編集権限がありません",
          });
        }

        const updatedComment = await prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            content,
            isSelected,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            parent: true,
          },
        });

        await pusherServer.trigger(
          updatedComment.threadId,
          "update-comment",
          updatedComment,
        );

        return updatedComment;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "編集に失敗しました",
          });
        }
      }
    }),
  deleteComment: privateProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { commentId } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const comment = await prisma.comment.findUnique({
          where: {
            id: commentId,
          },
        });

        if (!comment) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "コメントが見つかりませんでした",
          });
        }

        if (user.id !== comment.userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "コメントの編集権限がありません",
          });
        }

        await prisma.comment.delete({
          where: {
            id: commentId,
          },
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "削除に失敗しました",
          });
        }
      }
    }),
});
