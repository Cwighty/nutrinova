import createAuthenticatedAxiosInstanceFactory from "./axiosRequestFactory";

export interface Customer {
  objectId: string;
  email: string;
  issingleuser: boolean;
}

const fetchFromServer = async (url: string, origin: "client" | "server") => {
  const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin })
  const response = await axiosInstance.get(url);
  console.log("response", response);
  return response.data as unknown;
}

const postToServer = async (url: string, data: unknown) => {
  const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "client" })
  const response = await axiosInstance.post(url, JSON.stringify(data));
  return response.data as unknown;
}

export const customerService = {
  customerExists: async (id: string, origin: "client" | "server"): Promise<boolean> => {
    const res = await fetchFromServer(`customer/exists?id=${id}`, origin);
    return res as boolean;
  },
  getCustomer: (id: string) => fetchFromServer(`customer/get?id=${id}`, "client"),
  createCustomer: (customer: Customer) => postToServer(`Customer/create`, customer),
};