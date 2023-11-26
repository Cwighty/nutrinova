import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import { Typography } from "@mui/material";

export const metadata = {
  title: "Record Meal",
};

export default function RecordMealPage() {
  return (
    <PatientContextPageContainer title={metadata.title}>
      <Typography variant={"h3"}>Record Meal</Typography>
    </PatientContextPageContainer>
  );
}
