import Thread from "@/components/thread/Thread";
import { trpc } from "@/trpc/client";

export const revalidate = 0;

export default async function Home() {
  const { threads } = await trpc.thread.getThreads();

  return <Thread threads={threads} />;
}
