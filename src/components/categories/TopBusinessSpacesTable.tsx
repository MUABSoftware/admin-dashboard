"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table"
import Link from "next/link"

interface BusinessSpace {
  name: string
  revenue: number
}

interface TopBusinessSpacesTableProps {
  spaces: BusinessSpace[]
}

export function TopBusinessSpacesTable({ spaces }: TopBusinessSpacesTableProps) {
  const totalRevenue = spaces.reduce((sum, space) => sum + space.revenue, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Top Business Spaces</h3>
        <p className="text-sm text-muted-foreground">
          Total Revenue: ${totalRevenue}
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spaces.map((space) => (
              <TableRow key={space.name}>
                <TableCell>
                  <Link
                    href={`/business-spaces/${space.name}`}
                    className="text-primary hover:underline"
                  >
                    {space.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">${space.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}