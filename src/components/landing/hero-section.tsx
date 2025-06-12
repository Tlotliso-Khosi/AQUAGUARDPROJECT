import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A3622] py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A3622] via-[#0A3622] to-[#072718]"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="max-w-2xl">
            <div className="space-y-8">
              {/* Tag */}
              <div className="inline-block">
                <span className="text-[#9EFF00] text-sm font-medium bg-[#1A4733] px-4 py-2 rounded-full">
                Let&apos;s grow, Let&apos;s go
                </span>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Transform Your Farm With Smart Automation
                </h1>

                <p className="text-gray-200 text-lg leading-relaxed">
                  Our AI-driven system transforms traditional farming into smart agriculture, delivering 
                  <span className="text-[#9EFF00]"> 40% cost reduction</span> and 
                  <span className="text-[#9EFF00]"> 85% sustainability improvement</span>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" 
                  className="bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622] font-semibold rounded-full px-8 py-6 w-full sm:w-auto transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]">
                  <Link href="#solutions">
                    Start Optimizing Today
                    <span className="ml-2 inline-block">→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" 
                  className="text-white border-white/60 bg-transparent hover:bg-[#1A4733] hover:border-white w-full sm:w-auto py-6 rounded-full transition-all duration-300">
                  <Link href="#contact">
                    Schedule Demo
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#1A4733]">
                <div>
                  <p className="text-[#9EFF00] text-3xl font-bold">40%</p>
                  <p className="text-gray-300 text-sm">Cost Savings</p>
                </div>
                <div>
                  <p className="text-[#9EFF00] text-3xl font-bold">98%</p>
                  <p className="text-gray-300 text-sm">AI Accuracy</p>
                </div>
                <div>
                  <p className="text-[#9EFF00] text-3xl font-bold">5K+</p>
                  <p className="text-gray-300 text-sm">Farmers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:h-[600px]">
            <div className="relative h-full rounded-2xl overflow-hidden">
              <Image
                src="/images/hero-4.webp"
                alt="Smart agriculture automation system"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3622]/60 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-[#1A4733]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[#9EFF00] text-sm">
              Empowering <span className="font-bold">50+ farms</span> across Lesotho
            </p>
            <p className="text-white/70 text-sm">
              Limited time: 3 months free monitoring
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 