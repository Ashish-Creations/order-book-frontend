"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Save, CheckCircle } from "lucide-react"
import Link from "next/link"
import { BACKEND_URL } from "@/lib/config"

const stageNames = [
  "Inquiry",
  "Requirements Analysis",
  "Proposal",
  "Contract Review",
  "Development Planning",
  "Implementation",
  "Testing",
  "Deployment",
  "Completion",
]

const stageFields = [
  {
    stage: 1,
    name: "Inquiry",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "contactPerson", label: "Contact Person", type: "text", required: false },
      { name: "inquiryDetails", label: "Inquiry Details", type: "textarea", required: false },
    ],
  },
  {
    stage: 2,
    name: "Requirements Analysis",
    fields: [
      { name: "functionalRequirements", label: "Functional Requirements", type: "textarea", required: false },
      { name: "technicalRequirements", label: "Technical Requirements", type: "textarea", required: false },
      { name: "timeline", label: "Expected Timeline", type: "text", required: false },
    ],
  },
  {
    stage: 3,
    name: "Proposal",
    fields: [
      { name: "proposalDocument", label: "Proposal Document", type: "file", required: false },
      { name: "estimatedCost", label: "Estimated Cost", type: "number", required: false },
      { name: "deliverables", label: "Key Deliverables", type: "textarea", required: false },
    ],
  },
  {
    stage: 4,
    name: "Contract Review",
    fields: [
      { name: "contractTerms", label: "Contract Terms", type: "textarea", required: false },
      { name: "legalReview", label: "Legal Review Status", type: "text", required: false },
      { name: "signedContract", label: "Signed Contract", type: "file", required: false },
    ],
  },
  {
    stage: 5,
    name: "Development Planning",
    fields: [
      { name: "projectPlan", label: "Project Plan", type: "file", required: false },
      { name: "resourceAllocation", label: "Resource Allocation", type: "textarea", required: false },
      { name: "milestones", label: "Key Milestones", type: "textarea", required: false },
    ],
  },
  {
    stage: 6,
    name: "Implementation",
    fields: [
      { name: "developmentProgress", label: "Development Progress", type: "textarea", required: false },
      { name: "codeRepository", label: "Code Repository Link", type: "text", required: false },
      { name: "weeklyReports", label: "Weekly Progress Reports", type: "file", required: false },
    ],
  },
  {
    stage: 7,
    name: "Testing",
    fields: [
      { name: "testPlan", label: "Test Plan", type: "file", required: false },
      { name: "testResults", label: "Test Results", type: "textarea", required: false },
      { name: "bugReports", label: "Bug Reports", type: "file", required: false },
    ],
  },
  {
    stage: 8,
    name: "Deployment",
    fields: [
      { name: "deploymentPlan", label: "Deployment Plan", type: "file", required: false },
      { name: "productionUrl", label: "Production URL", type: "text", required: false },
      { name: "deploymentNotes", label: "Deployment Notes", type: "textarea", required: false },
    ],
  },
  {
    stage: 9,
    name: "Completion",
    fields: [
      { name: "finalDeliverables", label: "Final Deliverables", type: "file", required: false },
      { name: "clientFeedback", label: "Client Feedback", type: "textarea", required: false },
      { name: "projectSummary", label: "Project Summary", type: "textarea", required: false },
    ],
  },
].map(stage => ({
  ...stage,
  fields: stage.fields.map(field =>
    stage.stage === 1 && field.name === "companyName"
      ? field
      : { ...field, required: false }
  )
}));

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [loading, setLoading] = useState(true)
  const [currentStage, setCurrentStage] = useState(1)
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [savedStages, setSavedStages] = useState<Set<number>>(new Set())
  const [backendOrderId, setBackendOrderId] = useState(orderId || "");

  useEffect(() => {
    const loadOrderData = async () => {
      if (orderId) {
        try {
          // Load order data from backend API
          const response = await fetch(`${BACKEND_URL}/orders/${orderId}`);
          if (response.ok) {
            const data = await response.json();
            const order = data.order;
            
            // Set order number
            setOrderNumber(order.orderNumber || `ORD-2024-${orderId.padStart(3, "0")}`);
            setBackendOrderId(orderId);
            
            // Set current stage
            setCurrentStage(order.currentStage || 1);
            
            // Load form data
            if (order.formData) {
              setFormData(order.formData);
            }
            
            // Load saved stages
            if (order.savedStages && Array.isArray(order.savedStages)) {
              setSavedStages(new Set(order.savedStages));
            }
          } else {
            console.error("Failed to load order data");
            // Fallback to default values
            setOrderNumber(`ORD-2024-${orderId.padStart(3, "0")}`);
            setBackendOrderId(orderId);
          }
        } catch (err) {
          console.error("Error loading order data:", err);
          // Fallback to default values
          setOrderNumber(`ORD-2024-${orderId.padStart(3, "0")}`);
          setBackendOrderId(orderId);
        }
      } else {
        // If no orderId, this is a new order - get next order number from backend
        try {
          const response = await fetch(`${BACKEND_URL}/next-order-number`);
          if (response.ok) {
            const data = await response.json();
            setOrderNumber(data.orderNumber);
          } else {
            // Fallback to timestamp-based number
            const currentYear = new Date().getFullYear();
            const timestamp = Date.now();
            setOrderNumber(`${currentYear}-${timestamp.toString().slice(-4)}`);
          }
        } catch (err) {
          console.error("Error getting next order number:", err);
          // Fallback to timestamp-based number
          const currentYear = new Date().getFullYear();
          const timestamp = Date.now();
          setOrderNumber(`${currentYear}-${timestamp.toString().slice(-4)}`);
        }
      }

      setLoading(false);
    };

    loadOrderData();
  }, [orderId]);

  const currentStageData = stageFields.find((s) => s.stage === currentStage)
  const progress = (currentStage / 9) * 100

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`stage${currentStage}_${fieldName}`]: value,
    }))
  }

  const createOrderInDatabase = async (companyName: string) => {
    if (backendOrderId) return; // Order already exists
    
    const payload = {
      orderId: orderNumber,
      orderNumber: orderNumber,
      companyName: companyName,
      product: "",
      currentStage: 1,
      formData: { ...formData, [`stage${currentStage}_companyName`]: companyName },
      savedStages: Array.from(savedStages),
    };
    
    try {
      const res = await fetch(`${BACKEND_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setBackendOrderId(orderNumber);
      }
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  }

  const handleSaveAndExit = async (shouldRedirect = true) => {
    setSavedStages((prev) => new Set([...prev, currentStage]))
    
    // Create order if it doesn't exist and company name is filled
    if (!backendOrderId && formData["stage1_companyName"]?.trim()) {
      await createOrderInDatabase(formData["stage1_companyName"].trim());
    }
    
    const payload = {
      orderId: backendOrderId || orderNumber,
      orderNumber: orderNumber,
      companyName: formData["stage1_companyName"] || "",
      product: formData["stage2_functionalRequirements"] || "",
      currentStage,
      formData,
      savedStages: Array.from(savedStages),
    };
    try {
      if (!backendOrderId) {
        // Create new order
        const res = await fetch(`${BACKEND_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setBackendOrderId(orderNumber);
        }
      } else {
        // Update existing order
        await fetch(`${BACKEND_URL}/orders/${backendOrderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      // Optionally show error toast
    }
    
    if (shouldRedirect) {
      router.push("/");
    }
  }

  const handleNextStage = async () => {
    setSavedStages((prev) => new Set([...prev, currentStage]))
    
    // Create order if it doesn't exist and company name is filled
    if (!backendOrderId && formData["stage1_companyName"]?.trim()) {
      await createOrderInDatabase(formData["stage1_companyName"].trim());
    }
    
    const payload = {
      orderId: backendOrderId || orderNumber,
      orderNumber: orderNumber,
      companyName: formData["stage1_companyName"] || "",
      product: formData["stage2_functionalRequirements"] || "",
      currentStage: currentStage + 1,
      formData,
      savedStages: Array.from(savedStages),
    };
    try {
      if (!backendOrderId) {
        // Create new order
        const res = await fetch(`${BACKEND_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setBackendOrderId(orderNumber);
        }
      } else {
        // Update existing order
        await fetch(`${BACKEND_URL}/orders/${backendOrderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      // Optionally show error toast
    }
    if (currentStage < 9) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }

  const isCurrentStageComplete = () => {
    if (!currentStageData) return false
    return currentStageData.fields.every((field) => {
      const value = formData[`stage${currentStage}_${field.name}`]
      return field.required ? value && value.trim() !== "" : true
    })
  }

  const handleCompleteOrder = async () => {
    try {
      // First save the current stage without redirecting
      await handleSaveAndExit(false);
      
      // Then call the complete order endpoint
      const response = await fetch(`${BACKEND_URL}/complete-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderNumber }),
      });
      
      if (response.ok) {
        // Redirect to dashboard after successful completion
        router.push("/");
      } else {
        const data = await response.json();
        console.error("Failed to complete order:", data.error);
        // Still redirect to dashboard even if complete order fails
        router.push("/");
      }
    } catch (err) {
      console.error("Error completing order:", err);
      // Still redirect to dashboard even if there's an error
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading order data...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve your order information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {orderNumber}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {orderId ? "Continue Order" : "New Order"} - Stage {currentStage}
          </h1>
          <p className="text-muted-foreground">{currentStageData?.name}</p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Progress</CardTitle>
              <span className="text-sm text-muted-foreground">Stage {currentStage} of 9</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="grid grid-cols-9 gap-2">
              {stageNames.map((name, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto mb-1 ${
                      index + 1 < currentStage || savedStages.has(index + 1)
                        ? "bg-green-500 text-white"
                        : index + 1 === currentStage
                          ? "bg-blue-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1 < currentStage || savedStages.has(index + 1) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{name.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              Stage {currentStage}: {currentStageData?.name}
            </CardTitle>
            <CardDescription>Please fill in all required details for this stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStageData?.fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[`stage${currentStage}_${field.name}`] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    rows={4}
                  />
                ) : field.type === "file" ? (
                  <Input
                    id={field.name}
                    type="file"
                    onChange={(e) => handleInputChange(field.name, e.target.files?.[0]?.name || "")}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[`stage${currentStage}_${field.name}`] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <Button variant="outline" onClick={handlePreviousStage} disabled={currentStage === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Stage
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSaveAndExit()}>
              <Save className="h-4 w-4 mr-2" />
              Save & Exit
            </Button>

            {currentStage < 9 ? (
              <Button onClick={handleNextStage} disabled={!isCurrentStageComplete()}>
                Next Stage
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCompleteOrder}
                disabled={!isCurrentStageComplete()}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Order
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
