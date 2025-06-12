"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileSidebarProps {
  links: {
    href: string
    label: string
    icon?: React.ReactNode
  }[]
}

export function MobileSidebar({ links }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Floating menu button - only visible on mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button
          onClick={toggleSidebar}
          className="h-12 w-12 rounded-full bg-[#0A3622] hover:bg-[#1A4733] text-white shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar panel - slides in from right */}
      <div
        className={cn(
          "fixed bottom-20 right-6 z-40 w-64 rounded-lg bg-white shadow-lg transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-[120%]",
        )}
      >
        <div className="flex flex-col p-4 space-y-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
