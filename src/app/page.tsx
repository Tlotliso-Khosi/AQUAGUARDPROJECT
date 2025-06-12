"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section"
import { KeyFeaturesSection } from "@/components/landing/key-features-section"
import { TechnologySpotlightSection } from "@/components/landing/technology-spotlight-section"
import { FoundersSection } from "@/components/landing/founders-section"
import { ImpactSection } from "@/components/landing/impact-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CallToActionSection } from "@/components/landing/call-to-action-section"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { FloatingMenuButton } from "@/components/floating-menu-button" // Add floating menu

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="home" className="pt-0 -mt-[1px]">
        <HeroSection />
      </div>
      <div id="solutions">
        <ProblemSolutionSection />
      </div>
      <div id="features">
        <KeyFeaturesSection />
      </div>
      <div id="technology">
        <TechnologySpotlightSection />
      </div>
      <FoundersSection />
      <div id="impact">
        <ImpactSection />
      </div>
      <TestimonialsSection />
      <div id="contact">
        <CallToActionSection />
      </div>
      <Footer />
      <FloatingMenuButton /> {/* Add the floating menu button */}
    </main>
  )
}
