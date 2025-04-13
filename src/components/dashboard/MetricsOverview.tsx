import { Users, DollarSign, Building2, Store } from "lucide-react"
import { StatsCard } from "./StatsCard"

export function MetricsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
      <StatsCard
        title="Total Users"
        value="12.5k"
        icon={<Users className="h-4 w-4" />}
        description="+2.5% from last month"
        className="bg-white"
      />
      <StatsCard
        title="Pending Payouts"
        value="$45.2k"
        icon={<DollarSign className="h-4 w-4" />}
        description="23 payouts pending"
        className="bg-white"
      />
      <StatsCard
        title="Active Spaces"
        value="1.2k"
        icon={<Building2 className="h-4 w-4" />}
        description="85% utilization rate"
        className="bg-white"
      />
      <StatsCard
        title="Digital Products"
        value="3.4k"
        icon={<Store className="h-4 w-4" />}
        description="152 added this month"
        className="bg-white"
      />
    </div>
  )
}