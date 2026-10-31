// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (count, err: any) => {
        const status = err?.response?.status;
        if (status && [401, 403, 404].includes(status)) return false;
        return count < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});