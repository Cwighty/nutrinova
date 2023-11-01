import { PageContainer } from "@/components/PageContainer";
import { Typography } from "@mui/material";

export const metadata = {
  title: "Create Food",
};

export default function CreateFoodPage() {
  return (
    <PageContainer title={metadata.title}>
      <Typography variant={"h3"}>Create Food</Typography>
    </PageContainer>
  );
}
