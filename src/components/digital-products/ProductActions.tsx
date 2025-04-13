"use client"
import { Button } from "@src/components/ui/button";
import { MessageSquare, MoreVertical, CheckCircle, Ban } from "lucide-react";
import { StopProductDialog } from "./stopBussinessPorductDialog";
 
 import request from "@src/config/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  // DropdownMenuSeparator,
} from "@src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog"
import { Textarea } from "@src/components/ui/textarea"
import { useState } from "react"
import { useDispatch } from "react-redux";
 import Product from "./ProductsTable"; 
import { toast } from "react-toastify";
import { CardContent } from "@mui/material";

//  import { AlertTriangle } from "lucide-react";
 import { Warning } from "@mui/icons-material";
 import { store } from "../store/store";
 import { Provider } from "react-redux";
import { updateProductStatus } from "../store/businessProductSlice";
interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  return <Provider store={store}> 
    <ProductActionss product={product} />
  </Provider>
}

 function ProductActionss({ product }: ProductActionsProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionNote, setRejectionNote] = useState("")
  const [isStopProductDialogOpen, setIsStopProductDialogOpen] = useState(false)
const dispatch = useDispatch();
  const handleStopProduct = async () => {
    setIsStopProductDialogOpen(true)

   
  };

  const handleNotifyCreator = () => {
    toast.success(`Message sent to ${product.creator}`);
  };

  const handleApprove = async() => {
    try {
      console.log("approve product", product);
      const response = await request.patch(`/product/${product._id}/approve`,  {
        headers: {
          "version": "3"
        }
      });
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Product approved successfully");
        dispatch(updateProductStatus({ productId: product._id, status: 'active' }));
        // window.location.reload(); // Refresh the page to show updated status
      }
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error("Failed to approve product");
    }
  }
  const handleInReview = async () => {
    try {
      const response = await request.patch(`/product/${product._id}/in_review`, {
        headers: {
          "version": "3"
        }
      });
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Product in review successfully");
        dispatch(updateProductStatus({ productId: product._id, status: 'in_review' }));
      }
    } catch (error) {
      console.error("Error in review product:", error);
      toast.error("Failed to in review product");
    }
  }

  const handleReject = async () => {
    setIsRejectDialogOpen(true)
 
  }

  const handleRejectSubmit = async () => {
    if(rejectionNote.length === 0) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      const response = await request.patch(`/product/${product._id}/rejected`,{
        reason: rejectionNote
      }, {
        headers: {
          "version": "3"
        }
      });
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Product rejected successfully");
        setIsRejectDialogOpen(false)
        dispatch(updateProductStatus({ productId: product._id, status: 'rejected' }));
        setRejectionNote("")
      }
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast.error("Failed to reject product");
    }

    // Add your reject logic here with rejectionNote
   
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ backgroundColor: '#fff' }}>
          <DropdownMenuItem onClick={handleApprove} disabled={product.status === 'active'}>
           
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />


            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReject} disabled={product.status === 'rejected' || product.status === 'active'}>
            <Ban className="mr-2 h-4 w-4 text-red-500" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStopProduct} disabled={product.status === 'stopped'}>
            <Ban className="mr-2 h-4 w-4 text-red-500" />
            Stop Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleInReview} disabled={product.status === 'in_review'}>
            <Ban className="mr-2 h-4 w-4 text-red-500" />
            InReview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleNotifyCreator}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Creator
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent style={{ backgroundColor: '#fff' }}>
          <DialogHeader>
            {/* <DialogTitle>Reject Product</DialogTitle> */}
          </DialogHeader>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1 pb-2 text-red-500">
              <Warning />
              Reject Business Product   

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
          <div className="py-4">
            <Textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectSubmit} 
              style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
        <StopProductDialog open={isStopProductDialogOpen} onOpenChange={setIsStopProductDialogOpen} product={product} />
      </Dialog>
    </>
  );
}