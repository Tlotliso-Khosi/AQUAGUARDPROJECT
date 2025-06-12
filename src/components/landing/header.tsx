"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { SiteMenu } from "../site-menu"

export function Header() {
  const [activeSection, setActiveSection] = React.useState("")
  const pathname = usePathname()

  const navigation = React.useMemo(
    () => [
      { name: "Home", href: "#home" },
      { name: "Solutions", href: "#solutions" },
      { name: "Features", href: "#features" },
      { name: "Technology", href: "#technology" },
      { name: "Impact", href: "#impact" },
      { name: "Contact", href: "#contact" },
    ],
    [],
  )

  // Update active section based on scroll position
  React.useEffect(() => {
    const sections = navigation.filter((item) => item.href.startsWith("#")).map((item) => item.href.substring(1))

    // Throttle scroll event for better performance
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Find the current visible section
          let foundActive = false

          for (const section of sections) {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              // Check if the section is in view (with some buffer for better UX)
              if (rect.top <= 150 && rect.bottom >= 150) {
                setActiveSection(section)
                foundActive = true
                break
              }
            }
          }

          // If at the top of the page and no section is active, set home as active
          if (!foundActive && window.scrollY < 100 && pathname === "/") {
            setActiveSection("")
          }

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname, navigation])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="bg-[#0A3622]/95 backdrop-blur-sm border-b border-[#1A4733]">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-14 sm:h-16 items-center justify-between gap-4 sm:gap-8">
            {/* Logo */}
            <div className="flex-none">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-1 sm:gap-2">
                <Image
                  src="/logo.svg"
                  alt="AquaguardAI Logo"
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                  priority
                />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#9EFF00] to-green-400 bg-clip-text text-transparent">
                  AquaguardAI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Only visible on very large screens */}
            <div className="hidden xl:flex xl:items-center xl:justify-center flex-1">
              <div className="flex items-center justify-center gap-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={
                      (item.href === "#home" && !activeSection) ||
                      (item.href.startsWith("#") && activeSection === item.href.substring(1))
                        ? "text-[#9EFF00] text-sm font-medium transition-colors"
                        : "text-gray-200 hover:text-[#9EFF00] text-sm font-medium transition-colors"
                    }
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop CTA - Only visible on very large screens */}
            <div className="hidden xl:flex xl:items-center xl:justify-end xl:flex-none xl:gap-x-4">
              <Button
                asChild
                variant="outline"
                className="text-white bg-transparent border-white/20 hover:bg-[#1A4733] hover:border-white/40"
              >
                <Link href="#contact">Contact Us</Link>
              </Button>
              <Button asChild className="bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622]">
                <Link href="/login">Login</Link>
              </Button>
            </div>

            {/* Site Menu - Visible on small to large screens but not on very small screens or very large screens */}
            <div className="hidden sm:flex xl:hidden ml-auto">
              <SiteMenu navigation={navigation} activeSection={activeSection} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
