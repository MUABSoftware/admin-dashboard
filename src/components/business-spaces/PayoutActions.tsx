import { Button } from "@src/components/ui/button";  
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, 
  // CheckCircle, XCircle, FileText, 
  Send, Check, Clock, AlertCircle, ListTodo, FileDown } from "lucide-react";
// import { toast } from "@src/hooks/use-toast";
import { Payout_paypal } from "@src/types/payout";

type PayoutActionsProps = {
  payout: Payout_paypal;
  onViewDetails: () => void;
  onExport: () => void;
  onStatusUpdate: (status: Payout_paypal["status"]) => void;
};

export function PayoutActions({ payout, onViewDetails, onExport, onStatusUpdate }: PayoutActionsProps) {
  console.log (payout);

  const handleAction = (action: string) => {
    switch (action) {
      case "Approve":
      case "Cancel":
      case "Send Notification":
        // toast.success(`${action} action triggered for payout ${payout.id}`);
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#fff]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("Send Notification")}>
          <Send className="mr-2 h-4 w-4" />
          Send Notification
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => onStatusUpdate("Done")}>
          <Check className="mr-2 h-4 w-4" />
          Done
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate("In Progress")}>
          <Clock className="mr-2 h-4 w-4" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate("Pending")}>
          <AlertCircle className="mr-2 h-4 w-4" />
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate("To Do")}>
          <ListTodo className="mr-2 h-4 w-4" />
          To Do
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}