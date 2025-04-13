"use client"
// import { useParams } from "react-router-dom"
import { Shield, MapPin, Mail, Phone } from "lucide-react"
import { Badge } from "@src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card"

export default function BusinessSpaceDetails() {
  // const { id } = useParams()
  // console.log("id", id)
  // Mock data - in a real app, this would fetch from an API
  const space = {
    id: "BS001",
    userId: "USR001",
    uniqueName: "Tech Academy Pro",
    productsCount: 15,
    addingCertificate: true,
    hasPayoutMethod: true,
    isVerified: true,
    isPhoneVerified: true,
    credibilityId: "CRED001",
    phoneNumber: "+1234567890",
    email: "contact@techacademypro.com",
    country: "United States",
    category: "Education",
  }

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{space.uniqueName}</h2>
          <p className="text-muted-foreground">Business Space Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{space.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{space.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{space.phoneNumber}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={space.isVerified ? "default" : "secondary"}>
                {space.isVerified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant={space.isPhoneVerified ? "default" : "secondary"}>
                {space.isPhoneVerified ? "Phone Verified" : "Phone Unverified"}
              </Badge>
              <Badge variant={space.hasPayoutMethod ? "default" : "destructive"}>
                Payout Method {space.hasPayoutMethod ? "Added" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Category: {space.category}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Products Count: </span>
              <span>{space.productsCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}