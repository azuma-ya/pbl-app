import ManualDetail from "@/components/manual/ManualDetail";
import { getAuthSession } from "@/lib/auth";
import { trpc } from "@/trpc/client";
import { Box } from "@mui/material";

interface ManualDetailPageProps {
  params: {
    manualId: string;
  };
}

const ManualDetailPage = async ({ params }: ManualDetailPageProps) => {
  const { manualId } = params;
  const user = await getAuthSession();

  const manual = await trpc.manual.getManualById({ manualId });

  if (!manual) {
    return <Box sx={{ textAlign: "center" }}>マニュアルがありません</Box>;
  }

  return <ManualDetail manual={manual} userId={user!.id} />;
};

export default ManualDetailPage;
