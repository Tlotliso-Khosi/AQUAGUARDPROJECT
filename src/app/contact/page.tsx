"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { HeroSection } from "./hero-section"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const defaultValues: Partial<ContactFormValues> = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    
    // Simulate sending the form data to an API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log(data)
    setIsSubmitting(false)
    setIsSubmitted(true)
    form.reset()
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Use the server component for hero section with structured data */}
      <HeroSection />
      
      {/* Contact Content Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Our team is ready to assist you with any questions or inquiries about our smart farming solutions.
                </p>
              </div>
              
              <div className="space-y-6">
                <article className="flex items-start gap-4">
                  <div className="rounded-lg p-3 bg-[#1A4733]">
                    <Mail className="h-5 w-5 text-[#9EFF00]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">
                      <a href="mailto:aquaguardai@gmail.com" className="text-blue-600 hover:underline">
                        aquaguardai@gmail.com
                      </a>
                    </p>
                  </div>
                </article>
                
                <article className="flex items-start gap-4">
                  <div className="rounded-lg p-3 bg-[#1A4733]">
                    <Phone className="h-5 w-5 text-[#9EFF00]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+266 5975 3456</p>
                    <p className="text-gray-600">Monday - Friday, 8am - 5pm</p>
                  </div>
                </article>
                
                <article className="flex items-start gap-4">
                  <div className="rounded-lg p-3 bg-[#1A4733]">
                    <MapPin className="h-5 w-5 text-[#9EFF00]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Visit Us</h3>
                    <address className="text-gray-600 not-italic">
                      National University of Lesotho<br />
                      Roma, Maseru<br />
                      Lesotho
                    </address>
                  </div>
                </article>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                      <Send className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-4">Thank you for contacting AquaguardAI. We will get back to you shortly.</p>
                    <Button onClick={() => setIsSubmitted(false)} className="bg-green-600 hover:bg-green-700">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="+266 5975 3456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="How can we help you?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your project or inquiry..."
                                className="min-h-32 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Please provide as much detail as possible.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-[#9EFF00] hover:bg-[#8EEF00] text-[#0A3622] font-semibold rounded-full px-8 py-6 w-full sm:w-auto transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-[#0A3622] border-t-transparent rounded-full"></span>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Us on the Map</h2>
          <div className="relative rounded-lg overflow-hidden h-[400px] shadow-md">
            <Image 
              src="/images/hero-2.webp" 
              alt="AquaguardAI Office Location at National University of Lesotho, Roma, Maseru"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-sm">
                <h3 className="font-bold text-gray-900 mb-2">AquaguardAI Headquarters</h3>
                <p className="text-gray-700">
                  National University of Lesotho<br />
                  Roma, Maseru<br />
                  Lesotho
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
} 