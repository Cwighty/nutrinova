import { PageContainer } from "@/components/PageContainer";
import { RecipeSearch } from "@/app/(authorized)/food/view/_components/RecipeSearch";

export const metadata = {
  title: "My Recipes",
  description: "View your recipes",
};

export default function ViewRecipesPage() {
  return (
    <PageContainer title={"My Recipes"}>
      <RecipeSearch />
    </PageContainer>
  );
}
