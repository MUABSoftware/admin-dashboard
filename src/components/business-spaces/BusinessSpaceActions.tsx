import {
  MoreHorizontal,
  //  Eye, Edit,
  Ban, CheckCircle
} from "lucide-react";
// import { Button } from "@src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
// import { Button as MuiButton } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@src/components/ui/dialog";
import { Textarea } from "@src/components/ui/textarea";
// import StopBusinessDialog from "./StopBusinessDialog";
import { StopBusinessDialog } from "./StopBusinessDialog";
import request from "@src/config/axios";
import { toast } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { updateBusinessStatus } from "../store/Businessspaceslice";
import { Warning } from "@mui/icons-material";
// import { CardDescription } from "../ui/card";
import { CardContent } from "@mui/material";
import { BusinessSpace } from "@src/types";
// import { red } from "@mui/material/colors";

// const BUSINESS_STATUS = {
//   ACTIVE: "active",
//   DRAFT: "draft",
//   UNPUBLISHED: "unpublished",
// } as const;

interface BusinessSpaceActionsProps {
  business: BusinessSpace;
}

export function BusinessSpaceActions({ business }: BusinessSpaceActionsProps) {
  return (
    <Provider store={store}>
      <BusinessSpaceActionss business={business} />
    </Provider>
  );
}


export function BusinessSpaceActionss({ business }: BusinessSpaceActionsProps,) {
  const router = useRouter();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  // const [selectedBusiness, setSelectedBusiness] = useState<BusinessSpace>(business);
  const dispatch = useDispatch();
  // const [status, setStatus] = useState(business.status);

  const handleReject = async () => {
    if (!rejectNote.trim()) {
      toast.error("Please provide a reason for rejecting this business space.");
      return; // Exit the function if the note is empty
    }

    console.log("Rejecting business with note:", rejectNote);
    // router.push(`/business/${business._id}/reject?note=${encodeURIComponent(rejectNote)}`);
    const response = await request.patch(`/business/${business._id}/PENDING`, {
      reason: rejectNote
    });
    console.log("response", response);
    dispatch(updateBusinessStatus({ id: business._id, status: "PENDING" }));
    setIsRejectDialogOpen(false);
    router.refresh();



    toast.success(response.data.message);
  };

  // const handleStopBusiness = () => {
  //   console.log("Stopping business:", business.businessId);
  //   setIsStopDialogOpen(false); 
  // };

  const handleApproveBusiness = async (business: BusinessSpace) => {
    try {
      const response = await request.patch(`/business/${business._id}/ACTIVE`);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      console.log("Product status updated successfully", response.data);

      dispatch(updateBusinessStatus({ id: business._id, status: "ACTIVE" }));

      // setStatus(response.data.updatedBusiness.status);  
      // business.status =  "ACTIVE";


      router.refresh();
    } catch (error: any) {
      console.error("Error updating business status:", error);
      toast.error(error.response.data.message ?? "Failed to update business status");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ backgroundColor: "#fff" }}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsStopDialogOpen(true)} disabled={business.status === 'INACTIVE'}>
            <Ban className={`mr-2 h-4 w-4 text-red-500 ${business.status === 'INACTIVE' ? 'opacity-50  cursor-not-allowed text-gray-400' : ''}`} />
            Stop Business
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleApproveBusiness(business)} disabled={business.status === 'ACTIVE'}>
            <CheckCircle className={`mr-2 h-4 w-4 text-green-500 ${business.status === 'ACTIVE' ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`} />
            Approve Business
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsRejectDialogOpen(true)} 
            disabled={business.status === 'REJECTED' || business.status === 'PENDING'}
          >
            <Ban className={`mr-2 h-4 w-4 text-red-500 ${
              business.status === 'REJECTED' || business.status === 'PENDING' 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
            }`} />
            Reject Business
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent style={{ backgroundColor: "#fff" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1 pb-2 text-red-500">
              <Warning />
              Reject Business Space

            </DialogTitle>
            <p className="text-muted-foreground ">
              Review and confirm rejecting this business space
            </p>
            {/* <CardDescription className="text-muted-foreground"> */}
              <p>
                This action will immediately stop all operations for this business space.
                This includes:
              </p>
            {/* </CardDescription> */}
            <CardContent className="space-y-0" style={{ padding: "0px", paddingLeft: "10px" }}>
              <ul className="list-disc pl-4 space-y-0">
                <li>Removing all products from the marketplace</li>
                <li>Suspending all ongoing transactions</li>
                <li>Preventing new purchases</li>
                <li>Archiving business space data</li>
              </ul>
            </CardContent>
          </DialogHeader>
          <div className="">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button

              onClick={() => setIsRejectDialogOpen(false)}
              // style={{ backgroundColor: "red !important", color: "#000" }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel
            </Button>
            <Button
              // variant="contained"
              onClick={handleReject}
              // disabled={!rejectNote.trim()}
              // style={{ backgroundColor: "#fff !important", color: "#000" }}
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

    </>
  );
}