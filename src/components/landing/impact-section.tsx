import { Award, Globe, Users, Leaf, TrendingUp, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const impacts = [
  {
    name: "Resource Efficiency",
    value: "40%",
    description: "reduction in operational costs",
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    trend: "+10%",
    trendUp: true
  },
  {
    name: "Community Impact",
    value: "5,000+",
    description: "farmers empowered across Lesotho",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: "+1,200",
    trendUp: true
  },
  {
    name: "Sustainability Score",
    value: "85%",
    description: "environmental impact reduction",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: "+15%",
    trendUp: true
  },
  {
    name: "AI Accuracy",
    value: "98%",
    description: "prediction accuracy rate",
    icon: Target,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    trend: "+3%",
    trendUp: true
  }
]

const awards = [
  {
    name: "Sebabatso Innovation (STEAM) Finalist",
    icon: Award,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    name: "National University of Lesotho 'A' Grading",
    icon: Award,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
]

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            Impact
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
            Building a <span className="text-green-600">Sustainable Future</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Transforming agriculture through technology and innovation
          </p>
        </div>

        <div className="mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((impact) => (
              <div 
                key={impact.name} 
                className="bg-white border border-gray-100 rounded-lg p-6 transition-all duration-300 hover:border-green-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("rounded-lg p-2", impact.bgColor)}>
                    <impact.icon className={cn("h-5 w-5", impact.color)} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {impact.name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-x-2 mb-2">
                  <p className="text-3xl font-bold text-gray-900">{impact.value}</p>
                  <p className="text-sm text-gray-600">{impact.description}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className={cn(
                    "inline-flex items-center text-sm",
                    impact.trendUp ? "text-green-600" : "text-red-600"
                  )}>
                    {impact.trendUp ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                    )}
                    {impact.trend}
                  </span>
                  <span className="text-sm text-gray-500">vs last year</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16">
          <div className="bg-white border border-gray-100 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg p-2 bg-amber-50">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Awards & Recognition</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {awards.map((award) => (
                <div 
                  key={award.name} 
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg",
                    award.bgColor
                  )}
                >
                  <award.icon className={cn("h-5 w-5", award.color)} aria-hidden="true" />
                  <span className="text-gray-900">{award.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 sm:col-span-2">
                <Globe className="h-5 w-5 text-blue-600" aria-hidden="true" />
                <span className="text-gray-900">
                  Global Vision: Scaling to international markets after success in Lesotho
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 