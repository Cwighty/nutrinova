import { Typography } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "View Meals",
};

export default function ViewMealsPage() {
  return (
    <PageContainer title={metadata.title}>
      <Typography variant={"h3"}>View Meals</Typography>
    </PageContainer>
  );
}
