export interface Payout_paypal {
  id: string;
  businessSpaceId: string;
  company:string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: "To Do" | "In Progress" | "Pending" | "Done"; 
  processingFee: number;
  netAmount: number;
  requestDate: Date;
  monthlyPeriod: string;
  approvalDate?: Date;
  bankDetails: string;
  notes?: string;
  isAutomated: boolean;
  earningsId: string;
  taxDeduction: number;
  complianceStatus: "Verified" | "Flagged for Review";
  country: string;
  emailSent: boolean;
  isFlagged: boolean;
}


export interface Payout_payoneer {
  id: string;
  businessSpaceId: string;
  company:string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: "Pending" | "Processed" | "Failed" | "Cancelled";
  processingFee: number;
  netAmount: number;
  requestDate: Date;
  monthlyPeriod: string;
  approvalDate?: Date;
  bankDetails: string;
  notes?: string;
  isAutomated: boolean;
  earningsId: string;
  taxDeduction: number;
  complianceStatus: "Verified" | "Flagged for Review";
  country: string;
  emailSent: boolean;
  isFlagged: boolean;
}