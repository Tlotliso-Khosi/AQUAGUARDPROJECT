import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Droplet, Leaf, Sprout, Cloud, Shield, MessageSquare, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    name: "Precision Control",
    description: "Real-time monitoring and automated adjustments for optimal resource usage.",
    icon: Droplet,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    name: "AI Vision System",
    description: "Advanced computer vision for real-time crop health monitoring.",
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    name: "Smart Analytics",
    description: "Data-driven insights for optimal farming decisions.",
    icon: Sprout,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Climate Adaptation",
    description: "AI-powered strategies for climate change resilience.",
    icon: Cloud,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
  {
    name: "Remote Monitoring",
    description: "24/7 farm monitoring and alerts via mobile app.",
    icon: Shield,
    color: "text-violet-600",
    bgColor: "bg-violet-50"
  },
  {
    name: "Expert Connect",
    description: "Direct access to agricultural experts and market insights.",
    icon: MessageSquare,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
]

export function KeyFeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
            Key Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Everything Farmers Need, {" "}
            <span className="text-indigo-600">Powered by AI</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Comprehensive suite of AI-driven tools designed to revolutionize farming operations
          </p>
        </div>

        <div className="mx-auto mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white border border-gray-100 rounded-lg p-6 transition-all duration-300 hover:border-blue-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "flex-none rounded-lg p-2",
                  feature.bgColor
                )}>
                  <feature.icon className={cn("h-5 w-5", feature.color)} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button 
            asChild 
            className="bg-indigo-600 hover:bg-indigo-700 rounded-md px-6 h-12"
          >
            <Link href="#technology" className="flex items-center gap-2 text-white">
              See All Features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 