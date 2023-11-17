import { PageContainer } from "@/components/PageContainer";
import { MyRecipesSearchResultDataGrid } from "@/app/(authorized)/recipes/view/_components/MyRecipesSearchResultDataGrid";

export const metadata = {
  title: "My Recipes",
  description: "View your recipes",
};

export default function ViewRecipesPage() {
  return (
    <PageContainer title={"My Recipes"}>
      <MyRecipesSearchResultDataGrid />
    </PageContainer>
  );
}
