import { commentRouter } from "@/trpc/server/routers/comment";
import { manualRouter } from "@/trpc/server/routers/manual";
import { schoolRouter } from "@/trpc/server/routers/school";
import { threadRouter } from "@/trpc/server/routers/thread";
import { userRouter } from "@/trpc/server/routers/user";
import { createCallerFactory, router } from "@/trpc/server/trpc";

//ルーターの作成
export const appRouter = router({
  user: userRouter,
  thread: threadRouter,
  comment: commentRouter,
  manual: manualRouter,
  school: schoolRouter,
});

//ルーターの型定義
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
