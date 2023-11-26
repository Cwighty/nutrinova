import { Typography } from "@mui/material";
import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";

export const metadata = {
  title: "View Meals",
};

export default function ViewMealsPage() {
  return (
    <PatientContextPageContainer title={metadata.title}>
      <Typography variant={"h3"}>View Meals</Typography>
    </PatientContextPageContainer>
  );
}
