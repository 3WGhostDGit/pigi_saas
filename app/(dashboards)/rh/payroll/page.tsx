'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { toast } from "sonner"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  PlusCircle,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  FileUp
} from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type PayrollEntry } from "./columns"
import { ViewPayrollDialog } from "./components/view-payroll-dialog"

// Types for payroll data
type SalaryHistory = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  effectiveDate: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    jobTitle: string;
    department?: {
      id: string;
      name: string;
    };
  };
}

// Transform salary history to payroll entry
const transformToPayrollEntry = (salaryHistory: SalaryHistory): PayrollEntry => {
  // Calculate mock values for bonus, deductions, and net pay
  const bonus = Math.round(salaryHistory.amount * 0.05);
  const deductions = Math.round(salaryHistory.amount * 0.2);
  const netPay = salaryHistory.amount + bonus - deductions;

  return {
    id: salaryHistory.id,
    userId: salaryHistory.userId,
    employee: salaryHistory.user.name,
    email: salaryHistory.user.email,
    department: salaryHistory.user.department?.name || 'N/A',
    position: salaryHistory.user.jobTitle || 'N/A',
    salary: salaryHistory.amount,
    bonus: bonus,
    deductions: deductions,
    netPay: netPay,
    effectiveDate: salaryHistory.effectiveDate,
    paymentDate: salaryHistory.effectiveDate,
    status: Math.random() > 0.3 ? "PAID" : "PENDING", // Random status for demo
    currency: salaryHistory.currency,
    reason: salaryHistory.reason
  }
}

export default function PayrollPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddPayrollOpen, setIsAddPayrollOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null)
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<any[]>([])

  // Fetch salary history data
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/rh/payroll')

        if (!response.ok) {
          throw new Error('Failed to fetch payroll data')
        }

        const data = await response.json()
        const transformedData = data.map(transformToPayrollEntry)
        setPayrollData(transformedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching payroll data:', err)
        setError(err.message)
        toast.error("Failed to load payroll data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchPayrollData()
    }
  }, [session])

  // Fetch employees for the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/rh/employees')

        if (!response.ok) {
          throw new Error('Failed to fetch employees')
        }

        const data = await response.json()
        // Debug the response data
        console.log('Employees API response:', data)

        // The API returns an object with an employees property, not an array directly
        if (data && data.employees && Array.isArray(data.employees)) {
          console.log('Setting employees array:', data.employees)
          setEmployees(data.employees)
        } else {
          console.error('Unexpected employees data format:', data)
          toast.error("Unexpected data format from employees API.")
        }
      } catch (err) {
        console.error('Error fetching employees:', err)
        toast.error("Failed to load employee data.")
      }
    }

    if (session) {
      fetchEmployees()
    }
  }, [session])

  // Form state for new payroll entry
  const [newPayrollData, setNewPayrollData] = useState({
    userId: '',
    amount: '',
    currency: 'EUR',
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: ''
  })

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setNewPayrollData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!newPayrollData.userId || !newPayrollData.amount || !newPayrollData.effectiveDate) {
        toast.error("Please fill in all required fields.")
        return
      }

      const response = await fetch('/api/rh/payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: newPayrollData.userId,
          amount: parseFloat(newPayrollData.amount),
          currency: newPayrollData.currency,
          effectiveDate: newPayrollData.effectiveDate,
          reason: newPayrollData.reason
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payroll entry')
      }

      const data = await response.json()

      // Add the new entry to the list
      const newEntry = transformToPayrollEntry(data)
      setPayrollData(prev => [newEntry, ...prev])

      // Reset form and close dialog
      setNewPayrollData({
        userId: '',
        amount: '',
        currency: 'EUR',
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: ''
      })
      setIsAddPayrollOpen(false)

      toast.success("Payroll entry created successfully.")
    } catch (err) {
      console.error('Error creating payroll entry:', err)
      toast.error("Failed to create payroll entry. Please try again.")
    }
  }

  // Filter payroll data based on search term
  const filteredPayroll = payrollData.filter(item =>
    item.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle view details
  const handleViewDetails = (payroll: PayrollEntry) => {
    setSelectedPayroll(payroll)
    setIsViewDetailsOpen(true)
  }

  // Handle download payslip
  const handleDownloadPayslip = (entry: PayrollEntry) => {
    toast.info(`Downloading payslip for ${entry.employee}...`)
    // In a real app, this would trigger a download of the payslip
  }

  // Setup event listeners for custom events from the data table
  useEffect(() => {
    const handleViewPayrollEntry = (event: CustomEvent<PayrollEntry>) => {
      setSelectedPayroll(event.detail)
      setIsViewDetailsOpen(true)
    }

    const handleDownloadPayslip = (event: CustomEvent<PayrollEntry>) => {
      toast.info(`Downloading payslip for ${event.detail.employee}...`)
    }

    window.addEventListener('view-payroll-entry', handleViewPayrollEntry as EventListener)
    window.addEventListener('download-payslip', handleDownloadPayslip as EventListener)

    return () => {
      window.removeEventListener('view-payroll-entry', handleViewPayrollEntry as EventListener)
      window.removeEventListener('download-payslip', handleDownloadPayslip as EventListener)
    }
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payroll Management</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddPayrollOpen} onOpenChange={setIsAddPayrollOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                New Payroll Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Payroll Entry</DialogTitle>
                <DialogDescription>
                  Fill in the payroll details. Click submit when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userId">Employee</Label>
                    <select
                      id="userId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPayrollData.userId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.jobTitle || 'No position'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="effectiveDate">Payment Date</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={newPayrollData.effectiveDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Salary Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newPayrollData.amount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPayrollData.currency}
                      onChange={handleInputChange}
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    placeholder="Reason for salary change"
                    value={newPayrollData.reason}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPayrollOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search payroll..."
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
            <CardHeader>
              <CardTitle>All Payroll Entries</CardTitle>
              <CardDescription>
                View and manage all payroll entries for employees.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !payrollData.length ? (
                <div className="p-8 flex flex-col space-y-4">
                  <div className="space-y-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 py-2">
                        {Array(6).fill(0).map((_, j) => (
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
              ) : payrollData.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No payroll entries found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredPayroll}
                  filterColumn="employee"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payroll Entries</CardTitle>
              <CardDescription>
                View and manage pending payroll entries that need to be processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !payrollData.length ? (
                <div className="p-8 flex flex-col space-y-4">
                  <div className="space-y-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 py-2">
                        {Array(6).fill(0).map((_, j) => (
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
              ) : filteredPayroll.filter(payroll => payroll.status === 'PENDING').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No pending payroll entries found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredPayroll.filter(payroll => payroll.status === 'PENDING')}
                  filterColumn="employee"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paid Payroll Entries</CardTitle>
              <CardDescription>
                View all processed and paid payroll entries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !payrollData.length ? (
                <div className="p-8 flex flex-col space-y-4">
                  <div className="space-y-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 py-2">
                        {Array(6).fill(0).map((_, j) => (
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
              ) : filteredPayroll.filter(payroll => payroll.status === 'PAID').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No paid payroll entries found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredPayroll.filter(payroll => payroll.status === 'PAID')}
                  filterColumn="employee"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Payroll Dialog */}
      <ViewPayrollDialog
        open={isViewDetailsOpen}
        onOpenChange={setIsViewDetailsOpen}
        entry={selectedPayroll}
        onDownloadPayslip={handleDownloadPayslip}
      />
    </div>
  )
}
