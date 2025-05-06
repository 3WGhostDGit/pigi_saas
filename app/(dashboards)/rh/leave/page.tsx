'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Calendar,
  Filter
} from "lucide-react"

// Define the form schema for leave requests
const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required"),
})

// Define types for API responses
type LeaveType = {
  id: string;
  name: string;
  description?: string;
}

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: {
    id: string;
    name: string;
  };
}

type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  approvedById?: string;
  approvedAt?: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: {
      id: string;
      name: string;
    };
  };
  leaveType: {
    id: string;
    name: string;
    description?: string;
  };
  approvedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function LeavePage() {
  const { status } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [currentTab, setCurrentTab] = useState('all')

  // State for API data
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form for adding new leave requests
  const form = useForm({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  })

  // Fetch leave requests from API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (status !== 'authenticated') return

      try {
        setIsLoading(true)
        const response = await fetch('/api/rh/leave')

        if (!response.ok) {
          throw new Error('Failed to fetch leave requests')
        }

        const data = await response.json()
        setLeaveRequests(data.leaveRequests || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching leave requests:', err)
        setError('Failed to load leave request data. Please try again.')
        toast.error("Failed to load leave request data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaveRequests()
  }, [status])

  // Fetch leave types from API
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      if (status !== 'authenticated') return

      try {
        const response = await fetch('/api/rh/leave-types')

        if (!response.ok) {
          throw new Error('Failed to fetch leave types')
        }

        const data = await response.json()
        setLeaveTypes(data || [])
      } catch (err) {
        console.error('Error fetching leave types:', err)
        toast.error("Failed to load leave types. Please try again.")
      }
    }

    fetchLeaveTypes()
  }, [status])

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      if (status !== 'authenticated') return

      try {
        const response = await fetch('/api/rh/employees')

        if (!response.ok) {
          throw new Error('Failed to fetch employees')
        }

        const data = await response.json()
        setEmployees(data.employees || [])
      } catch (err) {
        console.error('Error fetching employees:', err)
        toast.error("Failed to load employee data. Please try again.")
      }
    }

    fetchEmployees()
  }, [status])

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof leaveRequestSchema>) => {
    try {
      const response = await fetch('/api/rh/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create leave request')
      }

      toast.success("Leave request submitted successfully")
      setIsAddLeaveOpen(false)
      form.reset()

      // Refresh leave requests
      const refreshResponse = await fetch('/api/rh/leave')
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setLeaveRequests(refreshData.leaveRequests || [])
      }
    } catch (err: any) {
      console.error('Error creating leave request:', err)
      toast.error(err.message || "Failed to submit leave request. Please try again.")
    }
  }

  // Handle approve/reject leave request
  const handleLeaveAction = async (leaveId: string, status: 'APPROVED' | 'REJECTED', comments?: string) => {
    try {
      const response = await fetch(`/api/rh/leave/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          comments,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${status.toLowerCase()} leave request`)
      }

      toast.success(`Leave request ${status.toLowerCase()} successfully`)
      setIsViewDetailsOpen(false)

      // Refresh leave requests
      const refreshResponse = await fetch('/api/rh/leave')
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setLeaveRequests(refreshData.leaveRequests || [])
      }
    } catch (err: any) {
      console.error(`Error ${status.toLowerCase()}ing leave request:`, err)
      toast.error(err.message || `Failed to ${status.toLowerCase()} leave request. Please try again.`)
    }
  }

  // Filter leave requests based on search term and current tab
  const filteredLeaveRequests = leaveRequests.filter(request => {
    // Filter by search term
    const matchesSearch =
      `${request.employee.firstName} ${request.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by tab
    const matchesTab =
      currentTab === 'all' ||
      (currentTab === 'pending' && request.status === 'PENDING') ||
      (currentTab === 'approved' && request.status === 'APPROVED') ||
      (currentTab === 'rejected' && request.status === 'REJECTED')

    return matchesSearch && matchesTab
  })

  const handleViewDetails = (leaveRequest: LeaveRequest) => {
    setSelectedLeave(leaveRequest)
    setIsViewDetailsOpen(true)
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                New Leave Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Leave Request</DialogTitle>
                <DialogDescription>
                  Fill in the leave request details. Click submit when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {employees.map((employee) => (
                                  <SelectItem key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="leaveTypeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Leave Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select leave type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {leaveTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Reason for leave request" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddLeaveOpen(false)} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leave requests..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-8 gap-4">
                      {Array(8).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-8 gap-4 py-2">
                        {Array(8).fill(0).map((_, j) => (
                          <Skeleton key={j} className="h-6 w-full" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-24 text-destructive">
                  <p>{error}</p>
                </div>
              ) : filteredLeaveRequests.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No leave requests found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.employee.firstName} {request.employee.lastName}
                        </TableCell>
                        <TableCell>{request.leaveType.name}</TableCell>
                        <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{request.duration} days</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                View Details
                              </DropdownMenuItem>
                              {request.status === 'PENDING' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => handleLeaveAction(request.id, 'APPROVED')}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleLeaveAction(request.id, 'REJECTED')}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {/* Similar content as "all" but filtered for pending requests */}
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          {/* Similar content as "all" but filtered for approved requests */}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          {/* Similar content as "all" but filtered for rejected requests */}
        </TabsContent>
      </Tabs>

      {/* Leave Request Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Employee</h3>
                  <p>{selectedLeave.employee.firstName} {selectedLeave.employee.lastName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Leave Type</h3>
                  <p>{selectedLeave.leaveType.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Start Date</h3>
                  <p>{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">End Date</h3>
                  <p>{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Duration</h3>
                  <p>{selectedLeave.duration} days</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Reason</h3>
                <p>{selectedLeave.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(selectedLeave.status)}`}>
                    {selectedLeave.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Submitted On</h3>
                  <p>{new Date(selectedLeave.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedLeave.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm">Approved/Rejected By</h3>
                    <p>{selectedLeave.approvedBy.firstName} {selectedLeave.approvedBy.lastName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Decision Date</h3>
                    <p>{new Date(selectedLeave.approvedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
            {selectedLeave && selectedLeave.status === 'PENDING' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleLeaveAction(selectedLeave.id, 'REJECTED')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleLeaveAction(selectedLeave.id, 'APPROVED')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
