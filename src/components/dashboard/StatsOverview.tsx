import { BarChart, Flag, AlertCircle, CheckCircle } from "lucide-react";
import { StatsCard } from "./StatsCard";

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Reports"
        value="128"
        icon={<Flag className="h-4 w-4" />}
        description="12% increase from last month"
      />
      <StatsCard
        title="Pending Review"
        value="23"
        icon={<AlertCircle className="h-4 w-4" />}
        description="5 new since yesterday"
      />
      <StatsCard
        title="Resolved"
        value="89"
        icon={<CheckCircle className="h-4 w-4" />}
        description="94% resolution rate"
      />
      <StatsCard
        title="Average Resolution Time"
        value="2.4h"
        icon={<BarChart className="h-4 w-4" />}
        description="Improved by 30min"
      />
    </div>
  );
}