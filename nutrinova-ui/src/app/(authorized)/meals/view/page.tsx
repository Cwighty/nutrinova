import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import { DailyMeals } from "@/app/(authorized)/meals/view/_components/DailyMeals";

export const metadata = {
  title: "View Meals",
};

export default function ViewMealsPage() {
  return (
    <PatientContextPageContainer title={metadata.title}>
      <DailyMeals />
    </PatientContextPageContainer>
  );
}
