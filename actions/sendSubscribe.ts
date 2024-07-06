import { TRPCError } from "@trpc/server";

import { sendEmail } from "@/actions/sendEmail";
import prisma from "@/lib/prisma";

interface sendSubscribeOptions {
  userId: string;
  threadId: string;
}

export const sendSubscribe = async ({
  userId,
  threadId,
}: sendSubscribeOptions) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "ユーザーが見つかりません",
    });
  }

  const subject = "スレッド参加者のご案内";

  const body = `
    <div>
      <p>
        ご利用ありがとうございます。<br />
        あなたのアカウントがスレッドに追加されました。
      </p>

      <p><a href=${process.env.NEXT_PUBLIC_APP_URL}/thread/${threadId}}>スレッドを見る</a></p>

      <p>このメールに覚えのない場合は、このメールを無視するか削除して頂けますようお願いします。</p>
    </div>
  `;

  await sendEmail(subject, body, user.email);
};
