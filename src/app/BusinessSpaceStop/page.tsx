"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card"
import { toast } from "sonner"
// import { colors } from "@mui/material";

export default function BusinessSpaceStop() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  console.log(businessId)
  const handleStop = () => {
    console.log("stop business space")
    toast.success("Business space stopped successfully")
  }
  const router = useRouter();
  return (
    <div className="container space-y-6 p-8 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Stop Business Space</h2>
        <p className="text-muted-foreground">
          Review and confirm stopping this business space
        </p>
      </div>

      <Card className="max-w-2xl" style={{ backgroundColor: "#fff" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive" style={{ color: "#ef4444" }}>
            <AlertCircle className="h-5 w-5" />
            Stop Business Space
          </CardTitle>
          <CardDescription>
            This action will immediately stop all operations for this business space.
            This includes:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc pl-6 space-y-2">
            <li>Removing all products from the marketplace</li>
            <li>Suspending all ongoing transactions</li>
            <li>Preventing new purchases</li>
            <li>Archiving business space data</li>
          </ul>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="destructive" onClick={handleStop} style={{ backgroundColor: "#ef4444", color: "#fff" }}>
            Confirm Stop
          </Button>
          <Button onClick={() => router.push("/business-spaces")} variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  )
}