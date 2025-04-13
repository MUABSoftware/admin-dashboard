"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Package, Users, Star, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "2,345",
    icon: Package,
    description: "Active digital products",
  },
  {
    title: "Total Customers",
    value: "12.5K",
    icon: Users,
    description: "Across all products",
  },
  {
    title: "Average Rating",
    value: "4.8",
    icon: Star,
    description: "From all reviews",
  },
  {
    title: "Total Revenue",
    value: "$45.2K",
    icon: DollarSign,
    description: "Last 30 days",
  },
];

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
  );
}