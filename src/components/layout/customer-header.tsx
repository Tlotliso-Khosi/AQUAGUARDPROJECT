"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingBag,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
}

export function CustomerSidebar() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/customer/dashboard",
      icon: Home,
    },
    {
      title: "Market",
      href: "/customer/market",
      icon: ShoppingBag,
      submenu: [
        { title: "My Products", href: "/customer/market/my-products" },
        { title: "Marketplace", href: "/customer/market/marketplace" },
        { title: "Shopping Cart", href: "/customer/market/cart" },
      ],
    },
    {
      title: "Reports",
      href: "/customer/reports",
      icon: FileText,
      submenu: [
        { title: "Sales Reports", href: "/customer/reports/sales" },
        { title: "Purchase Reports", href: "/customer/reports/purchases" },
        { title: "Financial Summary", href: "/customer/reports/financial" },
      ],
    },
    {
      title: "Community",
      href: "/customer/community",
      icon: Users,
    },
    {
      title: "Chatroom",
      href: "/customer/chatroom",
      icon: MessageSquare,
    },
  ]

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <div className="flex h-screen flex-col border-r bg-green-950 text-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/customer/dashboard" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">AquaGuard</div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div className="relative">
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-green-900",
                      pathname.startsWith(item.href) && "bg-green-900",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.title}</span>
                    {openSubmenu === item.title ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {openSubmenu === item.title && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2 text-white transition-all hover:bg-green-900",
                            pathname === subitem.href && "bg-green-900",
                          )}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-green-900",
                    pathname === item.href && "bg-green-900",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-green-900">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Account Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/auth/logout">
                <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-green-900">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
