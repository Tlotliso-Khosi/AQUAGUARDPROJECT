"use client"

import * as React from "react"
import { SiteMenu } from "./site-menu"
import { usePathname } from "next/navigation"

export function FloatingMenuButton() {
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
            setActiveSection("home")
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
    <div className="fixed bottom-6 right-6 z-40 sm:hidden">
      <SiteMenu navigation={navigation} activeSection={activeSection} />
    </div>
  )
}
