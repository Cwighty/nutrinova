import { PageContainer } from "@/components/PageContainer";
import { AllPatientGoals } from "./_components/AllPatientsGoals";

export const metadata = {
  title: "Goals",
};

export default function Goals() {
  return (
    <PageContainer title={"Goals"}>
      <AllPatientGoals />
    </PageContainer>
  );
}