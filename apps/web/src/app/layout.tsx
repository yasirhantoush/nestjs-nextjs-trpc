import "@web/styles/globals.css"
import 'react-toastify/dist/ReactToastify.css';
import { Metadata, Viewport } from "next"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/shared/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { Provider } from "@/components/providers"
import { ToastContainer } from 'react-toastify';
import { version } from "@/lib/version"
import { fontExpo } from "@web/lib/fonts"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            fontExpo.className,
          )}
        >
          <Provider>
            <div className="container mx-auto relative flex flex-col">
              <SiteHeader />
              <section className="flex-1 gap-4 pb-8 pt-6 md:py-10">
                {children}
              </section>
              <footer className="text-xs text-center mt-8 my-4">
                All Rights Reserved - {siteConfig.name}
                <br />
                Version: {version}
              </footer>
            </div>
            <ToastContainer position="bottom-left" rtl={true} theme="colored" style={{ fontFamily: 'expo' }} />
            <TailwindIndicator />
          </Provider>
        </body>
      </html>
    </>
  )
}
