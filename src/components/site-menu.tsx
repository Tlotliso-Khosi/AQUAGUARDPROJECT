"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

type SiteMenuProps = {
  navigation: { name: string; href: string }[]
  activeSection: string
}

export function SiteMenu({ navigation, activeSection }: SiteMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = React.useCallback(() => {
    setIsMenuOpen((prev) => !prev)
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = React.useCallback(() => {
    setIsMenuOpen(false)
    document.body.style.overflow = ""
  }, [])

  // Clean up the body style when component unmounts
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const renderNavLinks = React.useCallback(
    (mobile = false) =>
      navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            mobile
              ? "block w-full text-center py-5 text-xl font-semibold transition-colors border-b border-[#1A4733]"
              : "text-sm font-medium transition-colors",
            (item.href === "#home" && activeSection === "home") ||
              (item.href.startsWith("#") && activeSection === item.href.substring(1))
              ? mobile
                ? "bg-[#1A4733] text-[#9EFF00]"
                : "text-[#9EFF00]"
              : mobile
                ? "text-white hover:bg-[#1A4733] hover:text-[#9EFF00]"
                : "text-gray-200 hover:text-[#9EFF00]",
          )}
          onClick={mobile ? closeMenu : undefined}
        >
          {item.name}
        </Link>
      )),
    [navigation, activeSection, closeMenu],
  )

  return (
    <>
      {/* Menu button */}
      <Button
        variant="default"
        size="default"
        onClick={toggleMenu}
        className="bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622] font-bold flex items-center gap-2"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <>
            <X className="h-5 w-5" aria-hidden="true" />
            Close
          </>
        ) : (
          <>
            <Menu className="h-5 w-5" aria-hidden="true" />
            Menu
          </>
        )}
      </Button>

      {/* Full-screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A3622] flex flex-col overflow-y-auto">
          <div className="container px-4 py-4 flex items-center justify-between border-b border-[#1A4733]">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <Image src="/logo.svg" alt="AquaguardAI Logo" width={32} height={32} priority />
              <span className="text-xl font-bold bg-gradient-to-r from-[#9EFF00] to-green-400 bg-clip-text text-transparent">
                AquaguardAI
              </span>
            </Link>
            <Button
              variant="default"
              onClick={closeMenu}
              className="bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622] font-bold flex items-center gap-2"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
              Close
            </Button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
            <div className="px-4 w-full">
              <div className="flex flex-col w-full">{renderNavLinks(true)}</div>
            </div>

            <div className="px-4 mt-8 space-y-4 w-full">
              <Button
                asChild
                variant="outline"
                className="w-full text-white border-white/30 hover:bg-[#1A4733] hover:border-white/60 py-6 text-xl"
              >
                <Link href="#contact" onClick={closeMenu}>
                  Contact Us
                </Link>
              </Button>
              <Button asChild className="w-full bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622] py-6 text-xl font-bold">
                <Link href="/login" onClick={closeMenu}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
