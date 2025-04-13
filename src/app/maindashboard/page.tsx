"use client"

import Link from "next/link"
import { Building2, FileText, Store, CreditCard } from "lucide-react"
import { MetricsOverview } from "@src/components/dashboard/MetricsOverview"
import { InteractiveMetrics } from "@src/components/dashboard/InteractiveMetrics"
import { Button } from "@src/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@src/components/ui/tooltip"

const menuItems = [
  {
    title: "Business Spaces",
    description: "Manage business spaces and their settings",
    icon: Building2,
    href: "/business-spaces",
    tooltip: "View and manage all business spaces"
  },
  {
    title: "Categories",
    description: "Manage content categories and topics",
    icon: FileText,
    href: "/categories",
    tooltip: "Organize and manage content categories"
  },
  {
    title: "Digital Products",
    description: "Manage digital products marketplace",
    icon: Store,
    href: "/digital-products",
    tooltip: "Browse and manage digital products"
  },
  {
    title: "Payouts",
    description: "Manage all payouts and transactions",
    icon: CreditCard,
    href: "/business-spaces/payouts",
    tooltip: "Process and track all payment transactions"
  }
]

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8 px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard overview</p>
      </div>

      <MetricsOverview />
      <div className="my-8">
        <InteractiveMetrics />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TooltipProvider>
          {menuItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <div className="group relative h-full">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative h-full rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] group-hover:border-primary/20">
                      <div className="mb-4 flex items-center justify-center">
                        <item.icon className="h-10 w-10 text-primary animate-fade-in" />
                      </div>
                      <div className="text-center space-y-2">
                        <h2 className="font-semibold text-xl text-gray-900">{item.title}</h2>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="ghost"
                          className="text-sm text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          View All →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  )
}