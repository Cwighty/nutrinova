import { Typography } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Settings",
};

export default function Settings() {
  return (
    <PageContainer title={"Settings"}>
      <Typography variant={"h3"}>Settings</Typography>
    </PageContainer>
  );
}
