import { BusinessSpacesTable } from "@src/components/business-spaces/BusinessSpacesTable";
import { StatsOverview } from "@src/components/business-spaces/StatsOverview";


export default function BusinessSpaces() {
  return (
    <div className="mx-auto p-8">
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Business Spaces</h1>
        <p className="text-muted-foreground">
          Manage and monitor all business spaces in the platform
        </p>
      </div>
      
      <StatsOverview />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Business Spaces</h2>
        </div>
        <BusinessSpacesTable />
      </div>
    </div>
  );
}