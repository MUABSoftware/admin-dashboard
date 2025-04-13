import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Button,
  TextField,
  // List,
  // ListItem,
  // ListItemText,
  // Box,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import { useState } from "react";
// import { toast } from "sonner";
import { toast } from "react-toastify";
import { Button } from "@src/components/ui/button";
import { CardContent, CardDescription } from "@src/components/ui/card";
import request from "@src/config/axios";
import { updateBusinessStatus } from "../store/Businessspaceslice";
import { useDispatch } from "react-redux";

interface StopBusinessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
}

export function StopBusinessDialog({
  open,
  onOpenChange,
  businessId,
}: StopBusinessDialogProps) {
  const [note, setNote] = useState("");
  const dispatch = useDispatch();
  const handleStop = async () => {
    try {
      if (!note.trim()) {
        toast.error("Please provide a reason for stopping this business space.");
        return; // Exit the function if the note is empty
      }
      console.log(note);
      const response = await request.patch(`/business/${businessId}/INACTIVE`, {
        reason: note,
      });
      console.log("Product status updated successfully", response.data);
      dispatch(updateBusinessStatus({ id: businessId, status: "INACTIVE" }));
      onOpenChange(false);
      toast.success(response.data.message);

    } catch (error: any) {
      console.error("Error updating business status:", error);
      toast.error(error.response.data.message ?? "Failed to update business status");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }} >
        <Warning />
        Stop Business Space

      </DialogTitle>
      <p className="text-muted-foreground  ps-5">
        Review and confirm stopping this business space
      </p>

      {/* <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Stop Business Space</h2>
       
      </div> */}
      <DialogContent>
        <CardDescription className="pb-4">
          This action will immediately stop all operations for this business space.
          This includes:
        </CardDescription>
        <CardContent className="space-y-2">
          <ul className="list-disc pl-6 space-y-2">
            <li>Removing all products from the marketplace</li>
            <li>Suspending all ongoing transactions</li>
            <li>Preventing new purchases</li>
            <li>Archiving business space data</li>
          </ul>
        </CardContent>
        <TextField
          label="Reason for stopping"
          multiline
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Please provide a reason for stopping this business space..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)} variant="default" color="error" className="bg-red-500 text-white">
          Cancel
        </Button>
        {/* <Button onClick={handleBulkApprove} variant="default" className="bg-blue-500 text-white">
            Cancel   
          </Button> */}
        <Button
          onClick={handleStop}
          color="error"
          variant="default"
          className="bg-blue-500 text-white"
        >
          Confirm Stop
        </Button>
      </DialogActions>
    </Dialog>
  );
}