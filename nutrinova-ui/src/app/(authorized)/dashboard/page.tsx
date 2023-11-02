import { options } from "@/app/api/auth/[...nextauth]/options";
import { PageContainer } from "@/components/PageContainer";
import { Typography } from "@mui/material";
import { Session } from "inspector";
import { getServerSession } from "next-auth";


export const metadata = {
    title: "Dashboard",
};

export default async function DashboardPage() {
    const session = await getServerSession(options) as Session;
    console.log("here is the session", session);
    return (
        <PageContainer title={metadata.title}>
            <Typography variant={"h3"}>Dashboard</Typography>
        </PageContainer>
    );
}
