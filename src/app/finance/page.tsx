"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { format } from "date-fns";
import { toast } from "@src/hooks/use-toast";
import { exportToFile } from "@src/utils/exportUtils";
import { Payout_paypal } from "@src/types/payout";
import { FileDown, Check, AlertCircle, Clock, ListTodo } from "lucide-react";
import { Checkbox } from "@src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { PayoutFlagButton } from "@src/components/business-spaces/PayoutFlagButton";
import { PayoutActions } from "@src/components/business-spaces/PayoutActions";

const mockPayouts: Payout_paypal[] = [
  {
    id: "PAY001",
    amount: 1500.00,
    businessSpaceId: "BS001",
    company:"Muab",
    userId: "USR001",
    currency: "USD",
    method: "Payoneer",
    status: "To Do",
    processingFee: 45.00,
    netAmount: 1455.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "paypal@example.com",
    isAutomated: true,
    earningsId: "EARN001",
    taxDeduction: 150.00,
    complianceStatus: "Verified",
    country: "United States",
    emailSent: true,
    isFlagged: false,
  },
  {
    id: "PAY001",
    amount: 1500.00,
    businessSpaceId: "BS001",
    company:"Muab",
    userId: "USR001",
    currency: "USD",
    method: "Payoneer",
    status: "To Do",
    processingFee: 45.00,
    netAmount: 1455.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "paypal@example.com",
    isAutomated: true,
    earningsId: "EARN001",
    taxDeduction: 150.00,
    complianceStatus: "Verified",
    country: "United States",
    emailSent: true,
    isFlagged: false,
  },
  {
    id: "PAY001",
    amount: 1500.00,
    businessSpaceId: "BS001",
    company:"Muab",
    userId: "USR001",
    currency: "USD",
    method: "Payoneer",
    status: "To Do",
    processingFee: 45.00,
    netAmount: 1455.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "paypal@example.com",
    isAutomated: true,
    earningsId: "EARN001",
    taxDeduction: 150.00,
    complianceStatus: "Verified",
    country: "United States",
    emailSent: true,
    isFlagged: false,
  },
  {
    id: "PAY001",
    amount: 1500.00,
    businessSpaceId: "BS001",
    company:"Muab",
    userId: "USR001",
    currency: "USD",
    method: "Payoneer",
    status: "To Do",
    processingFee: 45.00,
    netAmount: 1455.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "paypal@example.com",
    isAutomated: true,
    earningsId: "EARN001",
    taxDeduction: 150.00,
    complianceStatus: "Verified",
    country: "United States",
    emailSent: true,
    isFlagged: false,
  },

];

const getStatusColor = (status: Payout_paypal["status"]) => {
  switch (status) {
    case "Done":
      return "default";
    case "In Progress":
      return "secondary";
    case "Pending":
      return "destructive";
    case "To Do":
      return "outline";
    default:
      return "default";
  }
};

export default function PayPalPayoutsPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [payouts, setPayouts] = useState(mockPayouts);
  const [page, setPage] = useState(1);
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<Payout_paypal["status"] | "">("");
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const itemsPerPage = 5;
  const [pageHistory, setPageHistory] = useState<{
    page: number;
    items: string[];
  }[]>([]);

  const filteredPayouts = payouts.filter(payout => {
    const isMethodMatch = payout.method === "Payoneer";
    const isStatusMatch = selectedStatus ? payout.status === selectedStatus : true;

    if (!dateRange.startDate && !dateRange.endDate) return isMethodMatch && isStatusMatch;

    const payoutDate = new Date(payout.requestDate);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const isAfterStart = !startDate || payoutDate >= startDate;
    const isBeforeEnd = !endDate || payoutDate <= endDate;

    return isMethodMatch && isStatusMatch && isAfterStart && isBeforeEnd;
  });

  const totalItems = filteredPayouts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get paginated data
  const paginatedPayouts = filteredPayouts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
     console.log (pageHistory,setDateRange,flaggedCount)
  }, [dateRange, selectedStatus]);

  useEffect(() => {
    const currentPageItems = paginatedPayouts.map(payout => payout.id);
    
    setPageHistory(prev => {
      if (prev.some(p => p.page === page && JSON.stringify(p.items) === JSON.stringify(currentPageItems))) {
        return prev;
      }
      return [...prev, { page, items: currentPageItems }];
    });
  }, [page, paginatedPayouts]);

  const handleFlagToggle = (payoutId: string) => {
    setPayouts(prev => {
      const newPayouts = prev.map(payout =>
        payout.id === payoutId
          ? { ...payout, isFlagged: !payout.isFlagged }
          : payout
      );

      const flaggedCount = newPayouts.filter(p => p.isFlagged).length;
      setFlaggedCount(flaggedCount);

      return newPayouts;
    });

    toast({
      title: "Payment flag status updated",
      variant: "default",
    });
  };

  const handleExportToExcel = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to export",
        variant: "destructive",
      });
      return;
    }

    const payoutsToExport = filteredPayouts.filter(payout => 
      selectedRows.includes(payout.id)
    );

    exportToFile(payoutsToExport, "PayPal");

    toast({
      title: `Exported ${payoutsToExport.length} PayPal payout records`,
      variant: "default",
    });
  };

  const handleViewDetails = (payout: Payout_paypal) => {
    toast({
      title: `Viewing details for payout ${payout.id}`,
      variant: "default",
    });
  };

  const handleSelectRow = (payoutId: string) => {
    setSelectedRows(prev =>
      prev.includes(payoutId)
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredPayouts.length
        ? []
        : filteredPayouts.map(payout => payout.id)
    );
  };

  const handleBulkStatusUpdate = (newStatus: Payout_paypal["status"]) => {
    if (selectedRows.length === 0) {
      toast({
        title: "Please select at least one payout to update",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Updated ${selectedRows.length} payouts to ${newStatus}`,
      variant: "default",
    });
    setSelectedRows([]); 
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusUpdate = (payoutId: string, newStatus: Payout_paypal["status"]) => {
    setPayouts(prev => 
      prev.map(payout =>
        payout.id === payoutId ? { ...payout, status: newStatus } : payout
      )
    );

    toast({
      title: `Payout status updated to ${newStatus}`,
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto p-8">

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
          <div className="space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground">
            Manage and monitor all Financials in the platform
          </p>
        </div>

            {selectedRows.length > 0 && (
              <DropdownMenu>
                {/* <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedRows.length})
                  </Button>
                </DropdownMenuTrigger> */}
                <DropdownMenuContent className="bg-white dark:bg-gray-800 shadow-lg border rounded-md z-50">
                  <DropdownMenuLabel className="font-semibold">Update Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleBulkStatusUpdate("Done")}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Done
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleBulkStatusUpdate("In Progress")}>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Mark In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleBulkStatusUpdate("Pending")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleBulkStatusUpdate("To Do")}>
                    <ListTodo className="mr-2 h-4 w-4" />
                    Mark as To Do
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <Button
            onClick={handleExportToExcel}
            variant="outline"
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
              Export Financials
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === filteredPayouts.length && filteredPayouts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Report/Payout ID</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Country</TableHead>
                {/* <TableHead>Method</TableHead> */}
                <TableHead>Actions</TableHead>

                {/* <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Flag</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayouts.map((payout) => (
                <TableRow
                  key={payout.id}
                  className={payout.isFlagged ? "bg-red-50 dark:bg-red-900/10" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(payout.id)}
                      onCheckedChange={() => handleSelectRow(payout.id)}
                    />
                  </TableCell>
                  
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span>${payout.amount.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">
                        Net: ${payout.netAmount.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {payout.method}
                  </TableCell>
                  <TableCell>
                    {payout.country}
                  </TableCell>
                  {/* <TableCell>
                    {payout.businessSpaceId}
                  </TableCell> */}
                  {/* <TableCell>{payout.company ? 'Company' : 'Creator'}</TableCell> */}
                  {/* <TableCell>
                    <Badge variant={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </TableCell> */}
                  {/* <TableCell>{format(payout.requestDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>{payout.monthlyPeriod}</TableCell> */}
                  {/* <TableCell>
                    <Badge
                      variant={payout.complianceStatus === "Verified" ? "default" : "destructive"}
                    >
                      {payout.complianceStatus}
                    </Badge>
                  </TableCell> */}
                  {/* <TableCell>
                    <PayoutFlagButton
                      isFlagged={payout.isFlagged}
                      onToggle={() => handleFlagToggle(payout.id)}
                    />
                  </TableCell> */}
                  <TableCell>
                    <PayoutActions
                      payout={payout}
                      onViewDetails={() => handleViewDetails(payout)}
                      onExport={handleExportToExcel}
                      onStatusUpdate={(status) => handleStatusUpdate(payout.id, status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
