import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import GoalsDetail from "./_components/GoalsDetail";

export const metadata = {
  title: "Goals",
};

export default function GoalsPage() {

  return (
    <PatientContextPageContainer title={metadata.title}>
      <>
        <GoalsDetail />
      </>
    </PatientContextPageContainer>
  );
}