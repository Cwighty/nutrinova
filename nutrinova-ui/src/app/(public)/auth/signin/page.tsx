'use client'
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import customerService from "@/services/customerService";
import CenteredSpinner from "@/components/CenteredSpinner";

export default function Signin() {
    const router = useRouter();

    useEffect(() => {
        async function handleSigninRedirect() {
            const session = await getSession();
            if (session === undefined || session === null) {
                void signIn("oidc");
            }
            else {
                if (session.user.id === undefined || session.user.id === null) {
                    throw new Error("Could not get user id from session");
                }
                const customerExists = await customerService.customerExistsClient(session.user.id);
                if (customerExists) {
                    void router.push("/dashboard");
                } else {
                    void router.push("/welcome");
                }
            }
        }
        void handleSigninRedirect();
    }, [router]);

    return <CenteredSpinner message="Signing in..." />
}