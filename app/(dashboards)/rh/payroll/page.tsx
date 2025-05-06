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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Download,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  CreditCard
} from "lucide-react"

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
const transformToPayrollEntry = (salaryHistory: SalaryHistory) => {
  // Calculate mock values for bonus, deductions, and net pay
  const bonus = Math.round(salaryHistory.amount * 0.05);
  const deductions = Math.round(salaryHistory.amount * 0.2);
  const netPay = salaryHistory.amount + bonus - deductions;

  return {
    id: salaryHistory.id,
    employee: salaryHistory.user.name,
    employeeId: salaryHistory.userId,
    department: salaryHistory.user.department?.name || 'N/A',
    position: salaryHistory.user.jobTitle || 'N/A',
    salary: salaryHistory.amount,
    bonus: bonus,
    deductions: deductions,
    netPay: netPay,
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
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [payrollData, setPayrollData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [employees, setEmployees] = useState([])

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
        setEmployees(data)
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
    item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll)
    setIsViewDetailsOpen(true)
  }

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
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-24 text-destructive">
                  <p>Error loading payroll data. Please try again.</p>
                </div>
              ) : filteredPayroll.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No payroll entries found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll.map((payroll) => (
                      <TableRow key={payroll.id}>
                        <TableCell className="font-medium">{payroll.employee}</TableCell>
                        <TableCell>{payroll.department}</TableCell>
                        <TableCell>{payroll.position}</TableCell>
                        <TableCell className="text-right">
                          {payroll.currency === 'EUR' ? '€' :
                           payroll.currency === 'USD' ? '$' :
                           payroll.currency === 'GBP' ? '£' :
                           payroll.currency === 'JPY' ? '¥' : ''}
                          {payroll.salary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {payroll.currency === 'EUR' ? '€' :
                           payroll.currency === 'USD' ? '$' :
                           payroll.currency === 'GBP' ? '£' :
                           payroll.currency === 'JPY' ? '¥' : ''}
                          {payroll.netPay.toLocaleString()}
                        </TableCell>
                        <TableCell>{new Date(payroll.paymentDate).toLocaleDateString('en-US')}</TableCell>
                        <TableCell>
                          <Badge variant={payroll.status === 'PAID' ? 'default' : 'outline'}>
                            {payroll.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(payroll)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Process Payment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-24 text-destructive">
                  <p>Error loading payroll data. Please try again.</p>
                </div>
              ) : filteredPayroll.filter(payroll => payroll.status === 'PENDING').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No pending payroll entries found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll
                      .filter(payroll => payroll.status === 'PENDING')
                      .map((payroll) => (
                        <TableRow key={payroll.id}>
                          <TableCell className="font-medium">{payroll.employee}</TableCell>
                          <TableCell>{payroll.department}</TableCell>
                          <TableCell>{payroll.position}</TableCell>
                          <TableCell className="text-right">
                            {payroll.currency === 'EUR' ? '€' :
                             payroll.currency === 'USD' ? '$' :
                             payroll.currency === 'GBP' ? '£' :
                             payroll.currency === 'JPY' ? '¥' : ''}
                            {payroll.salary.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {payroll.currency === 'EUR' ? '€' :
                             payroll.currency === 'USD' ? '$' :
                             payroll.currency === 'GBP' ? '£' :
                             payroll.currency === 'JPY' ? '¥' : ''}
                            {payroll.netPay.toLocaleString()}
                          </TableCell>
                          <TableCell>{new Date(payroll.paymentDate).toLocaleDateString('en-US')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {payroll.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(payroll)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Process Payment
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
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
        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-24 text-destructive">
                  <p>Error loading payroll data. Please try again.</p>
                </div>
              ) : filteredPayroll.filter(payroll => payroll.status === 'PAID').length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No paid payroll entries found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll
                      .filter(payroll => payroll.status === 'PAID')
                      .map((payroll) => (
                        <TableRow key={payroll.id}>
                          <TableCell className="font-medium">{payroll.employee}</TableCell>
                          <TableCell>{payroll.department}</TableCell>
                          <TableCell>{payroll.position}</TableCell>
                          <TableCell className="text-right">
                            {payroll.currency === 'EUR' ? '€' :
                             payroll.currency === 'USD' ? '$' :
                             payroll.currency === 'GBP' ? '£' :
                             payroll.currency === 'JPY' ? '¥' : ''}
                            {payroll.salary.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {payroll.currency === 'EUR' ? '€' :
                             payroll.currency === 'USD' ? '$' :
                             payroll.currency === 'GBP' ? '£' :
                             payroll.currency === 'JPY' ? '¥' : ''}
                            {payroll.netPay.toLocaleString()}
                          </TableCell>
                          <TableCell>{new Date(payroll.paymentDate).toLocaleDateString('en-US')}</TableCell>
                          <TableCell>
                            <Badge>
                              {payroll.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(payroll)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Slip
                                </DropdownMenuItem>
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
      </Tabs>

      {/* Payroll Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Employee</h3>
                  <p>{selectedPayroll.employee}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Employee ID</h3>
                  <p>{selectedPayroll.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Department</h3>
                  <p>{selectedPayroll.department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Position</h3>
                  <p>{selectedPayroll.position}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Base Salary</h3>
                  <p>
                    {selectedPayroll.currency === 'EUR' ? '€' :
                     selectedPayroll.currency === 'USD' ? '$' :
                     selectedPayroll.currency === 'GBP' ? '£' :
                     selectedPayroll.currency === 'JPY' ? '¥' : ''}
                    {selectedPayroll.salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Bonus</h3>
                  <p>
                    {selectedPayroll.currency === 'EUR' ? '€' :
                     selectedPayroll.currency === 'USD' ? '$' :
                     selectedPayroll.currency === 'GBP' ? '£' :
                     selectedPayroll.currency === 'JPY' ? '¥' : ''}
                    {selectedPayroll.bonus.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Deductions</h3>
                  <p>
                    {selectedPayroll.currency === 'EUR' ? '€' :
                     selectedPayroll.currency === 'USD' ? '$' :
                     selectedPayroll.currency === 'GBP' ? '£' :
                     selectedPayroll.currency === 'JPY' ? '¥' : ''}
                    {selectedPayroll.deductions.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Net Pay</h3>
                  <p className="text-xl font-bold">
                    {selectedPayroll.currency === 'EUR' ? '€' :
                     selectedPayroll.currency === 'USD' ? '$' :
                     selectedPayroll.currency === 'GBP' ? '£' :
                     selectedPayroll.currency === 'JPY' ? '¥' : ''}
                    {selectedPayroll.netPay.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Payment Date</h3>
                  <p>{new Date(selectedPayroll.paymentDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  <Badge variant={selectedPayroll.status === 'PAID' ? 'default' : 'outline'}>
                    {selectedPayroll.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {selectedPayroll && selectedPayroll.status === 'PAID' && (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Slip
              </Button>
            )}
            {selectedPayroll && selectedPayroll.status === 'PENDING' && (
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
