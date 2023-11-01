import { Session, getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { Typography } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Dashboard",
};

export default async function Home() {
  const session = (await getServerSession(options)) as Session;

  return (
    <PageContainer title={metadata.title}>
      {session && (
        <Typography variant={"h3"}>Welcome {session.user.name}</Typography>
      )}
      {!session && <Typography variant={"h3"}>Hi, Please Log In</Typography>}
    </PageContainer>
  );
}
