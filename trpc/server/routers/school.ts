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

        const school = await prisma.school.create({
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
            message: "学校の作成に失敗しました",
          });
        }
      }
    }),
  getScools: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        offset: z.number(),
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
});
