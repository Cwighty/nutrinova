import { Typography } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "View Recipes",
};

export default function ViewRecipesPage() {
  return (
    <PageContainer title={"View Recipes"}>
      <Typography variant={"h3"}>View Recipes</Typography>
    </PageContainer>
  );
}
