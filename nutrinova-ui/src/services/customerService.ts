import axios, { AxiosInstance } from "axios";

export interface Customer {
  objectId: string;
  email: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NUTRINOVA_API_URL + "/be/",
  headers: {
    "Content-Type": "application/json",
  },
});

const userService = {
  async customerExists(id: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get(`customer/exists?id=${id}`);
      return response.data === true;
    } catch (error) {
      return false;
    }
  },

  async createCustomer(customer: Customer): Promise<boolean> {
    try {
      const customer_json = JSON.stringify(customer);
      const response = await axiosInstance.post(
        `customer/create`,
        customer_json,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Customer created.", customer.email);
      return response.status === 201;
    } catch (error) {
      console.log("Failed to create customer...", error);
      return false;
    }
  },
};

export default userService;
