import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options);
  if (!session) {
    return (
      <div>
        <h1>Hi, please login</h1>
      </div>
    );
  }
  return (
    <>
      {session && (
        <div>
          <h1>Welcome {session.user.name}</h1>
        </div>
      )}
    </>
  );
}
