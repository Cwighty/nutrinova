import { PageContainer } from "@/components/PageContainer";
import { Typography } from "@mui/material";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <PageContainer title={metadata.title}>
      <Typography variant={"h3"}>Account</Typography>
    </PageContainer>
  );
}
