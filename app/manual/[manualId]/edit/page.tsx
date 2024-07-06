import ManualEdit from "@/components/manual/ManualEdit";
import { getAuthSession } from "@/lib/auth";
import { trpc } from "@/trpc/client";
import { Box } from "@mui/material";

interface ManualEditPageProps {
  params: {
    manualId: string;
  };
}

const ManualEditPage = async ({ params }: ManualEditPageProps) => {
  const { manualId } = params;
  const user = await getAuthSession();

  const manual = await trpc.manual.getManualById({ manualId });

  if (!manual) {
    return <Box sx={{ textAlign: "center" }}>マニュアルがありません</Box>;
  }

  return <ManualEdit manual={manual} userId={user!.id} />;
};

export default ManualEditPage;
