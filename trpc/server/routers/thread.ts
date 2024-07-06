import { ThreadStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { sendSubscribe } from "@/actions/sendSubscribe";
import prisma from "@/lib/prisma";
import { privateProcedure, router } from "@/trpc/server/trpc";

export const threadRouter = router({
  createThread: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        subscriberIds: z.string().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { title, description, subscriberIds } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const thread = await prisma.thread.create({
          data: {
            userId: user.id,
            title,
            description,
            schoolId: user.schoolId,
          },
        });

        for (const subscriberId of subscriberIds) {
          const user = await prisma.user.findUnique({
            where: {
              id: subscriberId,
            },
          });

          if (!user) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "ユーザーが見つかりません",
            });
          }

          if (thread?.schoolId !== user.schoolId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "このユーザーの所属学校ではありません",
            });
          }

          await prisma.threadUser.create({
            data: {
              userId: subscriberId,
              threadId: thread.id,
            },
          });
        }

        return thread;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "スレッドの作成に失敗しました",
          });
        }
      }
    }),
  getThreads: privateProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ユーザーが見つかりません",
        });
      }

      if (!user.schoolId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "学校に所属していません",
        });
      }

      const threads = await prisma.thread.findMany({
        where: {
          schoolId: user.schoolId,
        },
      });

      const totalThreads = await prisma.thread.count({
        where: {
          schoolId: user.schoolId,
        },
      });

      return { threads, totalThreads };
    } catch (error) {
      console.log(error);

      if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
        throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッド一覧取得に失敗しました",
        });
      }
    }
  }),
  getThreadById: privateProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const { threadId } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const thread = await prisma.thread.findFirst({
          where: {
            id: threadId,
            schoolId: user.schoolId,
            OR: [
              {
                userId: user.id,
              },
              {
                subscribers: {
                  some: {
                    userId: user.id,
                  },
                },
              },
              { status: "CLOSED" },
            ],
          },
          include: {
            comments: {
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
              orderBy: {
                createdAt: "asc",
              },
            },
            manuals: true,
            linkedManuals: {
              select: {
                manual: true,
              },
            },
            subscribers: true,
          },
        });

        return thread;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "スレッド取得に失敗しました",
          });
        }
      }
    }),
  updateThreadStatus: privateProcedure
    .input(
      z.object({ threadId: z.string(), status: z.nativeEnum(ThreadStatus) }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { threadId, status } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const thread = await prisma.thread.update({
          where: {
            id: threadId,
            schoolId: user.schoolId,
          },
          data: {
            status,
          },
        });

        return thread;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "スレッド取得に失敗しました",
          });
        }
      }
    }),
  updateThreadSubsucribers: privateProcedure
    .input(
      z.object({ threadId: z.string(), subscriberIds: z.string().array() }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { threadId, subscriberIds } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const thread = await prisma.thread.findUnique({
          where: { id: threadId },
          include: {
            subscribers: {
              select: {
                id: true,
              },
            },
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

        const currentSubscriberIds = thread.subscribers.map(
          (subscriber) => subscriber.id,
        );

        const createSubscriberIds = subscriberIds.filter(
          (subscriberId) => !currentSubscriberIds.includes(subscriberId),
        );

        await prisma.$transaction(async (prisma) => {
          await prisma.threadUser.deleteMany({
            where: {
              threadId: {},
            },
          });

          for (const subscriberId of subscriberIds) {
            const user = await prisma.user.findUnique({
              where: {
                id: subscriberId,
              },
            });

            if (!user) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "ユーザーが見つかりません",
              });
            }

            if (thread?.schoolId !== user.schoolId) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "このユーザーの所属学校ではありません",
              });
            }

            await prisma.threadUser.create({
              data: {
                userId: subscriberId,
                threadId,
              },
            });
          }
        });

        for (let subscriberId of createSubscriberIds) {
          await sendSubscribe({ userId: subscriberId, threadId });
        }
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "購読者の更新に失敗しました",
          });
        }
      }
    }),
  createThreadLinkedManual: privateProcedure
    .input(z.object({ threadId: z.string(), manualId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { threadId, manualId } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const thread = await prisma.thread.findUnique({
          where: { id: threadId },
        });

        if (thread?.schoolId !== user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "あなたの所属学校ではありません",
          });
        }

        await prisma.threadManual.create({
          data: {
            threadId,
            manualId,
          },
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "購読者の更新に失敗しました",
          });
        }
      }
    }),
  updateThreadLinkedManual: privateProcedure
    .input(z.object({ threadId: z.string(), manualIds: z.string().array() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { threadId, manualIds } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const thread = await prisma.thread.findUnique({
          where: { id: threadId },
        });

        if (thread?.schoolId !== user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "あなたの所属学校ではありません",
          });
        }

        await prisma.$transaction(async (prisma) => {
          await prisma.threadManual.deleteMany({
            where: {
              threadId,
            },
          });

          for (const manualId of manualIds) {
            const manual = await prisma.manual.findUnique({
              where: {
                id: manualId,
              },
            });

            if (!manual) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "マニュアルが見つかりません",
              });
            }

            await prisma.threadManual.create({
              data: {
                threadId,
                manualId,
              },
            });
          }
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "マニュアルの紐づけの更新に失敗しました",
          });
        }
      }
    }),
});
