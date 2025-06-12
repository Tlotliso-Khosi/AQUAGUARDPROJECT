"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
}

export function Calendar({
  date,
  onSelect,
  className,
}: CalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <input
          type="date"
          value={date ? format(date, "yyyy-MM-dd") : ""}
          onChange={(e) => {
            const newDate = e.target.value ? new Date(e.target.value) : undefined
            onSelect?.(newDate)
          }}
          className="w-full p-2"
        />
      </PopoverContent>
    </Popover>
  )
}
