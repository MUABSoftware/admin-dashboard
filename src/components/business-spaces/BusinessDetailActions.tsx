import { Ban, CheckCircle } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@src/components/ui/dialog";
import { Textarea } from "@src/components/ui/textarea";
import { StopBusinessDialog } from "./StopBusinessDialog";
import request from "@src/config/axios";
import { toast } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { updateBusinessStatus } from "../store/Businessspaceslice";
import { Warning } from "@mui/icons-material";
import { CardContent } from "@mui/material";
import { BusinessSpaceDetail } from "@src/types";

interface BusinessDetailActionsProps {
  business: BusinessSpaceDetail;
}

function BusinessDetailActionButtons({ business }: BusinessDetailActionsProps) {
  const router = useRouter();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const handleReject = async () => {
    if (!rejectNote.trim()) {
      toast.error("Please provide a reason for rejecting this business space.");
      return;
    }

    try {
      const response = await request.patch(`/business/${business._id}/PENDING`, {
        reason: rejectNote
      });
      toast.success(response.data.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Failed to reject business");
    }
    setIsRejectDialogOpen(false);
  };

  const handleApproveBusiness = async () => {
    try {
      const response = await request.patch(`/business/${business._id}/ACTIVE`);
      toast.success(response.data.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Failed to approve business");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setIsStopDialogOpen(true)}
        disabled={business.status === 'INACTIVE'}
        variant="destructive"
        className="flex items-center bg-Table-Header-Color font-CustomPrimary-Color"
      >
        <Ban className="h-4 w-4" />
        Stop Business
      </Button>

      <Button
        onClick={handleApproveBusiness}
        disabled={business.status === 'ACTIVE'}
        variant="default"
        className="flex items-center bg-Table-Header-Color font-CustomPrimary-Color"
      >
        <CheckCircle className="h-4 w-4" />
        Approve Business
      </Button>

      <Button
        onClick={() => setIsRejectDialogOpen(true)}
        disabled={business.status === 'REJECTED' || business.status === 'PENDING'}
        variant="secondary"
        className="flex items-center bg-Table-Header-Color font-CustomPrimary-Color"
      >
        <Ban className="h-4 w-4" />
        Reject Business
      </Button>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent style={{ backgroundColor: "#fff" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1 pb-2 text-red-500">
              <Warning />
              Reject Business Space
            </DialogTitle>
            <p className="text-muted-foreground">
              Review and confirm rejecting this business space
            </p>
            <CardContent className="space-y-0" style={{ padding: "0px", paddingLeft: "10px" }}>
              <ul className="list-disc pl-4 space-y-0">
                <li>Removing all products from the marketplace</li>
                <li>Suspending all ongoing transactions</li>
                <li>Preventing new purchases</li>
                <li>Archiving business space data</li>
              </ul>
            </CardContent>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              onClick={() => setIsRejectDialogOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StopBusinessDialog
        open={isStopDialogOpen}
        onOpenChange={setIsStopDialogOpen}
        businessId={business._id}
      />
    </div>
  );
}

export function BusinessDetailActions({ business }: BusinessDetailActionsProps) {
  return (
    <Provider store={store}>
      <BusinessDetailActionButtons business={business} />
    </Provider>
  );
}