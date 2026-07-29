"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CompareModal } from "@/components/product/CompareModal";

import { StoreProvider } from "@/context/StoreContext";
import { GlobalModals } from "@/components/modals/GlobalModals";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <StoreProvider>
          {children}
          <CartDrawer />
          <CompareModal />
          <GlobalModals />
        </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
