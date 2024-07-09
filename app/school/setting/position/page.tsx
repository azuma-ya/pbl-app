import SchoolPosition from "@/components/school/SchoolPosition";
import { trpc } from "@/trpc/client";

export const revalidate = 0;

const PositionPage = async () => {
  const { members } = await trpc.user.getScooleMembers({});

  const { roles } = await trpc.school.getRoles({});

  return <SchoolPosition users={members} roles={roles} />;
};

export default PositionPage;
