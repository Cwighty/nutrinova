import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import { getServerSession } from "next-auth";
import GoalsDetail from "./_components/GoalsDetail";

export const metadata = {
  title: "Goals",
};

export default async function GoalsPage() {
  const session = await getServerSession();
  console.log(session)

  return (
    <PatientContextPageContainer title={metadata.title}>
      <>
        <GoalsDetail />
      </>
    </PatientContextPageContainer>
  );
}