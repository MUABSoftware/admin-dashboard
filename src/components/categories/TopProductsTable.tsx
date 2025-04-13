"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table"
import Link from "next/link"

interface Product {
  name: string
  sales: number
}

interface TopProductsTableProps {
  products: Product[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0)
  console.log(products);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Top Products</h3>
        <p className="text-sm text-muted-foreground">Total Sales: {totalSales}</p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell>
                  <Link
                    href={`/products/${product.name}`}
                    className="text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{product.sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}