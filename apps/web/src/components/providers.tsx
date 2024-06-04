"use client"
import React, { useState } from "react"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AuthContextProvider } from "./auth/auth-provider"
import { ThemeProvider } from "./theme-provider"

function Providers({ children }: any) {
  const [client] = useState(new QueryClient())

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthContextProvider>
          <QueryClientProvider client={client}>
            <ReactQueryStreamedHydration>
              {children}
            </ReactQueryStreamedHydration>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  )
}

export { Providers as Provider }