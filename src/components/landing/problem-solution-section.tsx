import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle2, Sparkles, ArrowRightCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const comparisons = [
  {
    problem: {
      title: "Manual Irrigation",
      description: "Traditional methods waste up to 40% of water and require constant monitoring",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      stat: "40%",
      statLabel: "water wasted"
    },
    solution: {
      title: "Smart Irrigation",
      description: "AI-powered system reduces water usage by 40% through precise control",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      stat: "60%",
      statLabel: "water saved"
    }
  },
  {
    problem: {
      title: "Crop Disease",
      description: "Late detection leads to 20-30% yield loss and excessive pesticide use",
      icon: AlertCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      stat: "30%",
      statLabel: "yield loss"
    },
    solution: {
      title: "Early Detection",
      description: "Real-time monitoring catches diseases early, saving 90% of affected crops",
      icon: CheckCircle2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stat: "90%",
      statLabel: "crops saved"
    }
  },
  {
    problem: {
      title: "Resource Waste",
      description: "Inefficient resource allocation reduces farm profitability by 25%",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      stat: "-25%",
      statLabel: "profit loss"
    },
    solution: {
      title: "Resource Optimization",
      description: "Smart allocation improves profitability by 35% in the first year",
      icon: CheckCircle2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      stat: "+35%",
      statLabel: "profit gain"
    }
  }
]

export function ProblemSolutionSection() {
  return (
    <section id="solutions" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] h-[300px] bg-green-100 rounded-full opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] h-[300px] bg-blue-100 rounded-full opacity-20 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-[#9EFF00] to-green-400 bg-clip-text text-blue-700 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Smart Solutions
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Transform Your Farm with{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Intelligent Automation
              </span>
              <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-full left-0 h-[0.58em] w-full fill-green-300/40" preserveAspectRatio="none">
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Experience the future of farming with our AI-driven solutions that solve real agricultural challenges
          </p>
        </div>

        {/* Featured image - before comparison table */}
        <div className="mx-auto max-w-5xl mb-16">
          <div className="relative rounded-xl overflow-hidden">
            <Image 
              src="/images/hero.webp" 
              alt="Traditional vs Smart Farming Comparison" 
              width={1000} 
              height={500} 
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex justify-between text-white">
                <div>
                  <p className="text-sm font-medium text-amber-300">Traditional Farming</p>
                  <p className="text-xs opacity-80">Higher resource usage, lower yields</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-300">Smart Farming</p>
                  <p className="text-xs opacity-80">Optimized resources, increased yields</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Label headers for comparison */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 md:gap-16 mb-4">
            <div className="border-b-2 border-amber-200 pb-2">
              <h3 className="text-lg font-medium text-amber-600 pl-2">Problem</h3>
            </div>
            <div className="border-b-2 border-emerald-200 pb-2">
              <h3 className="text-lg font-medium text-emerald-600 pl-2">Solution</h3>
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="space-y-16">
            {comparisons.map((item, index) => (
              <div key={index} className="relative">
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 relative">
                  {/* Problem Card */}
                  <div className="border-l-4 border-t border-r border-b border-gray-100 rounded-lg p-6 bg-white transition-all duration-300 hover:border-amber-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex-none rounded-lg p-2",
                          item.problem.bgColor
                        )}>
                          <item.problem.icon className={cn("h-5 w-5", item.problem.color)} />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">{item.problem.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-2xl font-bold", item.problem.color)}>{item.problem.stat}</div>
                        <div className="text-sm text-gray-500">{item.problem.statLabel}</div>
                      </div>
                    </div>
                    <p className="text-gray-600">{item.problem.description}</p>
                  </div>

                  {/* Arrow connector (visible only on desktop) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-blue-50 rounded-full p-2 border border-blue-100">
                      <ArrowRightCircle className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>

                  {/* Solution Card */}
                  <div className="border-l-4 border-t border-r border-b border-gray-100 rounded-lg p-6 bg-white transition-all duration-300 hover:border-emerald-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex-none rounded-lg p-2",
                          item.solution.bgColor
                        )}>
                          <item.solution.icon className={cn("h-5 w-5", item.solution.color)} />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">{item.solution.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-2xl font-bold", item.solution.color)}>{item.solution.stat}</div>
                        <div className="text-sm text-gray-500">{item.solution.statLabel}</div>
                      </div>
                    </div>
                    <p className="text-gray-600">{item.solution.description}</p>
                  </div>
                </div>
                
                {/* Mobile connector indicator (visible only on mobile) */}
                <div className="flex md:hidden justify-center my-4">
                  <div className="flex items-center gap-1">
                    <div className="h-px w-8 bg-gray-200"></div>
                    <ArrowRightCircle className="h-5 w-5 text-blue-500" />
                    <div className="h-px w-8 bg-gray-200"></div>
                  </div>
                </div>
                
                {/* Only show divider if not the last item */}
                {index < comparisons.length - 1 && (
                  <div className="h-px w-full bg-gray-100 my-8 md:my-12"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center">
            <p className="text-gray-600 mb-6 text-center max-w-xl">
              Ready to revolutionize your farming operations with cutting-edge AI technology?
            </p>
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 h-12"
            >
              <Link href="#features" className="flex items-center gap-2 text-white">
                Explore Features
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 