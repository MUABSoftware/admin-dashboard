import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";

interface Payout {
  id: string;
  businessId: string;
  businessName: string;
  revenue: number;
  profit: number;
  pendingAmount: number;
  status: "Not Sent" | "Pending" | "Sending" | "Sent" | "Received";
  location: string;
  payoutDate: string;
}

const mockPayouts: Payout[] = [
  {
    id: "PAY001",
    businessId: "BUS001",
    businessName: "Tech Academy Pro",
    revenue: 5000.00,
    profit: 4250.00,
    pendingAmount: 4250.00,
    status: "Pending",
    location: "United States",
    payoutDate: "2024-02-15",
  },
  // Add more mock data as needed
];

const getStatusColor = (status: Payout["status"]) => {
  switch (status) {
    case "Received":
      return "default";
    case "Sent":
      return "default";
    case "Sending":
      return "secondary";
    case "Pending":
      return "outline";
    case "Not Sent":
      return "destructive";
    default:
      return "default";
  }
};

export function PayoutTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business ID</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Pending Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Payout Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPayouts.map((payout) => (
            <TableRow key={payout.id}>
              <TableCell className="font-medium">{payout.businessId}</TableCell>
              <TableCell>{payout.businessName}</TableCell>
              <TableCell>${payout.revenue.toFixed(2)}</TableCell>
              <TableCell>${payout.profit.toFixed(2)}</TableCell>
              <TableCell>${payout.pendingAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(payout.status)}>
                  {payout.status}
                </Badge>
              </TableCell>
              <TableCell>{payout.location}</TableCell>
              <TableCell>{payout.payoutDate}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                    <DropdownMenuItem>Download Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}