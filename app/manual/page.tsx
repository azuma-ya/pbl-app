import Manual from "@/components/manual/Manual";
import { trpc } from "@/trpc/client";

const ManualPage = async () => {
  const { manuals } = await trpc.manual.getManuals();

  return <Manual manuals={manuals} />;
};

export default ManualPage;
