import createAuthenticatedAxiosInstanceFactory from "./axiosRequestFactory";

export interface Customer {
  objectId: string;
  email: string;
}

const userService = {
  async customerExistsServer(id: string): Promise<boolean> {
    'use server'
    try {
      const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "server" })
      const response = await axiosInstance.get(`customer/exists?id=${id}`);
      console.log("Customer exists.", id);
      console.log("Customer exists.", response.data);
      return response.data === true;
    } catch (error) {
      console.error("Failed to check if customer exists...", error);
      throw new Error("Failed to check if customer exists...");
    }
  },

  async customerExistsClient(id: string): Promise<boolean> {
    try {
      const axiosInstance = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: { "Content-Type": "application/json" }, origin: "client" })
      const response = await axiosInstance.get(`customer/exists?id=${id}`);
      return response.data === true;
    } catch (error) {
      console.error("Failed to check if customer exists...", error);
      throw new Error("Failed to check if customer exists...");
    }
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
