import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { toast } from "sonner";
import { Payout_payoneer, Payout_paypal } from "@src/types/payout";

export const exportPayoneerData = (payouts: Payout_payoneer[]) => {
  return payouts.map(payout => ({
    'Recipient Name': `Business ${payout.businessSpaceId}`,
    'Recipient Payoneer Email': payout.bankDetails,
    'Amount': payout.amount.toFixed(2),
    'Currency': payout.currency,
    'Payment Description': `Payout for ${payout.monthlyPeriod} - ID: ${payout.id}`
  }));
};

export const exportPayPalData = (payouts: Payout_paypal[]) => {
  return payouts.map(payout => ({
    'Email Address': payout.bankDetails,
    'Full Name': `Business ${payout.businessSpaceId}`,
    'Amount': payout.amount.toFixed(2),
    'Currency Code': payout.currency,
    'Payment Description': `Payout for ${payout.monthlyPeriod}`,
    'Payment ID': payout.id,
    'Receiver Type': 'EMAIL',
    'Sender Batch ID': `BATCH-${format(new Date(), 'yyyyMMdd')}-${payout.businessSpaceId}`,
    'Net Amount': payout.netAmount.toFixed(2),
    'Processing Fee': payout.processingFee.toFixed(2),
    'Tax Deduction': payout.taxDeduction.toFixed(2),
    'Country': payout.country,
    'Compliance Status': payout.complianceStatus,
    'Request Date': format(payout.requestDate, "yyyy-MM-dd")
  }));
};

export const exportToFile = (payouts: Payout_payoneer[] | Payout_paypal[], paymentMethod: "PayPal" | "Payoneer") => {
  try {
    const exportData = paymentMethod === "Payoneer" 
      ? exportPayoneerData(payouts as Payout_payoneer[])
      : exportPayPalData(payouts as Payout_paypal[]);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${paymentMethod} Payouts`);
    
    // For PayPal, we'll now export as CSV to match their bulk payment format
    const fileName = paymentMethod === "Payoneer"
      ? `${paymentMethod.toLowerCase()}-batch-payment.csv`
      : `paypal-bulk-payment-${format(new Date(), 'yyyyMMdd')}.csv`;
    
    // Force CSV format for both PayPal and Payoneer
    XLSX.writeFile(wb, fileName, { bookType: 'csv' });
    
    toast.success(`${paymentMethod} bulk payment file exported successfully!`);
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export bulk payment file");
  }
};