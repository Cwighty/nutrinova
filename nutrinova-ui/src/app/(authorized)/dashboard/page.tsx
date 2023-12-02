import { Grid } from "@mui/material";
import { WebSocketTest } from "./WebSocketTest";
import CalendarCard from "./_components/Cards/CalendarCard";
import DailyCaloriesCard from "./_components/Cards/DailyCalories";
import DailyRecapCard from "./_components/Cards/DailyRecap";
import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";
import WelcomeCard from "./_components/Cards/WelcomeCard";
import { getSession } from "next-auth/react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  return (
    <PatientContextPageContainer title={metadata.title}>
      <Grid item xs={12} md={4}>
        <WelcomeCard caretakerName={session?.user.name} />
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <CalendarCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <DailyRecapCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <DailyCaloriesCard />
        </Grid>
        {/* You can continue adding other cards or content here */}
      </Grid>
      <WebSocketTest />
    </PatientContextPageContainer>
  );
}
