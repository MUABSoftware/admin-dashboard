// import { Card } from "@src/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@src/components/ui/breadcrumb";
import { ProductsTable } from "@src/components/digital-products/ProductsTable";

export default function DigitalProducts() {
  return (
    <div className="container space-y-6 p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Digital Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Digital Products</h1>
      </div>

      <ProductsTable />
    </div>
  );
}