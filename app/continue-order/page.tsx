"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search, Play, Calendar, Building } from "lucide-react";

interface SavedOrder {
  orderNumber: string;
  currentStage: number;
  companyName?: string;
  lastSaved: string;
  formData: Record<string, any>;
}

const stageNames = [
  "Inquiry",
  "Requirements Analysis",
  "Proposal",
  "Development Planning",
  "Packaging & Dispatch",
  "Completion",
];

export default function ContinueOrderPage() {
  const router = useRouter();
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load saved orders from localStorage
    const orders: SavedOrder[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("order_")) {
        try {
          const orderData = JSON.parse(localStorage.getItem(key) || "{}");
          const companyName =
            orderData.formData?.stage1_companyName || "Unknown Company";
          orders.push({
            orderNumber: orderData.orderNumber,
            currentStage: orderData.currentStage,
            companyName,
            lastSaved: new Date().toISOString(), // In real app, this would be stored
            formData: orderData.formData,
          });
        } catch (error) {
          console.error("Error parsing saved order:", error);
        }
      }
    }
    setSavedOrders(orders);
  }, []);

  const filteredOrders = savedOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinueOrder = (orderNumber: string) => {
    // In a real app, you would get the order ID from the orderNumber
    // For this demo, we'll just use the orderNumber as the ID
    router.push(`/new-order?orderId=${orderNumber}`);
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
          </div>
          <h1 className="text-3xl font-bold mb-2">Continue Order</h1>
          <p className="text-muted-foreground">
            Select a previously started order to continue working on it
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Saved Orders</CardTitle>
            <CardDescription>
              Find your order by order number or company name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Saved Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Orders</CardTitle>
            <CardDescription>
              {filteredOrders.length} saved order(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {savedOrders.length === 0
                    ? "No saved orders found. Start a new order to see it here."
                    : "No orders match your search criteria."}
                </div>
                <Link href="/new-order">
                  <Button>Start New Order</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Saved</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.orderNumber}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{order.orderNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {order.companyName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              Stage {order.currentStage}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {stageNames[order.currentStage - 1]}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${(order.currentStage / 6) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((order.currentStage / 6) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(order.lastSaved).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleContinueOrder(order.orderNumber)
                            }
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex justify-center">
          <Link href="/new-order">
            <Button variant="outline">Start New Order Instead</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
