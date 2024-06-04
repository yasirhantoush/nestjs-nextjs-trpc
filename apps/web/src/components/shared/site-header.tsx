"use client"
import { siteConfig } from "@/config/site"
import { ThemeToggle } from "@/components/theme-toggle"
import { BoomBox, Menu } from "lucide-react"
import { NavItem } from "@web/types/nav"
import { IsAuthenticated } from "../auth/components/IsAuthenticated"
import { IsNotAuthenticated } from "../auth/components/IsNotAuthenticated"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="bg-background border-b">
      {/* desktop screen */}
      <div className="hidden md:flex h-16 items-center justify-between">

        <div className="flex gap-6 items-center">

          {/* icon */}
          <Link href="/" className="flex items-center space-x-2">
            <BoomBox className="h-8 w-8" />
          </Link>

          {/* title */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="font-bold text-3xl">{siteConfig.name}</h1>
          </Link>

          {/* start menu */}
          <ul className="flex gap-4">
            {(siteConfig.mainNav || []).map((item: NavItem, index) =>
              <ShouldCheckAuth value={item.auth} key={index}>
                <li><Link key={index} href={item.href || ''}>{item.title}</Link></li>
              </ShouldCheckAuth>
            )}
          </ul>
        </div>

        {/* end menu */}
        <ul className="flex items-center gap-4">
          {(siteConfig.secondaryNav || []).map((item: NavItem, index) =>
            <ShouldCheckAuth value={item.auth} key={index}>
              <li><Link key={index} href={item.href || ''}>{item.title}</Link></li>
            </ShouldCheckAuth>
          )}
          <li><ThemeToggle /></li>
        </ul>
      </div>

      {/* small screen */}
      <div className="flex md:hidden h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          {/* icon */}
          <Link href="/" className="flex items-center space-x-2">
            <BoomBox className="h-8 w-8" />
          </Link>

          {/* title */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="font-bold text-3xl">{siteConfig.name}</h1>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger><Menu /></SheetTrigger>
          <SheetContent className="w-[80%]">
            <SheetHeader>
              <SheetTitle>Main Menu</SheetTitle>
              <hr />
              <ul className="flex flex-col gap-4">
                {/* main menu */}
                {(siteConfig.mainNav || []).map((item: NavItem, index) =>
                  <ShouldCheckAuth value={item.auth} key={index}>
                    <li><Link key={index} href={item.href || ''}>{item.title}</Link></li>
                  </ShouldCheckAuth>
                )}
                <hr />
                
                {/* secondary menu */}
                {(siteConfig.secondaryNav || []).map((item: NavItem, index) =>
                  <ShouldCheckAuth value={item.auth} key={index}>
                    <li><Link key={index} href={item.href || ''}>{item.title}</Link></li>
                  </ShouldCheckAuth>
                )}
                <hr />

                <li><ThemeToggle /></li>
                <hr />
              </ul>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function ShouldCheckAuth({ value, children }: { value?: boolean, children: any }) {
  if (value === true) return <IsAuthenticated>{children}</IsAuthenticated>
  if (value === false) return <IsNotAuthenticated>{children}</IsNotAuthenticated>
  return children
}
