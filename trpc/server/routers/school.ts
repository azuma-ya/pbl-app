import { TRPCError } from "@trpc/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { privateProcedure, publicProcedure, router } from "@/trpc/server/trpc";

export const schoolRouter = router({
  createSchool: privateProcedure
    .input(z.object({ name: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, password } = input;
        const user = await ctx.user;

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ユーザーが見つかりません",
          });
        }

        const school = await prisma.$transaction(async (prisma) => {
          const school = await prisma.school.create({
            data: {
              name,
              password,
            },
          });

          const role = await prisma.role.create({
            data: {
              name: "管理者",
              schoolId: school.id,
            },
          });

          await prisma.roleUser.create({
            data: {
              userId: user.id,
              roleId: role.id,
            },
          });

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              isAdmin: true,
            },
          });

          return school;
        });

        return school;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "学校の作成に失敗しました",
          });
        }
      }
    }),
  getScools: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { limit, offset } = input;

        const schools = await prisma.school.findMany({
          skip: offset,
          take: limit,
          orderBy: {
            updatedAt: "desc",
          },
        });

        const totalScools = await prisma.school.count();

        return { schools, totalScools };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "学校一覧取得に失敗しました",
        });
      }
    }),
  updateSchool: privateProcedure
    .input(
      z.object({
        name: z.string().optional(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, password } = input;
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

        if (!user.isAdmin) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "変更権限がありません",
          });
        }

        const school = await prisma.school.update({
          where: {
            id: user.schoolId,
          },
          data: {
            name,
            password,
          },
        });

        return school;
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
  createRole: privateProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { name } = input;
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

        if (!user.isAdmin) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "変更権限がありません",
          });
        }

        const role = await prisma.role.create({
          data: {
            schoolId: user.schoolId,
            name,
          },
        });

        return role;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "役職の作成に失敗しました",
          });
        }
      }
    }),
  getRoles: privateProcedure
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

        if (!user.schoolId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "学校に所属していません",
          });
        }

        const roles = await prisma.role.findMany({
          skip: offset,
          take: limit,
          where: {
            schoolId: user.schoolId,
          },
        });

        const totalRoles = await prisma.role.count({
          where: {
            schoolId: user.schoolId,
          },
        });

        return { roles, totalRoles };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "役職一覧取得に失敗しました",
        });
      }
    }),
});
