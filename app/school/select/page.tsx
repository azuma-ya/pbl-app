import SchoolSelect from "@/components/school/SchoolSelect";
import { getAuthSession } from "@/lib/auth";
import { trpc } from "@/trpc/client";

const SchoolSelectPage = async () => {
  const user = await getAuthSession();
  const { schools, totalScools } = await trpc.school.getScools({});

  return <SchoolSelect schools={schools} userId={user!.id} />;
};

export default SchoolSelectPage;
