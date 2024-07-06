import { TRPCError } from "@trpc/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { privateProcedure, publicProcedure, router } from "@/trpc/server/trpc";

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { email } = input;

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
          include: { school: { select: { id: true, name: true } } },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        return user;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ユーザの取得に失敗しました",
          });
        }
      }
    }),
  updateAdmin: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        isAdmin: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { userId, isAdmin } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        if (!user.isAdmin) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーに編集権限がありません",
          });
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            isAdmin,
          },
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ユーザの編集にに失敗しました",
          });
        }
      }
    }),
  getUserThreadById: publicProcedure
    .input(
      z.object({ userId: z.string(), limit: z.number(), offset: z.number() }),
    )
    .query(async ({ input }) => {
      try {
        const { userId, limit, offset } = input;

        if (!userId) {
          return { user: null, totalPosts: 0 };
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            threads: {
              skip: offset,
              take: limit,
              orderBy: {
                updatedAt: "desc",
              },
            },
          },
        });

        if (!user) {
          return { user: null, totalPosts: 0 };
        }

        const totalPosts = await prisma.thread.count({
          where: { userId },
        });

        return { user, totalPosts };
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ユーザー投稿詳細の取得に失敗しました",
          });
        }
      }
    }),
  getScooleMembers: privateProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const { limit, offset } = input;

        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const members = await prisma.user.findMany({
          where: {
            schoolId: user.schoolId,
          },
          include: {
            roles: {
              select: {
                role: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          skip: offset,
          take: limit,
          orderBy: {
            updatedAt: "desc",
          },
        });

        const totalMembers = await prisma.user.count();

        return { members, totalMembers };
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "職員の取得に失敗しました",
          });
        }
      }
    }),
  updateUserSchool: privateProcedure
    .input(z.object({ schoolId: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { schoolId, password } = input;

        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const school = await prisma.school.findUnique({
          where: {
            id: schoolId,
          },
        });

        if (!school) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校が見つかりません",
          });
        }

        if (school.password !== password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "パスワードが一致しません",
          });
        }

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            schoolId: schoolId,
          },
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "学校の更新に失敗しました",
          });
        }
      }
    }),
  craeteUserRole: privateProcedure
    .input(z.object({ roleId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { roleId } = input;

        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const role = await prisma.role.findUnique({
          where: {
            id: roleId,
          },
        });

        if (!role) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "役職が見つかりません",
          });
        }

        if (role.schoolId !== user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "所属学校の役職ではありません",
          });
        }

        await prisma.roleUser.create({
          data: {
            userId: user.id,
            roleId,
          },
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "役職の紐づけに失敗しました",
          });
        }
      }
    }),
});
