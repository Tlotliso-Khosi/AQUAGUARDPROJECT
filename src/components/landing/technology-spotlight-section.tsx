import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Cpu, Scale, Smartphone, Globe, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const technologies = [
  {
    title: "Core Innovation",
    description: "Integrates IoT sensors, AI analytics, and automation to create a seamless farming experience.",
    icon: Cpu,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Scalable Solution",
    description: "Designed for commercial farms in Lesotho's lowlands and subsistence farmers in Berea, Maseru, and Mafeteng.",
    icon: Scale,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Easy Access",
    description: "Control your farm through our website or WhatsApp—no tech expertise needed.",
    icon: Smartphone,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Global Standards",
    description: "Built with international best practices and local expertise for maximum impact.",
    icon: Globe,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
]

export function TechnologySpotlightSection() {
  return (
    <section id="technology" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
            Technology
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            AI That Works for{" "}
            <span className="text-purple-600">Your Farm</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Seamlessly integrate cutting-edge technology into your farming operations
          </p>
        </div>

        <div className="mx-auto mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Technology Cards */}
            <div className="space-y-8">
              {technologies.map((tech) => (
                <div
                  key={tech.title}
                  className="bg-white border border-gray-100 rounded-lg p-6 transition-all duration-300 hover:border-purple-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("rounded-lg p-2", tech.bgColor)}>
                      <tech.icon className={cn("h-5 w-5", tech.color)} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {tech.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Platform Preview */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Platform Interface</h3>
                  <p className="text-gray-600 mb-6">
                    Experience the future of farming with our intuitive interface that puts powerful AI tools at your fingertips
                  </p>
                  <Button 
                    asChild 
                    className="bg-purple-600 hover:bg-purple-700 rounded-md px-6"
                  >
                    <Link href="#demo" className="flex items-center gap-2 text-white">
                      Try Demo
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 