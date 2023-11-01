import { PageContainer } from "@/components/PageContainer";
import { Typography } from "@mui/material";

export const metadata = {
  title: "Record Meal",
};

export default function RecordMealPage() {
  return (
    <PageContainer title={metadata.title}>
      <Typography variant={"h3"}>Record Meal</Typography>
    </PageContainer>
  );
}
