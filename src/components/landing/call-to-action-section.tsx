import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

const benefits = [
  "14-day free trial",
  "No credit card required",
  "Full feature access"
]

export function CallToActionSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#0A3622] py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A3622] via-[#0A3622] to-[#072718]"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Grow Smarter?
          </h2>
          <p className="text-gray-200 text-lg mb-8 leading-relaxed">
            Join farmers already saving resources and boosting profits with 
            <span className="text-[#9EFF00]"> AquaguardAI</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622] font-semibold rounded-full px-8 py-6 w-full sm:w-auto transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
            >
              <Link href="#trial" className="flex items-center gap-3">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-white border-white/60 bg-transparent hover:bg-[#1A4733] hover:border-white w-full sm:w-auto py-6 rounded-full transition-all duration-300"
            >
              <Link href="mailto:aquaguardai@gmail.com" className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                Contact Us
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {benefits.map((benefit) => (
              <div 
                key={benefit}
                className="text-sm text-[#9EFF00] bg-[#1A4733] px-4 py-2 rounded-full"
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 