'use client'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signin() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            console.log("No JWT");
            console.log(status);
            void signIn("oidc");
        } else if (status === "authenticated") {
            void router.push("/");
        }
    }, [router, status]);

    return <div></div>;
}