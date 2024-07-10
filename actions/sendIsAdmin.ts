import { TRPCError } from "@trpc/server";

import { sendEmail } from "@/actions/sendEmail";
import prisma from "@/lib/prisma";

interface sendIsAdminOptions {
  userId: string;
  isAdmin: boolean;
}

export const sendIsAdmin = async ({ userId, isAdmin }: sendIsAdminOptions) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "ユーザーが見つかりません",
    });
  }

  const subject = "権限のご案内";

  const body = `
    <div>
      <p>
        ご利用ありがとうございます。<br />
        あなたに「権限」が${isAdmin ? "付与" : "削除"}されました。
      </p>

      <p>このメールに覚えのない場合は、このメールを無視するか削除して頂けますようお願いします。</p>
    </div>
  `;

  await sendEmail(subject, body, user.email);
};
