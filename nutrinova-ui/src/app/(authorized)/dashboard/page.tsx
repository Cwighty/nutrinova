import { PageContainer } from "@/components/PageContainer";
import { Typography } from "@mui/material";


export const metadata = {
    title: "Dashboard",
};

export default function DashboardPage() {
    return (
        <PageContainer title={metadata.title}>
            <Typography variant={"h3"}>Dashboard</Typography>
        </PageContainer>
    );
}
