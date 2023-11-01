import { ClientRouter } from "@/components/ClientRouter";
import customerService from "@/services/customerService";
import { Session, getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  // if user exits go to dashboard else go to createUser flow
  const session = await getServerSession(options) as Session;
  console.log(session)
  if (session.user.id != undefined && await customerService.customerExists(session.user.id)) {
    // redirect to single user flow
    return (
      <ClientRouter route="/dashboard" />
    );
  } else {
    <>
      <h1> Make user here</h1>
    </>
  }

}
