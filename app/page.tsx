"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileText, Calendar, Building } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  companyName: string
  currentStage: number
  status: "pending" | "completed" | "payment-pending"
  dateInitiated: string
  lastUpdated: string
  paymentReceived: boolean
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    companyName: "Acme Corp",
    currentStage: 7,
    status: "payment-pending",
    dateInitiated: "2024-01-15",
    lastUpdated: "2024-01-20",
    paymentReceived: false,
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    companyName: "TechStart Inc",
    currentStage: 4,
    status: "pending",
    dateInitiated: "2024-01-18",
    lastUpdated: "2024-01-19",
    paymentReceived: false,
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    companyName: "Global Solutions",
    currentStage: 9,
    status: "completed",
    dateInitiated: "2024-01-10",
    lastUpdated: "2024-01-22",
    paymentReceived: true,
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    companyName: "Innovation Labs",
    currentStage: 8,
    status: "payment-pending",
    dateInitiated: "2024-01-12",
    lastUpdated: "2024-01-21",
    paymentReceived: false,
  },
]

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

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [showAllOrders, setShowAllOrders] = useState(false)

  const pendingOrders = orders.filter((order) => order.status === "pending" || order.status === "payment-pending")

  const filteredOrders = showAllOrders
    ? orders
        .filter((order) => {
          const matchesSearch =
            order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesYear =
            selectedYear === "all" || new Date(order.dateInitiated).getFullYear().toString() === selectedYear
          return matchesSearch && matchesYear
        })
        .sort((a, b) => new Date(b.dateInitiated).getTime() - new Date(a.dateInitiated).getTime())
    : pendingOrders.slice(0, 5)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        )
      case "payment-pending":
        return <Badge variant="destructive">Payment Pending</Badge>
      case "pending":
        return <Badge variant="secondary">In Progress</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const years = Array.from(new Set(orders.map((order) => new Date(order.dateInitiated).getFullYear().toString())))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Management Dashboard</h1>
          <p className="text-muted-foreground">Manage your orders through all 9 stages of the process</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/new-order">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Start New Order
                </CardTitle>
                <CardDescription>Create a new order and begin the 9-stage process</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/continue-order">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Continue Order
                </CardTitle>
                <CardDescription>Resume work on a previously started order</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>{showAllOrders ? "All Orders" : "Recent Pending Orders"}</CardTitle>
                <CardDescription>
                  {showAllOrders
                    ? "Search and filter all orders by company and year"
                    : "Orders awaiting completion or payment"}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowAllOrders(!showAllOrders)}>
                {showAllOrders ? "Show Pending Only" : "Show All Orders"}
              </Button>
            </div>

            {showAllOrders && (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by company name or order number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Initiated</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {order.companyName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">Stage {order.currentStage}</span>
                            <span className="text-sm text-muted-foreground">{stageNames[order.currentStage - 1]}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(order.dateInitiated).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(order.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link href={`/new-order?orderId=${order.id}`}>
                            <Button variant="outline" size="sm">
                              Continue Order
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Payment Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter((o) => o.status === "payment-pending").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter((o) => o.status === "completed").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/previous-orders">
            <Button variant="outline">View All Previous Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
