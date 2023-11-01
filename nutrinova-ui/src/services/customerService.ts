import axios, { AxiosInstance } from "axios";

export interface Customer {
  objectId: string;
  email: string;
}

const serverAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NUTRINOVA_API_URL + "/be/",
  headers: {
    "Content-Type": "application/json",
  },
});

const clientAxiosInstance: AxiosInstance = axios.create({
  baseURL: "/be/",
  headers: {
    "Content-Type": "application/json",
  },
});

const userService = {
  async customerExistsServer(id: string): Promise<boolean> {
    'use server'
    try {
      const response = await serverAxiosInstance.get(`customer/exists?id=${id}`);
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
      const response = await clientAxiosInstance.get(`customer/exists?id=${id}`);
      return response.data === true;
    } catch (error) {
      console.error("Failed to check if customer exists...", error);
      throw new Error("Failed to check if customer exists...");
    }
  },

  async createCustomer(customer: Customer): Promise<boolean> {
    try {
      const customer_json = JSON.stringify(customer);
      await clientAxiosInstance.post(
        `Customer/create`,
        customer_json,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default userService;
