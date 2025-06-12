"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarItemProps {
  path: string
  icon: LucideIcon
  label: string
  isActive: boolean
  hasSubmenu?: boolean
  isOpen?: boolean
  onClick?: () => void
}

function SidebarItem({ path, icon: Icon, label, isActive, hasSubmenu, isOpen, onClick }: SidebarItemProps) {
  if (hasSubmenu) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm transition-all hover:bg-slate-100/80",
          isActive ? "bg-green-950 text-white hover:bg-green-950" : "text-slate-500",
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "text-slate-500")} />
          <span>{label}</span>
        </div>
        {isOpen ? (
          <ChevronDown className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
        ) : (
          <ChevronRight className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
        )}
      </button>
    )
  }

  return (
    <Link
      href={path}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all hover:bg-slate-100/80",
        isActive ? "bg-green-950 text-white hover:bg-green-950" : "text-slate-500",
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "text-slate-500")} />
      {label}
    </Link>
  )
}

interface SubItemProps {
  path: string
  label: string
  isActive: boolean
}

function SubItem({ path, label, isActive }: SubItemProps) {
  return (
    <Link
      href={path}
      className={cn(
        "flex w-full items-center rounded-lg px-4 py-2 text-sm transition-all hover:bg-slate-100/80",
        isActive ? "bg-green-950 text-white hover:bg-green-950" : "text-slate-500",
      )}
    >
      {label}
    </Link>
  )
}

interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
  submenu?: { title: string; href: string }[]
}

export default function CustomerSidebar() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)

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
    <div className="fixed left-4 top-4 flex h-[calc(100vh-32px)] w-[250px] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-2 px-2 pb-6 border-b border-slate-100">
        <Image src="/logo-dark.svg" alt="AquaGuard Logo" width={32} height={32} />
        <span className="text-base font-semibold text-slate-900">AquaGuard</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 pt-6 overflow-y-auto">
        {sidebarItems.map((item) => (
          <div key={item.title} className="mb-1">
            <SidebarItem
              path={item.href}
              icon={item.icon}
              label={item.title}
              isActive={item.submenu ? pathname.startsWith(item.href) : pathname === item.href}
              hasSubmenu={!!item.submenu}
              isOpen={openSubmenu === item.title}
              onClick={item.submenu ? () => toggleSubmenu(item.title) : undefined}
            />

            {item.submenu && openSubmenu === item.title && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu.map((subitem) => (
                  <SubItem
                    key={subitem.href}
                    path={subitem.href}
                    label={subitem.title}
                    isActive={pathname === subitem.href}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 text-sm text-slate-500 bg-slate-100/80 hover:bg-slate-100/60 hover:text-slate-700 mb-2"
          >
            <Settings className="h-[18px] w-[18px] text-slate-500" />
            Settings
          </Button>
        </Link>
        <Link href="/auth/logout">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 text-sm text-slate-500 bg-slate-100/80 hover:bg-slate-100/60 hover:text-slate-700"
          >
            <LogOut className="h-[18px] w-[18px] text-slate-500" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}
