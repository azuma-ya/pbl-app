import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import google from "next-auth/providers/google";

import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
  },
  providers: [google],
  //セッション設定
  session: {
    strategy: "jwt",
  },
});

//認証情報取得
export const getAuthSession = async () => {
  const session = await auth();

  if (!session || !session.user?.email) {
    return null;
  }

  const user = prisma.user.findFirst({
    where: { email: session.user.email },
  });

  return user;
};
