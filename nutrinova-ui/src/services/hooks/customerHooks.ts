import { useQuery, useMutation } from "@tanstack/react-query";
import { customerService, Customer } from '../customerService'; // Adjust path as needed

export const customerKeys = {
  all: "customer",
  getCustomer: "getCustomer",
  customerExists: "customerExists",
  customerID: (customerId: string) => [customerKeys.all, customerId],
};

// Hook to check if customer exists
export const useCustomerExists = (origin: "client" | "server") => {
  return useQuery({
    queryKey: [customerKeys.all, customerKeys.customerExists, origin],
    queryFn: () => customerService.customerExists(origin)
  });
};

// Hook to get a customer
export const useGetCustomer = () => {
  return useQuery({
    queryKey: [customerKeys.all, customerKeys.getCustomer],
    queryFn: () => customerService.getCustomerClient()
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
