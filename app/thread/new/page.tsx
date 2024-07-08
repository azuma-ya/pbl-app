import ThreadNew from "@/components/thread/ThreadNew";
import { trpc } from "@/trpc/client";

export const revalidate = 0;

const ThreadNewPage = async () => {
  const { members } = await trpc.user.getScooleMembers({});

  return <ThreadNew users={members} />;
};

export default ThreadNewPage;
