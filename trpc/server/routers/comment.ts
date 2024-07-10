import { TRPCError } from "@trpc/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { privateProcedure, router } from "@/trpc/server/trpc";

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

        const comments = await prisma.comment.findMany({
          where: {
            threadId,
            thread: {
              OR: [
                {
                  subscribers: {
                    some: {
                      userId: user.id,
                    },
                  },
                },
                {
                  userId: user.id,
                },
              ],
            },
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
          where: {
            threadId,
            thread: {
              OR: [
                {
                  subscribers: {
                    some: {
                      userId: user.id,
                    },
                  },
                },
                {
                  userId: user.id,
                },
              ],
            },
          },
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

        const updatedComment = await prisma.comment.update({
          where: {
            id: commentId,
            userId: user.id,
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

        await prisma.comment.deleteMany({
          where: {
            AND: [{ id: commentId }, { userId: user.id }],
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
  getCommentById: privateProcedure
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

        const comment = await prisma.comment.findFirst({
          where: {
            AND: [{ id: commentId }],
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

        return comment;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "取得に失敗しました",
          });
        }
      }
    }),
});
