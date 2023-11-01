'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  if (!session) {
    // redirect to single user flow
    return (
      <div>
        <h1>Hi, please login { }</h1>
      </div>
    );
  } else {

    router.push("/dashboard")
  }
}
