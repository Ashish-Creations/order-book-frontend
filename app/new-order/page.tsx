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
      { name: "contactPerson", label: "Contact Person", type: "text", required: true },
      { name: "inquiryDetails", label: "Inquiry Details", type: "textarea", required: true },
    ],
  },
  {
    stage: 2,
    name: "Requirements Analysis",
    fields: [
      { name: "functionalRequirements", label: "Functional Requirements", type: "textarea", required: true },
      { name: "technicalRequirements", label: "Technical Requirements", type: "textarea", required: true },
      { name: "timeline", label: "Expected Timeline", type: "text", required: true },
    ],
  },
  {
    stage: 3,
    name: "Proposal",
    fields: [
      { name: "proposalDocument", label: "Proposal Document", type: "file", required: true },
      { name: "estimatedCost", label: "Estimated Cost", type: "number", required: true },
      { name: "deliverables", label: "Key Deliverables", type: "textarea", required: true },
    ],
  },
  {
    stage: 4,
    name: "Contract Review",
    fields: [
      { name: "contractTerms", label: "Contract Terms", type: "textarea", required: true },
      { name: "legalReview", label: "Legal Review Status", type: "text", required: true },
      { name: "signedContract", label: "Signed Contract", type: "file", required: true },
    ],
  },
  {
    stage: 5,
    name: "Development Planning",
    fields: [
      { name: "projectPlan", label: "Project Plan", type: "file", required: true },
      { name: "resourceAllocation", label: "Resource Allocation", type: "textarea", required: true },
      { name: "milestones", label: "Key Milestones", type: "textarea", required: true },
    ],
  },
  {
    stage: 6,
    name: "Implementation",
    fields: [
      { name: "developmentProgress", label: "Development Progress", type: "textarea", required: true },
      { name: "codeRepository", label: "Code Repository Link", type: "text", required: true },
      { name: "weeklyReports", label: "Weekly Progress Reports", type: "file", required: true },
    ],
  },
  {
    stage: 7,
    name: "Testing",
    fields: [
      { name: "testPlan", label: "Test Plan", type: "file", required: true },
      { name: "testResults", label: "Test Results", type: "textarea", required: true },
      { name: "bugReports", label: "Bug Reports", type: "file", required: true },
    ],
  },
  {
    stage: 8,
    name: "Deployment",
    fields: [
      { name: "deploymentPlan", label: "Deployment Plan", type: "file", required: true },
      { name: "productionUrl", label: "Production URL", type: "text", required: true },
      { name: "deploymentNotes", label: "Deployment Notes", type: "textarea", required: true },
    ],
  },
  {
    stage: 9,
    name: "Completion",
    fields: [
      { name: "finalDeliverables", label: "Final Deliverables", type: "file", required: true },
      { name: "clientFeedback", label: "Client Feedback", type: "textarea", required: true },
      { name: "projectSummary", label: "Project Summary", type: "textarea", required: true },
    ],
  },
]

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [loading, setLoading] = useState(true)
  const [currentStage, setCurrentStage] = useState(1)
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [savedStages, setSavedStages] = useState<Set<number>>(new Set())

  useEffect(() => {
    // If we have an orderId, load the order data
    if (orderId) {
      // In a real app, this would be an API call to get the order data
      // For this demo, we'll simulate loading from localStorage or use mock data

      // Try to load from localStorage first (for orders created in this session)
      const savedOrderData = localStorage.getItem(`order_${orderId}`)

      if (savedOrderData) {
        try {
          const orderData = JSON.parse(savedOrderData)
          setOrderNumber(orderData.orderNumber)
          setCurrentStage(orderData.currentStage)
          setFormData(orderData.formData || {})
          setSavedStages(new Set(orderData.savedStages || []))
        } catch (error) {
          console.error("Error parsing saved order:", error)
        }
      } else {
        // If not found in localStorage, use mock data (in a real app, this would be from an API)
        // This simulates loading an order from the database
        const mockOrderData = {
          id: orderId,
          orderNumber: `ORD-2024-${orderId.padStart(3, "0")}`,
          currentStage: 4, // Example: order is at stage 4
          formData: {
            stage1_companyName: "Acme Corp",
            stage1_contactPerson: "John Smith",
            stage1_inquiryDetails: "Need a new website with e-commerce functionality",
            stage2_functionalRequirements: "Product catalog, shopping cart, user accounts",
            stage2_technicalRequirements: "React, Next.js, Stripe integration",
            stage2_timeline: "3 months",
            stage3_proposalDocument: "proposal.pdf",
            stage3_estimatedCost: "25000",
            stage3_deliverables: "Website, admin panel, payment integration",
          },
          savedStages: [1, 2, 3],
        }

        setOrderNumber(mockOrderData.orderNumber)
        setCurrentStage(mockOrderData.currentStage)
        setFormData(mockOrderData.formData)
        setSavedStages(new Set(mockOrderData.savedStages))
      }
    } else {
      // If no orderId, this is a new order
      setOrderNumber(`ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, "0")}`)
    }

    setLoading(false)
  }, [orderId])

  const currentStageData = stageFields.find((s) => s.stage === currentStage)
  const progress = (currentStage / 9) * 100

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`stage${currentStage}_${fieldName}`]: value,
    }))
  }

  const handleSaveAndExit = () => {
    setSavedStages((prev) => new Set([...prev, currentStage]))
    // In a real app, save to database/localStorage
    localStorage.setItem(
      `order_${orderNumber}`,
      JSON.stringify({
        orderNumber,
        currentStage,
        formData,
        savedStages: Array.from(savedStages),
      }),
    )
    router.push("/")
  }

  const handleNextStage = () => {
    setSavedStages((prev) => new Set([...prev, currentStage]))
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
          <h1 className="text-3xl font-bold mb-2">New Order - Stage {currentStage}</h1>
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
            <Button variant="outline" onClick={handleSaveAndExit}>
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
                onClick={() => {
                  handleSaveAndExit()
                  router.push("/")
                }}
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
