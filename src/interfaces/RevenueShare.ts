export interface IRevenueShare {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profilePic: string;
  };
  startDate: Date;
  endDate: Date;
  internalStatus: string;
  externalStatus: string;
  payoutMethod: string;
  totalPurchasesAmount: number;
  transferFees: number;
  commissionFees: number;
  commissionPercent: number;
  amount: number;
  failureReason?: string;
  createdAt: Date;
}
