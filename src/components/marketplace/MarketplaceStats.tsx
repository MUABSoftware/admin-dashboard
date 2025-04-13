import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card"
import { Store, Users, DollarSign, TrendingUp, Tag } from "lucide-react"

export function MarketplaceStats() {
  const stats = [
    {
      title: "Total Products",
      value: "2,345",
      icon: Store,
      description: "Active digital products",
    },
    {
      title: "Total Creators",
      value: "892",
      icon: Users,
      description: "Contributing creators",
    },
    {
      title: "Total Sales",
      value: "$125.5K",
      icon: DollarSign,
      description: "Cumulative sales",
    },
    {
      title: "Trending Products",
      value: "45",
      icon: TrendingUp,
      description: "Most viewed items",
    },
    {
      title: "Best Deal Products",
      value: "32",
      icon: Tag,
      description: "Highest selling items",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}