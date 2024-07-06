import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import google from "next-auth/providers/google";

import prisma from "@/lib/prisma";

// Session 型の拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      schoolId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    schoolId?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
  },
  providers: [google],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.schoolId = user.schoolId;
      }
      if (trigger === "update" && session?.user.schoolId) {
        token.schoolId = session.user.schoolId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user && token.schoolId) {
        session.user.schoolId = token.schoolId as string;
      }
      return session;
    },
  },
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
    include: {
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return user;
};
