import { ClientRouter } from "@/components/ClientRouter";
import customerService from "@/services/customerService";
import { Session, getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options) as Session;
  if (session.user.id !== undefined) {
    const customerExists = await customerService.customerExistsServer(session.user.id);
    if (customerExists) {
      return (
        <ClientRouter route="/dashboard" />
      );
    } else {
      return (
        <ClientRouter route="/welcome" />
      );
    }
  }
  else {
    return (
      <div>Something went wrong</div>
    );
  }
}
