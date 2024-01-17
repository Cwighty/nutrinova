import { useQuery, useMutation } from "@tanstack/react-query";
import { customerService, Customer } from '../customerService'; // Adjust path as needed

export const customerKeys = {
  all: "customer",
  getCustomer: "getCustomer",
  customerExists: "customerExists",
  customerID: (customerId: string) => [customerKeys.all, customerId],
};

// Hook to check if customer exists
export const useCustomerExists = (id: string, origin: "client" | "server") => {
  return useQuery({
    queryKey: [customerKeys.all, customerKeys.customerExists, id, origin],
    queryFn: () => customerService.customerExists(id, origin)
  });
};

// Hook to get a customer
export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: [customerKeys.all, customerKeys.getCustomer, id],
    queryFn: () => customerService.getCustomer(id)
  });
};

// Hook to create a customer
export const useCreateCustomer = () => {
  return useMutation(
    {
      mutationFn: (customer: Customer) => customerService.createCustomer(customer)
    }
  );
};
