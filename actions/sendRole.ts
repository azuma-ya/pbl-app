import { TRPCError } from "@trpc/server";

import { sendEmail } from "@/actions/sendEmail";
import prisma from "@/lib/prisma";

interface sendRoleOptions {
  userId: string;
  roleId: string;
}

export const sendRole = async ({ userId, roleId }: sendRoleOptions) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "ユーザーが見つかりません",
    });
  }

  const role = await prisma.user.findFirst({
    where: { AND: [{ id: roleId, schoolId: user.schoolId }] },
  });

  if (!role) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "役職が見つかりません",
    });
  }

  const subject = "役職のご案内";

  const body = `
    <div>
      <p>
        ご利用ありがとうございます。<br />
        あなたに「${role.name}」の役職が付与されました。
      </p>

      <p>このメールに覚えのない場合は、このメールを無視するか削除して頂けますようお願いします。</p>
    </div>
  `;

  await sendEmail(subject, body, user.email);
};
