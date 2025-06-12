"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"

export function DataValidationRules() {
  // Sample validation rules
  const [rules, setRules] = useState([
    {
      id: 1,
      name: "Yield Range Check",
      description: "Validates that yield values are within expected ranges for the crop type",
      active: true,
    },
    {
      id: 2,
      name: "Date Validation",
      description: "Ensures measurement dates are not in the future",
      active: true,
    },
    {
      id: 3,
      name: "Required Fields",
      description: "Checks that all required fields are filled in",
      active: true,
    },
    {
      id: 4,
      name: "Duplicate Detection",
      description: "Identifies potential duplicate entries",
      active: false,
    },
  ])

  const toggleRule = (id: number) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, active: !rule.active } : rule)))
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>
                  <Switch checked={rule.active} onCheckedChange={() => toggleRule(rule.id)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
