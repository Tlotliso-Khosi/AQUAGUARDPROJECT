"use client"

import * as React from "react"
import { Bell, User, LogOut, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = React.useState(i18n.language)

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng)
    setLanguage(lng)
  }

  return (
    <header className="w-full mb-0">
      <div className="flex h-16 items-center justify-between gap-4 rounded-xl bg-white px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div />

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100">
                <Globe className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("en")}>
                <span className={language === "en" ? "font-medium" : ""}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("st")}>
                <span className={language === "st" ? "font-medium" : ""}>Sesotho</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg hover:bg-slate-100">
              <Bell className="h-4 w-4 text-slate-500" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/Sebapala.jpg" alt="KSebapala Mohlatsane" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">Sebapala Mohlatsane</span>
                    <span className="text-xs text-slate-500">sebapalamajormohlatsane@gmail.com</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("header.account")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("header.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
