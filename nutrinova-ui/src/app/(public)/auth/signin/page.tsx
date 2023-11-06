'use client'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import customerService from "@/services/customerService";

export default function Signin() {
    const router = useRouter();
    const { status, data } = useSession();

    useEffect(() => {
        async function handleSigninRedirect() {
            if (status === "unauthenticated") {
                void signIn("oidc");
            } else if (status === "authenticated") {
                if (data?.user.id === undefined) {
                    return;
                }
                const customerExists = await customerService.customerExistsClient(data.user.id);
                if (customerExists) {
                    void router.push("/dashboard");
                } else {
                    void router.push("/welcome");
                }
            }
        }
        void handleSigninRedirect();
    }, [data?.user.id, router, status]);

    return <div></div>;
}