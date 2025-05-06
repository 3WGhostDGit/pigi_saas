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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  PlusCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download
} from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, LeaveRequest, getStatusBadgeClass } from "./columns"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LeaveFilterDialog, LeaveFilters } from "@/components/rh/LeaveFilterDialog"
import Link from "next/link"

// Define the form schema for leave requests
const leaveRequestSchema = z.object({
  userId: z.string().min(1, "Employee is required"),
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

// Import the LeaveRequest type from columns.tsx

export default function LeavePage() {
  const { status } = useSession()
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
  const [activeFilters, setActiveFilters] = useState<LeaveFilters>({})
  const [isFilterApplied, setIsFilterApplied] = useState(false)

  // Form for adding new leave requests
  const form = useForm({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      userId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  })

  // Get employeeId from URL if present
  const getEmployeeIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('employeeId') || undefined;
    }
    return undefined;
  }

  // Fetch leave requests from API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (status !== 'authenticated') return

      try {
        setIsLoading(true)
        const employeeId = getEmployeeIdFromUrl();
        const url = employeeId
          ? `/api/rh/leave?employeeId=${employeeId}`
          : '/api/rh/leave';

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch leave requests')
        }

        const data = await response.json()
        setLeaveRequests(data.leaveRequests || [])
        setError(null)

        // If filtering by employee, set the tab to 'all' to show all their requests
        if (employeeId) {
          setCurrentTab('all');
        }
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
      const employeeId = getEmployeeIdFromUrl();
      const refreshUrl = employeeId
        ? `/api/rh/leave?employeeId=${employeeId}`
        : '/api/rh/leave';

      const refreshResponse = await fetch(refreshUrl)
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
      const employeeId = getEmployeeIdFromUrl();
      const refreshUrl = employeeId
        ? `/api/rh/leave?employeeId=${employeeId}`
        : '/api/rh/leave';

      const refreshResponse = await fetch(refreshUrl)
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setLeaveRequests(refreshData.leaveRequests || [])
      }
    } catch (err: any) {
      console.error(`Error ${status.toLowerCase()}ing leave request:`, err)
      toast.error(err.message || `Failed to ${status.toLowerCase()} leave request. Please try again.`)
    }
  }

  // Apply filters to leave requests
  const handleApplyFilters = (filters: LeaveFilters) => {
    setActiveFilters(filters);
    setIsFilterApplied(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setActiveFilters({});
    setIsFilterApplied(false);
  };

  // Filter leave requests based on tab and active filters
  const getFilteredLeaveRequests = (tab: string) => {
    return leaveRequests.filter(request => {
      // First filter by tab
      const matchesTab = tab === 'all' ||
        (tab === 'pending' && request.status === 'PENDING') ||
        (tab === 'approved' && request.status === 'APPROVED') ||
        (tab === 'rejected' && request.status === 'REJECTED');

      if (!matchesTab) return false;

      // Then apply additional filters if they exist
      if (!isFilterApplied) return true;

      // Filter by department
      if (activeFilters.departmentId && request.user.department?.id !== activeFilters.departmentId) {
        return false;
      }

      // Filter by employee
      if (activeFilters.employeeId && request.userId !== activeFilters.employeeId) {
        return false;
      }

      // Filter by leave type
      if (activeFilters.leaveTypeId && request.leaveTypeId !== activeFilters.leaveTypeId) {
        return false;
      }

      // Filter by date range
      if (activeFilters.startDateFrom) {
        const fromDate = new Date(activeFilters.startDateFrom);
        const requestDate = new Date(request.startDate);
        if (requestDate < fromDate) return false;
      }

      if (activeFilters.startDateTo) {
        const toDate = new Date(activeFilters.startDateTo);
        const requestDate = new Date(request.startDate);
        if (requestDate > toDate) return false;
      }

      // Filter by status (if not already filtered by tab)
      if (activeFilters.status && activeFilters.status !== 'all' && request.status !== activeFilters.status) {
        return false;
      }

      return true;
    });
  };

  const filteredLeaveRequests = getFilteredLeaveRequests(currentTab);

  const handleViewDetails = (leaveRequest: LeaveRequest) => {
    setSelectedLeave(leaveRequest)
    setIsViewDetailsOpen(true)
  }

  // Status badge class is now handled in columns.tsx

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
                        name="userId"
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
      <Tabs
        defaultValue="all"
        className="space-y-4"
        onValueChange={(value) => setCurrentTab(value)}
      >
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <LeaveFilterDialog
                onFilter={handleApplyFilters}
                onReset={handleResetFilters}
              />
              {isFilterApplied && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Leave Requests</CardTitle>
              <CardDescription>
                View and manage all leave requests from employees.
              </CardDescription>
            </CardHeader>
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
                <DataTable
                  columns={columns(
                    handleViewDetails,
                    (id) => handleLeaveAction(id, 'APPROVED'),
                    (id) => handleLeaveAction(id, 'REJECTED')
                  )}
                  data={filteredLeaveRequests}
                  filterColumn="employee"
                  filterPlaceholder="Search by employee name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>
                Review and process pending leave requests from employees.
              </CardDescription>
            </CardHeader>
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
              ) : getFilteredLeaveRequests('pending').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No pending leave requests found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns(
                    handleViewDetails,
                    (id) => handleLeaveAction(id, 'APPROVED'),
                    (id) => handleLeaveAction(id, 'REJECTED')
                  )}
                  data={getFilteredLeaveRequests('pending')}
                  filterColumn="employee"
                  filterPlaceholder="Search by employee name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Leave Requests</CardTitle>
              <CardDescription>
                View all approved leave requests from employees.
              </CardDescription>
            </CardHeader>
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
              ) : getFilteredLeaveRequests('approved').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No approved leave requests found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns(
                    handleViewDetails,
                    (id) => handleLeaveAction(id, 'APPROVED'),
                    (id) => handleLeaveAction(id, 'REJECTED')
                  )}
                  data={getFilteredLeaveRequests('approved')}
                  filterColumn="employee"
                  filterPlaceholder="Search by employee name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Leave Requests</CardTitle>
              <CardDescription>
                View all rejected leave requests from employees.
              </CardDescription>
            </CardHeader>
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
              ) : getFilteredLeaveRequests('rejected').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No rejected leave requests found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns(
                    handleViewDetails,
                    (id) => handleLeaveAction(id, 'APPROVED'),
                    (id) => handleLeaveAction(id, 'REJECTED')
                  )}
                  data={getFilteredLeaveRequests('rejected')}
                  filterColumn="employee"
                  filterPlaceholder="Search by employee name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Leave Request Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Viewing details for leave request.
            </DialogDescription>
            <div className="mt-2 text-right">
              {selectedLeave && (
                <Link
                  href={`/rh/leave/view/${selectedLeave.id}`}
                  className="text-sm text-primary hover:underline"
                  onClick={() => setIsViewDetailsOpen(false)}
                >
                  Open in full page
                </Link>
              )}
            </div>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Employee</p>
                  <p className="text-sm font-semibold">
                    {selectedLeave.user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Leave Type</p>
                  <p className="text-sm">
                    {selectedLeave.leaveType.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Start Date</p>
                  <p className="text-sm">
                    {new Date(selectedLeave.startDate).toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">End Date</p>
                  <p className="text-sm">
                    {new Date(selectedLeave.endDate).toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Duration</p>
                  <p className="text-sm">
                    {Math.ceil((new Date(selectedLeave.endDate).getTime() - new Date(selectedLeave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <p className="text-sm">
                    <Badge
                      variant={selectedLeave.status === 'APPROVED' ? 'default' :
                              selectedLeave.status === 'REJECTED' ? 'destructive' : 'outline'}
                      className={selectedLeave.status === 'PENDING' ?
                                'text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600' :
                                selectedLeave.status === 'APPROVED' ?
                                'text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600' : ''}
                    >
                      {selectedLeave.status.toLowerCase()}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Submitted On</p>
                  <p className="text-sm">
                    {new Date(selectedLeave.createdAt).toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Reason for Leave</p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {selectedLeave.reason || 'No reason provided'}
                </div>
              </div>

              {selectedLeave.approver && selectedLeave.approvedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Approved/Rejected By</p>
                    <p className="text-sm">{selectedLeave.approver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Decision Date</p>
                    <p className="text-sm">
                      {new Date(selectedLeave.approvedAt).toLocaleDateString('fr-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {selectedLeave && selectedLeave.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-red-200 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleLeaveAction(selectedLeave.id, 'REJECTED')}
                >
                  <XCircle className="mr-2 h-4 w-4 text-red-600" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 hover:bg-green-100 hover:text-green-600"
                  onClick={() => handleLeaveAction(selectedLeave.id, 'APPROVED')}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
