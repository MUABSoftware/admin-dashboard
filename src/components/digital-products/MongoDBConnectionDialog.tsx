"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog"
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import { Label } from "@src/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui/select"
import { Database, Server, Cloud, HardDrive } from "lucide-react"

interface MongoDBConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (connectionString: string) => void
}

type DeploymentType = "local" | "atlas" | "other"

interface ConnectionDetails {
  hostname: string
  port: string
  username: string
  password: string
  database: string
}

export function MongoDBConnectionDialog({
  open,
  onOpenChange,
  onConnect,
}: MongoDBConnectionDialogProps) {
  const [step, setStep] = useState(1)
  const [deploymentType, setDeploymentType] = useState<DeploymentType | null>(null)
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>({
    hostname: "",
    port: "",
    username: "",
    password: "",
    database: "",
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionString, setConnectionString] = useState("")

  const handleDeploymentSelect = (type: DeploymentType) => {
    setDeploymentType(type)
    setStep(2)
  }

  const handleDetailsChange = (field: keyof ConnectionDetails, value: string) => {
    setConnectionDetails(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate connection string
    const newDetails = { ...connectionDetails, [field]: value }
    const baseString = `mongodb${deploymentType === 'atlas' ? '+srv' : ''}://`
    const auth = newDetails.username && newDetails.password 
      ? `${newDetails.username}:${newDetails.password}@`
      : ''
    const host = newDetails.hostname
    const port = deploymentType !== 'atlas' && newDetails.port ? `:${newDetails.port}` : ''
    const database = newDetails.database ? `/${newDetails.database}` : ''
    
    setConnectionString(`${baseString}${auth}${host}${port}${database}`)
  }

  const handleTestConnection = async () => {
    setIsConnecting(true)
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Connection test successful!")
      setStep(4)
    } catch (error) {
      toast.error("Connection test failed")
      console.error("MongoDB connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnect = async () => {
    if (!connectionString) {
      toast.error("Please complete the connection setup")
      return
    }

    setIsConnecting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      onConnect(connectionString)
      toast.success("Successfully connected to MongoDB")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to connect to MongoDB")
      console.error("MongoDB connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleDeploymentSelect("local")}
            >
              <CardContent className="flex flex-col items-center space-y-2 pt-4">
                <Server className="h-12 w-12 text-primary" />
                <h3 className="font-semibold">Local MongoDB</h3>
                <p className="text-sm text-center text-muted-foreground">Connect to a local MongoDB instance</p>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleDeploymentSelect("atlas")}
            >
              <CardContent className="flex flex-col items-center space-y-2 pt-4">
                <Cloud className="h-12 w-12 text-primary" />
                <h3 className="font-semibold">MongoDB Atlas</h3>
                <p className="text-sm text-center text-muted-foreground">Connect to MongoDB Atlas cloud service</p>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleDeploymentSelect("other")}
            >
              <CardContent className="flex flex-col items-center space-y-2 pt-4">
                <HardDrive className="h-12 w-12 text-primary" />
                <h3 className="font-semibold text-center">Other Deployment</h3>
                <p className="text-sm text-center text-muted-foreground">Connect to other MongoDB deployments</p>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input
                id="hostname"
                placeholder={deploymentType === 'atlas' ? "cluster.mongodb.net" : "localhost"}
                value={connectionDetails.hostname}
                onChange={(e) => handleDetailsChange("hostname", e.target.value)}
              />
            </div>
            {deploymentType !== 'atlas' && (
              <div className="grid gap-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="27017"
                  value={connectionDetails.port}
                  onChange={(e) => handleDetailsChange("port", e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={connectionDetails.username}
                onChange={(e) => handleDetailsChange("username", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={connectionDetails.password}
                onChange={(e) => handleDetailsChange("password", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                value={connectionDetails.database}
                onChange={(e) => handleDetailsChange("database", e.target.value)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Connection String Preview</Label>
              <div className="p-4 bg-muted rounded-md">
                <code className="text-sm break-all">{connectionString}</code>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Database Selection</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sample">Sample Database</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <Label>Schema Preview</Label>
              <div className="mt-2 p-4 bg-muted rounded-md h-32 flex items-center justify-center">
                <Database className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Schema visualization will appear here</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    if (step === 2 && !connectionString) {
      toast.error("Please fill in all required fields")
      return
    }
    setStep(prev => Math.min(4, prev + 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" style={{ backgroundColor: '#fff' }}>
        <DialogHeader>
          <DialogTitle>Connect to MongoDB</DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose your MongoDB deployment type to get started."}
            {step === 2 && "Enter your connection details."}
            {step === 3 && "Review your connection string."}
            {step === 4 && "Select a database and review the schema."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderStep()}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', }}
                onClick={handleBack}
                disabled={isConnecting}
              >
                Back
              </Button>
            )}
          </div>
          <div className="space-x-2">
            {step === 2 && (
              <Button
                variant="secondary"
                style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', }}
                onClick={handleTestConnection}
                disabled={isConnecting}
              >
                Test Connection
              </Button>
            )}
            {step < 4 ? (
              <Button
                 style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', }}
                onClick={handleNext}
                disabled={isConnecting || (step === 1 && !deploymentType)}
              >
                Next
              </Button>
            ) : (
                <Button
                style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', }}
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}