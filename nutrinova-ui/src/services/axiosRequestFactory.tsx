import axios from "axios";
import { getSession } from "next-auth/react";

const createAuthenticatedAxiosInstance = async (additionalHeaders = {}) => {
  const session = await getSession();

  if (!session || !session.user.access_token) {
    throw new Error("Session not found or access token is missing");
  }

  const headers = {
    Authorization: `Bearer ${session.user.access_token}`,
    ...additionalHeaders, // Merge any additional headers passed to the function
  };

  const axiosInstance = axios.create({ headers });

  return axiosInstance;
}

export default createAuthenticatedAxiosInstance;