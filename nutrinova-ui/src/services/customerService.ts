import createAuthenticatedAxiosInstanceFactory from "./axiosRequestFactory";
import { getSession } from "next-auth/react";

export interface Customer {
  objectId: string;
  email: string;
  issingleuser: boolean;
}

const fetchFromServer = async (url: string, origin: "client" | "server") => {
  const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin })
  const response = await axiosInstance.get(url);
  return response.data as unknown;
}

const postToServer = async (url: string, data: unknown) => {
  const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "client" })
  const response = await axiosInstance.post(url, JSON.stringify(data));
  return response.data as unknown;
}

export const customerService = {
  customerExists: async (origin: "client" | "server"): Promise<boolean> => {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("No user session found");
    }
    const res = await fetchFromServer(`customer/exists?id=${session?.user.id}`, origin);
    return res as boolean;
  },
  getCustomerClient: async (): Promise<Customer> => {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("No user session found");
    }
    return await fetchFromServer(`customer/get?id=${session?.user.id}`, "client") as Customer;
  },
  createCustomer: async (customer: Customer) => {
    try {
      await postToServer(`Customer/create`, customer);
      return true;
    }
    catch {
      return false;
    }

  }
};