import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import RecordMealStepper from "./_components/RecordMealStepper";

export const metadata = {
  title: "Record Meal",
};

export default function RecordMealPage() {
  return (
    <PatientContextPageContainer title={metadata.title}>
      <RecordMealStepper />
    </PatientContextPageContainer>
  );
}
