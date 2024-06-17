import ManualDetail from "@/components/manual/ManualDetail";

interface ManualDetailPageProps {
  params: {
    manualId: string;
  };
}

const ManualDetailPage = ({ params }: ManualDetailPageProps) => {
  return <ManualDetail />;
};

export default ManualDetailPage;
