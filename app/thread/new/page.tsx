import ThreadNew from "@/components/thread/ThreadNew";
import { getAuthSession } from "@/lib/auth";
import { trpc } from "@/trpc/client";

export const revalidate = 0;

const ThreadNewPage = async () => {
  const user = await getAuthSession();

  const { members } = await trpc.user.getScooleMembers({});

  return <ThreadNew users={members} userId={user!.id} />;
};

export default ThreadNewPage;
