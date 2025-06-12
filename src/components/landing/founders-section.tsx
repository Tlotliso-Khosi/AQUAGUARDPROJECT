import { Quote, Sparkles } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const founders = [
  {
    name: "Sebapala Mohlatsane",
    role: "Electronics Engineer & CEO",
    description: "A visionary with a background in IoT and smart agriculture. Recognized by the Global Cleantech Innovation Program (GCIP) for his work in AI-powered irrigation.",
    image: "/images/sebapala.webp",
    accentColor: "from-green-400 to-blue-500"
  },
  {
    name: "Paleho Phosa",
    role: "Entrepreneur & Energy Optimization Specialist",
    description: "A pioneer in electronic security with 9+ years of experience. Focused on low-carbon autonomous systems.",
    image: "/images/paleho.webp",
    accentColor: "from-blue-400 to-indigo-500"
  },
]

export function FoundersSection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] h-[300px] bg-green-100 rounded-full opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] h-[300px] bg-blue-100 rounded-full opacity-20 blur-[100px]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-[#9EFF00] to-green-400 bg-clip-text text-blue-700 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Our Team
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Driven by Passion,{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Built by Experts
              </span>
              <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-full left-0 h-[0.58em] w-full fill-green-300/40" preserveAspectRatio="none">
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Meet the innovators behind AquaguardAI who are revolutionizing agricultural technology
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {founders.map((founder) => (
              <div key={founder.name} className="group relative">
                <div className="relative mx-auto mb-8 w-64 h-64 lg:w-72 lg:h-72 overflow-visible">
                  {/* Custom clip path for the image */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-70 blur-xl -z-10 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" style={{background: `linear-gradient(135deg, ${founder.accentColor?.split(' ')[0]?.replace('from-', '')} 0%, ${founder.accentColor?.split(' ')[1]?.replace('to-', '')} 100%)`}}></div>
                  
                  <div className="absolute inset-0 w-full h-full">
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br rounded-2xl p-1 shadow-lg" style={{background: `linear-gradient(135deg, ${founder.accentColor.split(' ')[0]?.replace('from-', '')} 0%, ${founder.accentColor.split(' ')[1]?.replace('to-', '')} 100%)`}}>
                        <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                          <div className="w-full h-full relative">
                            <Image 
                              src={founder.image} 
                              alt={founder.name}
                              fill
                              className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center lg:text-left px-4 lg:px-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                  <p className={cn("text-base font-semibold bg-gradient-to-r bg-clip-text text-transparent mb-4", founder.accentColor)}>
                    {founder.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{founder.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="relative rounded-2xl bg-white p-8 shadow-xl border border-gray-100  group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <Quote className="absolute -top-4 left-4 h-10 w-10 text-green-500 opacity-80" />
              <blockquote className="text-xl font-semibold leading-8 text-gray-900 relative z-10">
                &ldquo;Water is precious. So is your time. AquaGuard AI saves both—because your crops should be thriving, not your water bill.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-green-500">
                  <Image 
                    src="/images/sebapala.webp" 
                    alt="Sebapala Mohlatsane"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Sebapala Mohlatsane</p>
                  <p className="text-sm text-gray-600">CEO & Co-Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}