import createAuthenticatedAxiosInstanceFactory from "./axiosRequestFactory";

export interface Customer {
  objectId: string;
  email: string;
}

const userService = {
  async customerExistsServer(id: string): Promise<boolean> {
    'use server'
    const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "server" })
    const response = await axiosInstance.get(`customer/exists?id=${id}`);
    return response.data === true;
  },

  async customerExistsClient(id: string): Promise<boolean> {
    const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "client" })
    const response = await axiosInstance.get(`customer/exists?id=${id}`);
    return response.data === true;
  },

  async createCustomer(customer: Customer): Promise<boolean> {
    try {
      const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "client" })
      const customer_json = JSON.stringify(customer);
      await axiosInstance.post(
        `Customer/create`,
        customer_json,
      );
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default userService;
