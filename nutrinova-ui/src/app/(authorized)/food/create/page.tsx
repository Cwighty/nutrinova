import { PageContainer } from "@/components/PageContainer";
import CreateFoodForm from "./_components/CreateFoodForm";

export const metadata = {
  title: "Create Food",
};

export default function CreateFoodPage() {
  return (
    <PageContainer title={metadata.title}>
      <CreateFoodForm />
    </PageContainer>
  );
}
