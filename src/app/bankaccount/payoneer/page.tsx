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
    businessSpaceId: "BS001",
    company:"Muab",
    userId: "USR001",
    amount: 1500.00,
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
    id: "PAY002",
    businessSpaceId: "BS003",
    company:"Muab",
    userId: "USR003",
    amount: 2500.00,
    currency: "USD",
    method: "Payoneer",
    status: "Done",
    processingFee: 75.00,
    netAmount: 2425.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "payoneer@example.com",
    isAutomated: true,
    earningsId: "EARN002",
    taxDeduction: 250.00,
    complianceStatus: "Verified",
    country: "Canada",
    emailSent: true,
    isFlagged: false,
  },
  {
    id: "PAY003",
    businessSpaceId: "BS004",
    company:"Muab",
    userId: "USR004",
    amount: 1500.00,
    currency: "USD",
    method: "Payoneer",
    status: "In Progress",
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
    id: "PAY004",
    businessSpaceId: "BS005",
    company:"Muab",
    userId: "USR005",
    amount: 2500.00,
    currency: "USD",
    method: "Payoneer",
    status: "Done",
    processingFee: 75.00,
    netAmount: 2425.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "payoneer@example.com",
    isAutomated: true,
    earningsId: "EARN002",
    taxDeduction: 250.00,
    complianceStatus: "Verified",
    country: "Canada",
    emailSent: true,
    isFlagged: false,
  },
  {
    id: "PAY005",
    businessSpaceId: "BS001",
    company:"Muab",
    userId: "USR001",
    amount: 1500.00,
    currency: "USD",
    method: "Payoneer",
    status: "Pending",
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
    isFlagged: true,
  },
  {
    id: "PAY006",
    businessSpaceId: "BS003",
    company:"Muab",
    userId: "USR003",
    amount: 2500.00,
    currency: "USD",
    method: "Payoneer",
    status: "Done",
    processingFee: 75.00,
    netAmount: 2425.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "payoneer@example.com",
    isAutomated: true,
    earningsId: "EARN002",
    taxDeduction: 250.00,
    complianceStatus: "Verified",
    country: "Canada",
    emailSent: true,
    isFlagged: false,
  },
  {
    id: "PAY007",
    businessSpaceId: "BS004",
    company:"Muab",
    userId: "USR004",
    amount: 1500.00,
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
    id: "PAY008",
    businessSpaceId: "BS005",
    company:"Muab",
    userId: "USR005",
    amount: 2500.00,
    currency: "USD",
    method: "Payoneer",
    status: "Done",
    processingFee: 75.00,
    netAmount: 2425.00,
    requestDate: new Date(),
    monthlyPeriod: "January 2024",
    bankDetails: "payoneer@example.com",
    isAutomated: true,
    earningsId: "EARN002",
    taxDeduction: 250.00,
    complianceStatus: "Verified",
    country: "Canada",
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

  // Calculate pagination values
  const totalItems = filteredPayouts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get paginated data
  const paginatedPayouts = filteredPayouts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
     console.log (pageHistory,setDateRange,flaggedCount)
  }, [dateRange, selectedStatus]);

  // Update useEffect to track viewed items
  useEffect(() => {
    const currentPageItems = paginatedPayouts.map(payout => payout.id);
    
    setPageHistory(prev => {
      // Don't add duplicate pages
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
        <div className="space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Payoneer Payouts</h1>
          <p className="text-muted-foreground">
            Manage and monitor all Payoneer payouts in the platform
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All PayPal Payouts</h2>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status Filter: {selectedStatus || "All"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setSelectedStatus("")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("To Do")}>
                  <ListTodo className="mr-2 h-4 w-4" />
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("In Progress")}>
                  <Clock className="mr-2 h-4 w-4" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Pending")}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Done")}>
                  <Check className="mr-2 h-4 w-4" />
                  Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedRows.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedRows.length})
                  </Button>
                </DropdownMenuTrigger>
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
            Export PayPal Payouts
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
                <TableHead>Revenue ID</TableHead>
                <TableHead>Revenue Report</TableHead>
                <TableHead>Business Space</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Actions</TableHead>
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
                    <Button variant="link" className="p-0">
                      Download Report
                    </Button>
                  </TableCell>
                  <TableCell>{payout.businessSpaceId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>${payout.amount.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">
                        Net: ${payout.netAmount.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>{payout.company ? 'Company' : 'Creator'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(payout.requestDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>{payout.monthlyPeriod}</TableCell>
                  <TableCell>
                    <Badge
                      variant={payout.complianceStatus === "Verified" ? "default" : "destructive"}
                    >
                      {payout.complianceStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PayoutFlagButton
                      isFlagged={payout.isFlagged}
                      onToggle={() => handleFlagToggle(payout.id)}
                    />
                  </TableCell>
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
