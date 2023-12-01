'use client'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { Toaster, toast } from "react-hot-toast";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          toast.error("You are not authorized to perform this action. Please sign out and in again.");
        }
        toast.error("There was an error with your request: " + error.message);
      } else {
        toast.error("There was an error with your request");
      }
    },
  }),
  defaultOptions: {
    queries: {
      // default query options  https://tanstack.com/query/v4/docs/react/reference/QueryClient
    },
  },
});

export const QueryClientNextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </QueryClientProvider>
  )
}