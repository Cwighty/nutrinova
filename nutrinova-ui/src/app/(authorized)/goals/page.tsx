import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import { getServerSession } from "next-auth";
import { DailyNutrientCarouselSelector } from "./_components/DailyNutrientCarouselSelector";

export const metadata = {
  title: "Goals",
};

export default async function GoalsPage() {
  const session = await getServerSession();

  return (
    <PatientContextPageContainer title={metadata.title}>
      <>
        <h1>{session?.user.email}</h1>
        <DailyNutrientCarouselSelector />
      </>
    </PatientContextPageContainer>
  );
}
