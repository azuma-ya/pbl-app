import { TRPCError } from "@trpc/server";

import openai, { manualFormat } from "@/lib/openai";
import prisma from "@/lib/prisma";
import { privateProcedure, router } from "@/trpc/server/trpc";
import { z } from "zod";

export const manualRouter = router({
  getManuals: privateProcedure.query(async ({ ctx }) => {
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
  createManual: privateProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ input, ctx }) => {
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

        const thread = await prisma.thread.findUnique({
          where: {
            id: threadId,
          },
          include: {
            comments: {
              where: {
                isSelected: true,
              },
              select: {
                content: true,
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

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // string;
          messages: [
            {
              role: "assistant", // "user" | "assistant" | "system"
              content: "あなたは文章からマニュアル作成を仕事にしています。", // string
            },
            {
              role: "user",
              content: `以下の文章は問題発生から解決までの会話履歴です。titleとcontentを持つJSONを下さい。またconetntはmarkdownで書き、\n${manualFormat}\n以上のフォーマットに従ってください。`,
            },
            {
              role: "user",
              content: `title: ${thread.title}`,
            },
            {
              role: "user",
              content: `description: ${thread.description}`,
            },
            {
              role: "user",
              content: JSON.stringify(thread.comments),
            },
          ],
          response_format: {
            type: "json_object", // json_objectを指定
          },
        });

        const manualData = JSON.parse(completion.choices[0]?.message.content!);

        // console.log(completion.choices[0]?.message.content);
        // console.log(manualData);

        const manual = await prisma.$transaction(async (prisma) => {
          const manual = await prisma.manual.create({
            data: {
              title: manualData.title,
              content: manualData.content,
              userId: user.id,
              threadId: threadId,
              schoolId: thread.schoolId,
            },
          });
          await prisma.thread.update({
            where: {
              id: threadId,
            },
            data: {
              status: "CLOSED",
            },
          });
          return manual;
        });

        return manual;
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
  updateManual: privateProcedure
    .input(
      z.object({
        manualId: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { manualId, title, content } = input;
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

        const manual = await prisma.manual.update({
          where: {
            id: manualId,
          },
          data: {
            title,
            content,
          },
        });

        return manual;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "マニュアルの更新に失敗しました",
          });
        }
      }
    }),
  getManualById: privateProcedure
    .input(z.object({ manualId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const { manualId } = input;
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

        const manual = await prisma.manual.findUnique({
          where: {
            id: manualId,
          },
        });

        return manual;
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "マニュアル取得に失敗しました",
          });
        }
      }
    }),
});
