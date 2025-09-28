"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Building,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/config";

const mockOrderDetails = {
  id: "1",
  orderNumber: "ORD-2024-001",
  companyName: "Acme Corp",
  contactPerson: "John Smith",
  email: "john.smith@acmecorp.com",
  phone: "+1 (555) 123-4567",
  currentStage: 5,
  status: "in-progress",
  dateInitiated: "2024-01-15",
  lastUpdated: "2024-01-20",
  paymentReceived: false,
  totalValue: 25000,
  estimatedCompletion: "2024-02-15",
  stageDetails: [
    { stage: 1, name: "Inquiry", completed: true, completedDate: "2024-01-15" },
    {
      stage: 2,
      name: "Requirements Analysis",
      completed: true,
      completedDate: "2024-01-16",
    },
    {
      stage: 3,
      name: "Proposal",
      completed: true,
      completedDate: "2024-01-17",
    },
    {
      stage: 4,
      name: "Development Planning",
      completed: true,
      completedDate: "2024-01-19",
    },
    {
      stage: 5,
      name: "Packaging & Dispatch",
      completed: true,
      completedDate: "2024-01-20",
    },
    { stage: 6, name: "Completion", completed: false, completedDate: null },
  ],
};

const stageNames = [
  "Inquiry",
  "Requirements Analysis",
  "Proposal",
  "Development Planning",
  "Packaging & Dispatch",
  "Completion",
];

export default function OrderDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [order] = useState(mockOrderDetails);
  const [paymentReceived, setPaymentReceived] = useState(order.paymentReceived);

  const progress = (order.currentStage / 6) * 100;
  const completedStages = order.stageDetails.filter(
    (stage) => stage.completed
  ).length;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        );
      case "payment-pending":
        return <Badge variant="destructive">Payment Pending</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleMarkPaymentReceived = () => {
    setPaymentReceived(true);
    // In a real app, this would update the database
  };

  const handleCompleteOrder = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/complete-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderNumber }),
      });
      if (response.ok) {
        toast({
          title: "Order completed!",
          description: "A WhatsApp message was sent to the client.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to complete order.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Could not complete order.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
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
              {order.orderNumber}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <p className="text-muted-foreground">
            Complete order information and progress tracking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Overview
                  {getStatusBadge(order.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.companyName}</p>
                      <p className="text-sm text-muted-foreground">Company</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {formatDate(order.dateInitiated)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date Initiated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        ${order.totalValue.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Value
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {formatDate(order.estimatedCompletion)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Est. Completion
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Stage {order.currentStage} of 6 - {completedStages} stages
                  completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="mb-6" />
                <div className="space-y-3">
                  {order.stageDetails.map((stage, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.completed
                              ? "bg-green-500 text-white"
                              : index + 1 === order.currentStage
                              ? "bg-blue-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {stage.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            Stage {stage.stage}: {stage.name}
                          </p>
                          {stage.completed && stage.completedDate && (
                            <p className="text-sm text-muted-foreground">
                              Completed on{" "}
                              {new Date(
                                stage.completedDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {stage.completed ? (
                        <Badge variant="default" className="bg-green-500">
                          Completed
                        </Badge>
                      ) : index + 1 === order.currentStage ? (
                        <Badge variant="secondary">In Progress</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.contactPerson}</p>
                  <p className="text-sm text-muted-foreground">
                    Contact Person
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">{order.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">{order.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Payment Status
                  {paymentReceived ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentReceived ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700">
                      Payment Received
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Order can be completed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                      <p className="font-medium text-orange-700">
                        Payment Pending
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${order.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={handleMarkPaymentReceived}
                      className="w-full"
                    >
                      Mark Payment as Received
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() =>
                    (window.location.href = `/new-order?orderId=${params.id}`)
                  }
                >
                  Continue Order
                </Button>
                <Button variant="outline" className="w-full">
                  Edit Order Details
                </Button>
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full">
                  Send Update to Client
                </Button>
                {paymentReceived && order.currentStage === 6 && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleCompleteOrder}
                  >
                    Complete Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
