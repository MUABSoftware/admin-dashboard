"use client"
import { Button } from "@src/components/ui/button"
import { MessageSquare, CheckCircle, Ban, AlertCircle } from "lucide-react"
import { StopProductDialog } from "./stopBussinessPorductDialog"
import request from "@src/config/axios"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog"
import { Textarea } from "@src/components/ui/textarea"
import { useState } from "react"
import { useDispatch } from "react-redux"
import Product from "./ProductsTable"
import { toast } from "react-toastify"
import { CardContent } from "@mui/material"
import { Warning } from "@mui/icons-material"
import { store } from "../store/store"
import { Provider } from "react-redux"
import { updateProductStatus } from "../store/businessProductSlice"

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  return (
    <Provider store={store}>
      <ProductDetailActionButtons product={product} />
    </Provider>
  )
}

function ProductDetailActionButtons({ product }: ProductDetailActionsProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionNote, setRejectionNote] = useState("")
  const [isStopProductDialogOpen, setIsStopProductDialogOpen] = useState(false)
  const dispatch = useDispatch()

  const handleStopProduct = () => {
    setIsStopProductDialogOpen(true)
  }

  const handleNotifyCreator = () => {
    toast.success(`Message sent to ${product.creator}`)
  }

  const handleApprove = async () => {
    try {
      const response = await request.patch(`/product/${product._id}/approve`, {
        headers: {
          "version": "3"
        }
      })
      if (response.status === 200) {
        toast.success("Product approved successfully")
        dispatch(updateProductStatus({ productId: product._id, status: 'active' }))
        window.location.reload()
      }
    } catch (error) {
      console.error("Error approving product:", error)
      toast.error("Failed to approve product")
    }
  }

  const handleInReview = async () => {
    try {
      const response = await request.patch(`/product/${product._id}/in_review`, {
        headers: {
          "version": "3"
        }
      })
      if (response.status === 200) {
        toast.success("Product in review successfully")
        dispatch(updateProductStatus({ productId: product._id, status: 'in_review' }))
        window.location.reload()
      }
    } catch (error) {
      console.error("Error in review product:", error)
      toast.error("Failed to in review product")
    }
  }

  const handleReject = () => {
    setIsRejectDialogOpen(true)
  }

  const handleRejectSubmit = async () => {
    if (!rejectionNote.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }
    try {
      const response = await request.patch(`/product/${product._id}/rejected`, {
        reason: rejectionNote
      }, {
        headers: {
          "version": "3"
        }
      })
      if (response.status === 200) {
        toast.success("Product rejected successfully")
        setIsRejectDialogOpen(false)
        dispatch(updateProductStatus({ productId: product._id, status: 'rejected' }))
        window.location.reload()
      }
    } catch (error) {
      console.error("Error rejecting product:", error)
      toast.error("Failed to reject product")
    }
  }

  return (
    <>
      <div className="flex gap-2">
        {product.status !== 'active' && (
          <Button
            onClick={handleApprove}
            variant="default"
            className="bg-Table-Header-Color text-white"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        )}

        {product.status !== 'rejected' && product.status !== 'active' && (
          <Button
            onClick={handleReject}
            variant="destructive"
            className="bg-Table-Header-Color text-white"
          >
            <Ban className="mr-2 h-4 w-4" />
            Reject
          </Button>
        )}

        {product.status !== 'stopped' && (
          <Button
            onClick={handleStopProduct}
            variant="destructive"
            className="bg-Table-Header-Color text-white"
          >
            <Ban className="mr-2 h-4 w-4" />
            Stop
          </Button>
        )}

        {product.status !== 'in_review' && (
          <Button
            onClick={handleInReview}
            variant="default"
            className="bg-Table-Header-Color text-white"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            In Review
          </Button>
        )}

        {/* <Button
          onClick={handleNotifyCreator}
          variant="outline"
        >
          <MessageSquare className="bg-Table-Header-Color text-white" />
          Message Creator
        </Button> */}
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent style={{ backgroundColor: '#fff' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1 pb-2 text-red-500">
              <Warning />
              Reject Digital Product
            </DialogTitle>
            <p className="text-muted-foreground">
              Review and confirm rejecting this digital product
            </p>
            <p>
              This action will immediately stop all operations for this product.
              This includes:
            </p>
            <CardContent className="space-y-0" style={{ padding: "0px", paddingLeft: "10px" }}>
              <ul className="list-disc pl-4 space-y-0">
                <li>Removing the product from the marketplace</li>
                <li>Suspending all ongoing transactions</li>
                <li>Preventing new purchases</li>
                <li>Archiving product data</li>
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
            <Button
              onClick={() => setIsRejectDialogOpen(false)}
              variant="outline"
              className="bg-Table-Header-Color font-CustomPrimary-Color text-white border-none">
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              variant="destructive"
              className="bg-red-500 text-white border-none">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StopProductDialog
        open={isStopProductDialogOpen}
        onOpenChange={setIsStopProductDialogOpen}
        product={product}
      />
    </>
  )
} 