import Link from "next/link"
import { Facebook, Mail, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const footerLinks = {
  company: [
    { name: "About Us", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Technology", href: "#technology" },
    { name: "Impact", href: "#impact" },
  ],
  support: [
    { name: "Contact", href: "mailto:aquaguardai@gmail.com" },
    { name: "Documentation", href: "#docs" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Email",
      href: "mailto:aquaguardai@gmail.com",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Website",
      href: "https://aquaguardai.com",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 py-16">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.svg" alt="AquaguardAI" width={32} height={32} />
              <span className="text-xl font-medium text-white">AquaguardAI</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Empowering farmers with AI-driven solutions for sustainable agriculture. 
              Join us in revolutionizing farming practices.
            </p>
            <div className="flex items-center gap-3">
              {footerLinks.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    item.bgColor,
                    "hover:opacity-80"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", item.color)} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-sm text-gray-400">
              Progress by Innovation – In partnership with UNIDO Global Cleantech Innovation Program (GCIP).
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="mailto:sebapalamajormohlatsane@gmail.com"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                sebapalamajormohlatsane@gmail.com
              </Link>
              <Link
                href="mailto:aquaguardai@gmail.com"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                aquaguardai@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 