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
  import { useDispatch } from "react-redux";
  import Product from "./ProductsTable";
  import { updateProductStatus } from "../store/businessProductSlice";
  
  interface StopProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
  }
  
  export function StopProductDialog({
    open,
    onOpenChange,
    product,
  }: StopProductDialogProps) {
    const [note, setNote] = useState("");
    const dispatch = useDispatch();

    const handleStop = async () => {
        try {
            if(!note.trim()){
                toast.error("Please provide a reason for stopping this product.");
                return;
            }
            const response = await request.patch(`/product/${product._id}/stopped`,
                {
                    reason: note
                }, {
              headers: {
                "version": "3"
              }
            });
            if (response.status === 200) {
              dispatch(updateProductStatus({ productId: product._id, status: 'stopped' }));
              toast.success("Product stopped successfully");
              onOpenChange(false);
              setNote("");
            }
          } catch (error) {
            console.error("Error stopping product:", error);
            toast.error("Failed to stop product");
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
          Stop Product
        </DialogTitle>
        <p className="text-muted-foreground ps-5">
          Review and confirm stopping this product
        </p>
  
        {/* <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Stop Business Space</h2>
         
        </div> */}
        <DialogContent>
          <CardDescription className="pb-4">
            This action will immediately stop all operations for this product.
            This includes:
          </CardDescription>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6 space-y-2">
              <li>Removing the product from the marketplace</li>
              <li>Suspending all ongoing transactions</li>
              <li>Preventing new purchases</li>
              <li>Archiving product data</li>
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
            placeholder="Please provide a reason for stopping this product..."
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