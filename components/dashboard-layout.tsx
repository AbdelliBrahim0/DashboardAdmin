"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet, Users, Store, BarChart3, ShieldCheck, Menu, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Merchants",
    href: "/dashboard/merchants",
    icon: Store,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Wallet,
  },
  {
    title: "Verification",
    href: "/dashboard/verification",
    icon: ShieldCheck,
  },
  {
    title: "Codes Cadeaux",
    href: "/codeCadeau",
    icon: Gift,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col bg-dark-1 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-dark-2 px-6">
          <Wallet className="h-6 w-6 text-orange" />
          <span className="text-xl font-bold">Be9ik</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("sidebar-item", pathname === item.href && "active")}>
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-3 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-dark-1">
          <div className="flex h-16 items-center gap-2 border-b border-dark-2 px-6">
            <Wallet className="h-6 w-6 text-orange" />
            <span className="text-xl font-bold">Be9ik</span>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("sidebar-item", pathname === item.href && "active")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden bg-black p-4 md:p-8">{children}</main>
    </div>
  )
}
