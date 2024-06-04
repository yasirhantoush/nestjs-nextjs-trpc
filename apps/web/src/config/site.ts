export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "My Blog",
  description: "This is my blog web site",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      auth: true,
    },
  ],
  secondaryNav: [
    {
      title: "Login",
      href: "/auth/login",
      auth: false,
    },
    {
      title: "Register",
      href: "/auth/login",
      auth: false,
    },
    {
      title: "Profile",
      href: "/auth/profile",
      auth: true,
    },
    {
      title: "Logout",
      href: "/auth/logout",
      auth: true,
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
