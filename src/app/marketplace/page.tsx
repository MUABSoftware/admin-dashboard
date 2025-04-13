import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@src/components/ui/breadcrumb"
// import { MarketplaceStats } from "@src/components/marketplace/MarketplaceStats"
import { MarketplaceTable } from "@src/components/marketplace/MarketplaceTable"

export default function Marketplace() {
  return (
    <div className="container space-y-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Marketplace</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Management</h1>
      </div>

      {/* <MarketplaceStats /> */}
      <MarketplaceTable />
    </div>
  )
}