"use client"

import { useRouter } from "next/navigation"
import { Users, DollarSign, Building2, Store } from "lucide-react"
import { Card, 
  // CardContent 
} from "@src/components/ui/card"
import { Button } from "@src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Mon", users: 120, payouts: 45, spaces: 80 },
  { name: "Tue", users: 150, payouts: 55, spaces: 85 },
  { name: "Wed", users: 180, payouts: 65, spaces: 90 },
  { name: "Thu", users: 220, payouts: 75, spaces: 88 },
  { name: "Fri", users: 250, payouts: 85, spaces: 92 },
  { name: "Sat", users: 280, payouts: 95, spaces: 95 },
  { name: "Sun", users: 310, payouts: 105, spaces: 98 },
]

const quickActions = [
  { label: "Add New User", icon: Users, route: "/users/new" },
  { label: "Approve Payouts", icon: DollarSign, route: "/business-spaces/payouts" },
  { label: "Create Category", icon: Building2, route: "/categories/new" },
  { label: "Add Product", icon: Store, route: "/digital-products/new" },
]

export function InteractiveMetrics() {
  const router = useRouter()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick Actions */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="min-w-[140px] hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
            onClick={() => router.push(action.route)}
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Interactive Chart */}
      <Card className="p-4">
        <Tabs defaultValue="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="spaces">Spaces</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="payouts" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="spaces" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="spaces" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}