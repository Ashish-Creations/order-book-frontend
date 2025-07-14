"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, Calendar, Building, Filter, Download } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  companyName: string
  currentStage: number
  status: "in-progress" | "payment-pending" | "completed"
  dateInitiated: string
  lastUpdated: string
  paymentReceived: boolean
  totalValue: number
}

const mockOrders: Order[] = [
  // Remove all mock orders - start with empty array
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

export default function PreviousOrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dateInitiated")

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

  const years = Array.from(new Set(orders.map((order) => {
    try {
      const date = new Date(order.dateInitiated);
      if (isNaN(date.getTime())) return new Date().getFullYear().toString();
      return date.getFullYear().toString();
    } catch (error) {
      return new Date().getFullYear().toString();
    }
  }))).sort((a, b) => b.localeCompare(a))

  const filteredAndSortedOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesYear =
        selectedYear === "all" || (() => {
          try {
            const date = new Date(order.dateInitiated);
            if (isNaN(date.getTime())) return false;
            return date.getFullYear().toString() === selectedYear;
          } catch (error) {
            return false;
          }
        })()
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
      return matchesSearch && matchesYear && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateInitiated":
          try {
            const dateA = new Date(a.dateInitiated);
            const dateB = new Date(b.dateInitiated);
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            return 0;
          }
        case "companyName":
          return a.companyName.localeCompare(b.companyName)
        case "orderNumber":
          return b.orderNumber.localeCompare(a.orderNumber)
        case "totalValue":
          return b.totalValue - a.totalValue
        default:
          return 0
      }
    })

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
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const totalValue = filteredAndSortedOrders.reduce((sum, order) => sum + order.totalValue, 0)
  const completedOrders = filteredAndSortedOrders.filter((order) => order.status === "completed")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
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
          <h1 className="text-3xl font-bold mb-2">Previous Orders</h1>
          <p className="text-muted-foreground">Search and filter all orders by company name, year, and status</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
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

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="payment-pending">Payment Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateInitiated">Date Initiated</SelectItem>
                  <SelectItem value="companyName">Company Name</SelectItem>
                  <SelectItem value="orderNumber">Order Number</SelectItem>
                  <SelectItem value="totalValue">Total Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAndSortedOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {filteredAndSortedOrders.length > 0
                  ? Math.round(totalValue / filteredAndSortedOrders.length).toLocaleString()
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>{filteredAndSortedOrders.length} order(s) found</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Initiated</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedOrders.map((order) => (
                      <TableRow key={order.id}>
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
                            <span className="font-medium">Stage {order.currentStage}</span>
                            <span className="text-sm text-muted-foreground">{stageNames[order.currentStage - 1]}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(order.dateInitiated)}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order.lastUpdated)}</TableCell>
                        <TableCell className="font-medium">${order.totalValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Link href={`/order/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
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
      </div>
    </div>
  )
}
