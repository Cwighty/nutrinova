import { PageContainer } from "@/components/PageContainer";
import CreateRecipeForm from "./_components/CreateRecipeForm";

export const metadata = {
  title: "Create Recipe",
};

export default function CreateRecipePage() {
  return (
    <PageContainer title={metadata.title}>
      <CreateRecipeForm />
    </PageContainer>
  );
}