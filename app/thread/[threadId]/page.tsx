import ThreadDetail from "@/components/thread/ThreadDetail";
import { getAuthSession } from "@/lib/auth";
import { trpc } from "@/trpc/client";
import { Box } from "@mui/material";

interface ThreadDetailPageProps {
  params: {
    threadId: string;
  };
}

const ThreadDetailPage = async ({ params }: ThreadDetailPageProps) => {
  const { threadId } = params;
  const user = await getAuthSession();

  const thread = await trpc.thread.getThreadById({ threadId });

  const { manuals } = await trpc.manual.getManuals();

  const { members } = await trpc.user.getScooleMembers({});

  if (!thread) {
    return <Box sx={{ textAlign: "center" }}>スレッドはありません</Box>;
  }

  return (
    <ThreadDetail
      thread={thread}
      manuals={manuals}
      users={members}
      userId={user!.id}
    />
  );
};

export default ThreadDetailPage;
