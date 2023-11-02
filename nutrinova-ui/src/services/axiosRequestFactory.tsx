import axios, { AxiosInstance } from "axios";


const createAuthenticatedAxiosInstanceFactory = ({
  additionalHeaders = {},
  origin,
  sessionToken
}
  : {
    additionalHeaders: object,
    origin: "client" | "server",
    sessionToken: string | undefined
  }): AxiosInstance => {

  console.log("here is the session", sessionToken)
  if (!sessionToken) {
    throw new Error("Session not found or access token is missing");
  }

  const headers = {
    baseURL: origin === "client" ? "/be/" : process.env.NUTRINOVA_API_URL + "/be/",
    Authorization: `Bearer ${sessionToken}`,
    ...additionalHeaders, // Merge any additional headers passed to the function
  };

  console.log("here are the headers", headers)
  const axiosInstance = axios.create({ headers });

  return axiosInstance;
}

export default createAuthenticatedAxiosInstanceFactory;