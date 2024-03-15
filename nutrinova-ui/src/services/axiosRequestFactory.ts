import { options } from "@/app/api/auth/[...nextauth]/options";
import axios, { AxiosInstance } from "axios";
import { Session, getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

let singletonInstance: AxiosInstance | null = null;

const createAuthenticatedAxiosInstanceFactory = async ({
  additionalHeaders = {},
  origin
}: {
  additionalHeaders: object,
  origin: "client" | "server"
}): Promise<AxiosInstance> => {
  if (singletonInstance) {
    return singletonInstance;
  }

  const session = origin === "client" ? await getSession() as Session : await getServerSession(options) as Session;
  if (!session.user.access_token) {
    throw new Error("Session not found or access token is missing");
  }
  const factoryHeaders = {
    Authorization: `Bearer ${session.user.access_token}`,
    ...additionalHeaders, // Merge any additional headers passed to the function
  };

  const url = origin === "client" ? "/be/" : process.env.NUTRINOVA_API_URL + "/be/"
  singletonInstance = axios.create({
    baseURL: url,
    headers: { ...factoryHeaders }
  });

  return singletonInstance;
}

export const resetSingletonInstance = () => {
  singletonInstance = null;
}

export default createAuthenticatedAxiosInstanceFactory;