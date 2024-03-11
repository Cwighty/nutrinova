"use client";
import React from "react";

import Masonry from "@mui/lab/Masonry";
import { Session } from "next-auth";
import DailyCaloriesCard from "./Cards/DailyCalories";
import DailyRecapCard from "./Cards/DailyRecap/DailyRecapCard";
import NotificationsCard from "./Cards/NotificationsCard";
import WelcomeCard from "./Cards/WelcomeCard";
import ReminderCard from "./Cards/ReminderCard";
import { useContext } from "react";
import { PatientContext } from "@/components/providers/PatientProvider";
import { useGetCurrentPatientImageQuery } from "../../patients/patientHooks";

interface DashboardLayoutProps {
  session?: Session | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ session }) => {
  // This would be replaced with state management in a real application
  const { selectedPatient } = useContext(PatientContext);
  const { data: image } = useGetCurrentPatientImageQuery(selectedPatient?.id ?? '')
  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
      <img src={image as string} alt="Patient Image" />
      <WelcomeCard caretakerName={session?.user.name} />
      {/* <CalendarCard /> */}
      <NotificationsCard />
      <DailyCaloriesCard />
      <DailyRecapCard />
      <ReminderCard
        title="Medication Time"
        time="8:00 AM - 9:00 AM"
        description="It's time for the morning medication. Please ensure it's taken with a glass of water."
        image={"pill.jpg"}
      />
    </Masonry>
  );
};

export default DashboardLayout;
