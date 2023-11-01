import { Typography } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Create Recipe",
};

export default function CreateRecipePage() {
  return (
    <PageContainer title={metadata.title}>
      <Typography variant={"h3"}>Create Recipe</Typography>
    </PageContainer>
  );
}
