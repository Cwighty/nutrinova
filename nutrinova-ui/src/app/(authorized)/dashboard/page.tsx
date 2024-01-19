import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import { getServerSession } from "next-auth";
import DashboardLayout from "./_components/DashboardLayout";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  return (
    <PatientContextPageContainer title={metadata.title}>
      <DashboardLayout session={session} />
    </PatientContextPageContainer>
  );
}
