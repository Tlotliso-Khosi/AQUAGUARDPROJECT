import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"

export function HeroSection() {
  // JSON-LD structured data for local business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AquaguardAI",
    "url": "https://aquaguardai.com",
    "logo": "https://aquaguardai.com/logo.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+266 5975 3456",
      "contactType": "customer service",
      "email": "aquaguardai@gmail.com",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "National University of Lesotho",
      "addressLocality": "Roma",
      "addressRegion": "Maseru",
      "addressCountry": "Lesotho"
    },
    "description": "AquaguardAI provides smart agricultural solutions and AI-driven irrigation systems for modern farming."
  }

  return (
    <>
      <Script id="organization-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <section className="relative overflow-hidden bg-[#0A3622] pt-24 pb-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3622] via-[#0A3622] to-[#072718]"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 mb-8 text-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1 hover:text-[#9EFF00] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-gray-200 text-lg">
              Have questions about our smart agricultural solutions? Contact us today and discover how 
              <span className="text-[#9EFF00]"> AquaguardAI</span> can transform your farming operations.
            </p>
          </div>
        </div>
      </section>
    </>
  )
} 