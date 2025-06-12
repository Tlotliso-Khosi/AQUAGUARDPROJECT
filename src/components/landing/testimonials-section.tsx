"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"

// Array of testimonials
const testimonials = [
  {
    quote:
      "AquaguardAI has transformed my irrigation practices. I've reduced water usage by 30% while improving crop yields!",
    author: "Michael Johnson",
    role: "Corn Farmer, Iowa",
  },
  {
    quote:
      "The predictive analytics have saved my orchard during unexpected dry spells. This technology is a game-changer.",
    author: "Sarah Williams",
    role: "Apple Orchard Owner, Washington",
  },
  {
    quote: "I was skeptical at first, but the water savings alone paid for the system within one growing season.",
    author: "Robert Chen",
    role: "Rice Farmer, California",
  },
  {
    quote:
      "The soil moisture sensors integrated perfectly with my existing setup. Now I have data-driven insights I never had before.",
    author: "Emily Rodriguez",
    role: "Vegetable Farmer, Florida",
  },
  {
    quote: "They said they love AquaGuard AI and never want to go back to 'just hoping for the best' again.",
    author: "David Thompson",
    role: "Vineyard Manager, Napa Valley",
  },
  {
    quote:
      "The mobile alerts have prevented at least three potential irrigation failures this season. Worth every penny.",
    author: "Lisa Patel",
    role: "Greenhouse Operator, Ohio",
  },
  {
    quote: "My water bill has decreased by 40% since implementing AquaguardAI. The ROI is incredible.",
    author: "James Wilson",
    role: "Cotton Farmer, Texas",
  },
  {
    quote: "The customer support team helped me customize the system for my unique needs. Truly exceptional service.",
    author: "Maria Gonzalez",
    role: "Citrus Grower, Florida",
  },
  {
    quote: "As climate change affects our region, having AI-powered water management gives me peace of mind.",
    author: "Thomas Lee",
    role: "Soybean Farmer, Illinois",
  },
  {
    quote:
      "My crops have never looked healthier. The precision irrigation has eliminated both over and under-watering issues.",
    author: "Karen Mitchell",
    role: "Organic Farmer, Vermont",
  },
]

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Function to select a random testimonial
  const selectRandomTestimonial = () => {
    if (testimonials.length > 0) {
      const randomIndex = Math.floor(Math.random() * testimonials.length)
      setCurrentTestimonial(randomIndex)
    }
  }

  // Select a random testimonial on initial load
  useEffect(() => {
    selectRandomTestimonial()
  }, [])

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Farmers Love AquaguardAI</h2>
          <p className="mt-4 text-lg text-gray-600">Hear what our customers have to say about their experience</p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
          <div className="relative rounded-2xl bg-white p-8 shadow-xl">
            <Quote className="absolute -top-4 left-4 h-8 w-8 text-green-600" />
            <blockquote className="text-lg font-semibold leading-8 text-gray-900 mb-4">
              &ldquo;{testimonials[currentTestimonial]?.quote || "Loading testimonial..."}&rdquo;
            </blockquote>
            <div className="mt-6">
              <p className="text-base font-semibold text-gray-900">
                {testimonials[currentTestimonial]?.author || "Anonymous"}
              </p>
              <p className="text-sm text-gray-600">{testimonials[currentTestimonial]?.role || "Customer"}</p>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={selectRandomTestimonial} className="bg-green-600 hover:bg-green-700">
              See Another Testimonial
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
