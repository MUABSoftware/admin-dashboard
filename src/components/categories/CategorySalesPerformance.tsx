"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card"
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { TopProductsTable } from "@src/components/categories/TopProductsTable"
import { TopBusinessSpacesTable } from "@src/components/categories/TopBusinessSpacesTable"

interface CategorySalesPerformanceProps {
  categoryId?: string
}

const salesData = [
  { month: "Jan", sales: 500, revenue: 15000 },
  { month: "Feb", sales: 600, revenue: 18000 },
  { month: "Mar", sales: 800, revenue: 24000 },
  { month: "Apr", sales: 900, revenue: 27000 },
  { month: "May", sales: 1200, revenue: 36000 },
]

const topProducts = [
  { name: "Product A", sales: 50 },
  { name: "Product B", sales: 30 },
  { name: "Product C", sales: 20 },
]

const topSpaces = [
  { name: "Space X", revenue: 5000 },
  { name: "Space Y", revenue: 3000 },
  { name: "Space Z", revenue: 2000 },
]

export function CategorySalesPerformance({
  // categoryId,
}: CategorySalesPerformanceProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1E40AF"
                  fill="#93C5FD"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#1E40AF" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <TopProductsTable products={topProducts} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <TopBusinessSpacesTable spaces={topSpaces} />
        </CardContent>
      </Card>
    </div>
  )
}
