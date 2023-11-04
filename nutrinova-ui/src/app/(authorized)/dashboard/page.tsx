import { options } from "@/app/api/auth/[...nextauth]/options";
import { PageContainer } from "@/components/PageContainer";
import { Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { AtomSpinner } from "@/components/AtomSpinner/AtomSpinner";


export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
    const session = await getServerSession(options);
    console.log(session);
    return (
        <PageContainer title={metadata.title}>
            <Typography variant={"h3"}>Dashboard</Typography>
            <AtomSpinner />
        </PageContainer>
    );
}
