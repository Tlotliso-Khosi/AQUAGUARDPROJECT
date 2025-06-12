"use client"

import type React from "react"
import CustomerSidebar from "@/components/dashboard/customer-sidebar" // Updated import path
import Header from "@/components/dashboard/header"
import ChatBot from "@/components/chat/chat-bot"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <CustomerSidebar />
      <div className="ml-[274px] flex flex-col gap-4 p-4">
        <Header />
        <div className="h-14" />
        <main className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  )
}
