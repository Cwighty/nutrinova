import { options } from "@/app/api/auth/[...nextauth]/options";
import axios, { AxiosInstance } from "axios";
import { Session, getServerSession } from "next-auth";



const createAuthenticatedAxiosInstanceFactory = async ({
  additionalHeaders = {},
  origin
}
  : {
    additionalHeaders: object,
    origin: "client" | "server"
  }): Promise<AxiosInstance> => {

  const session = await getServerSession(options) as Session;
  console.log("here is the session", session.user.access_token)
  if (!session.user.access_token) {
    throw new Error("Session not found or access token is missing");
  }
  const factoryHeaders = {

    Authorization: `Bearer ${session.user.access_token}`,
    ...additionalHeaders, // Merge any additional headers passed to the function
  };

  console.log("here are the headers", factoryHeaders)
  const url = origin === "client" ? "/be/" : process.env.NUTRINOVA_API_URL + "/be/"
  const axiosInstance = axios.create(
    {
      baseURL: url,
      headers: { ...factoryHeaders }
    });

  return axiosInstance;
}

export default createAuthenticatedAxiosInstanceFactory;