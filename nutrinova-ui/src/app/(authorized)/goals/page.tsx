import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Goals",
};

export default async function GoalsPage() {
  const session = await getServerSession();

  return (
    <PatientContextPageContainer title={metadata.title}>
      <div>{session?.user.name}</div>
    </PatientContextPageContainer>
  );
}
