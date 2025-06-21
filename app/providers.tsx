"use client"

import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
import { useState } from "react" // Pastikan useState diimpor

export function Providers({ children }: { children: React.ReactNode }) {
  // Inisialisasi QueryClient hanya sekali menggunakan useState
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
