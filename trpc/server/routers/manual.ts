import { TRPCError } from "@trpc/server";

import prisma from "@/lib/prisma";
import { privateProcedure, router } from "@/trpc/server/trpc";

export const manualRouter = router({
  getManuals: privateProcedure.query(async ({ ctx }) => {
    try {
      console.log("a");
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

      const manuals = await prisma.manual.findMany({
        where: {
          schoolId: user.schoolId,
        },
      });

      const totalManuals = await prisma.manual.count({
        where: {
          schoolId: user.schoolId,
        },
      });

      return { manuals, totalManuals };
    } catch (error) {
      console.log(error);

      if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
        throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "マニュアル一覧取得に失敗しました",
        });
      }
    }
  }),
});
