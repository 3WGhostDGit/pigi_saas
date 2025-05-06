'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { columns, Employee } from "./columns"
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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Download,
  Filter,
  User,
  FileText,
  FileSpreadsheet
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

// Define the Employee type based on the API response
type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    title: string;
  };
  status: string;
  hireDate: string;
  phone?: string;
  address?: string;
}

// Define types for departments and positions
type Department = {
  id: string;
  name: string;
  description?: string;
}

type Position = {
  id: string;
  title: string;
  departmentId?: string;
}

// Define the form schema for adding a new employee
const employeeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  positionId: z.string().min(1, "Position is required"),
  status: z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE"]).default("ACTIVE"),
  hireDate: z.string().min(1, "Hire date is required"),
})

// Infer the type from the schema
type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export default function EmployeesPage() {
  const { status } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState('all')

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [positionFilter, setPositionFilter] = useState<string>('all')
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    from: string | null,
    to: string | null
  }>({ from: null, to: null })

  // Initialize the add employee form
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      positionId: "",
      status: "ACTIVE",
      hireDate: new Date().toISOString().split('T')[0],
    },
  })

  // Initialize the edit employee form
  const editForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      positionId: "",
      status: "ACTIVE",
      hireDate: new Date().toISOString().split('T')[0],
    },
  })

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      if (status !== 'authenticated') return

      try {
        setIsLoading(true)
        const response = await fetch('/api/rh/employees')

        if (!response.ok) {
          throw new Error('Failed to fetch employees')
        }

        const data = await response.json()
        setEmployees(data.employees || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching employees:', err)
        setError('Failed to load employee data. Please try again.')
        toast.error("Failed to load employee data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [status])

  // Set up event listeners for table actions
  useEffect(() => {
    // Handle view profile event
    const handleViewProfile = (event: CustomEvent<Employee>) => {
      setSelectedEmployee(event.detail)
      setIsViewProfileOpen(true)
    }

    // Handle edit employee event
    const handleEditEmployee = (event: CustomEvent<Employee>) => {
      const employee = event.detail
      setSelectedEmployee(employee)

      // Make sure departments and positions are loaded
      if (departments.length === 0 || positions.length === 0) {
        fetchDepartmentsAndPositions()
      }

      // Set form values
      editForm.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone || '',
        departmentId: employee.department.id || '',
        positionId: employee.position.id || '',
        status: employee.status as "ACTIVE" | "ON_LEAVE" | "INACTIVE",
        hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
      })

      setIsEditEmployeeOpen(true)
    }

    // Handle delete employee event
    const handleDeleteEmployee = (event: CustomEvent<Employee>) => {
      setSelectedEmployee(event.detail)
      setIsDeleteConfirmOpen(true)
    }

    // Add event listeners
    window.addEventListener('view-employee-profile', handleViewProfile as EventListener)
    window.addEventListener('edit-employee', handleEditEmployee as EventListener)
    window.addEventListener('delete-employee', handleDeleteEmployee as EventListener)

    // Clean up event listeners
    return () => {
      window.removeEventListener('view-employee-profile', handleViewProfile as EventListener)
      window.removeEventListener('edit-employee', handleEditEmployee as EventListener)
      window.removeEventListener('delete-employee', handleDeleteEmployee as EventListener)
    }
  }, [departments, positions, editForm])

  // Fetch departments and positions for the form
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDepartmentsAndPositions()
    }
  }, [status])

  // Handle add employee form submission
  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true)

      // Find the position title for the selected position ID
      const selectedPosition = positions.find(p => p.id === data.positionId);
      const positionTitle = selectedPosition ? selectedPosition.title : '';

      const response = await fetch('/api/rh/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          positionTitle
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create employee')
      }

      // Success - close the dialog and refresh the employee list
      toast.success("Employee added successfully")
      setIsAddEmployeeOpen(false)
      form.reset()

      // Refresh the employee list
      refreshEmployeeList()
    } catch (err: any) {
      console.error('Error creating employee:', err)
      toast.error(err.message || "Failed to create employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit employee form submission
  const onEditSubmit = async (data: EmployeeFormValues) => {
    if (!selectedEmployee) return

    try {
      setIsSubmitting(true)

      // Find the position title for the selected position ID
      const selectedPosition = positions.find(p => p.id === data.positionId);
      const positionTitle = selectedPosition ? selectedPosition.title : '';

      const response = await fetch(`/api/rh/employees/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          positionTitle
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update employee')
      }

      // Success - close the dialog and refresh the employee list
      toast.success("Employee updated successfully")
      setIsEditEmployeeOpen(false)
      editForm.reset()
      setSelectedEmployee(null)

      // Refresh the employee list
      refreshEmployeeList()
    } catch (err: any) {
      console.error('Error updating employee:', err)
      toast.error(err.message || "Failed to update employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete employee
  const onDeleteEmployee = async () => {
    if (!selectedEmployee) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/rh/employees/${selectedEmployee.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete employee')
      }

      // Success - close the dialog and refresh the employee list
      toast.success("Employee deleted successfully")
      setIsDeleteConfirmOpen(false)
      setSelectedEmployee(null)

      // Refresh the employee list
      refreshEmployeeList()
    } catch (err: any) {
      console.error('Error deleting employee:', err)
      toast.error(err.message || "Failed to delete employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to refresh the employee list
  const refreshEmployeeList = async () => {
    try {
      const refreshResponse = await fetch('/api/rh/employees')
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setEmployees(refreshData.employees || [])
      }
    } catch (err) {
      console.error('Error refreshing employee list:', err)
    }
  }

  // Handle opening the edit dialog
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)

    // Make sure departments and positions are loaded
    if (departments.length === 0 || positions.length === 0) {
      fetchDepartmentsAndPositions()
    }

    // Set form values
    editForm.reset({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      departmentId: employee.department.id || '',
      positionId: employee.position.id || '',
      status: employee.status as "ACTIVE" | "ON_LEAVE" | "INACTIVE",
      hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
    })

    setIsEditEmployeeOpen(true)
  }

  // Helper function to fetch departments and positions
  const fetchDepartmentsAndPositions = async () => {
    if (status !== 'authenticated') return

    try {
      // Fetch departments
      const deptResponse = await fetch('/api/rh/departments')
      if (!deptResponse.ok) {
        throw new Error('Failed to fetch departments')
      }
      const deptData = await deptResponse.json()
      console.log('Departments data:', deptData)

      // Check if deptData is an array or has a departments property
      if (Array.isArray(deptData)) {
        setDepartments(deptData)
      } else if (deptData.departments) {
        setDepartments(deptData.departments)
      } else {
        console.error('Unexpected departments data format:', deptData)
        setDepartments([])
      }

      // Fetch positions
      const posResponse = await fetch('/api/rh/positions')
      if (!posResponse.ok) {
        throw new Error('Failed to fetch positions')
      }
      const posData = await posResponse.json()
      console.log('Positions data:', posData)

      // Check if posData is an array or has a positions property
      if (Array.isArray(posData)) {
        setPositions(posData)
      } else if (posData.positions) {
        setPositions(posData.positions)
      } else {
        console.error('Unexpected positions data format:', posData)
        setPositions([])
      }
    } catch (err) {
      console.error('Error fetching form data:', err)
      toast.error("Failed to load form data. Please try again.")
    }
  }

  // Handle opening the delete confirmation dialog
  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteConfirmOpen(true)
  }

  // Handle opening the view profile dialog
  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewProfileOpen(true)
  }

  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Status', 'Hire Date']
    const csvRows = [headers]

    filteredEmployees.forEach(employee => {
      const row = [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone || '',
        employee.department.name,
        employee.position.title,
        employee.status === 'ACTIVE' ? 'Active' : employee.status === 'ON_LEAVE' ? 'On Leave' : 'Inactive',
        new Date(employee.hireDate).toLocaleDateString('fr-FR')
      ]
      csvRows.push(row)
    })

    // Convert to CSV string
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `employees_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Employees exported to CSV successfully')
  }

  // Export to PDF
  const exportToPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    // For now, we'll just show a toast message
    toast.success('PDF export functionality will be implemented soon')
  }

  // Export to Excel (XLS)
  const exportToXLS = () => {
    // Create Excel content in XML format
    let xlsContent = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'
    xlsContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '
    xlsContent += 'xmlns:o="urn:schemas-microsoft-com:office:office" '
    xlsContent += 'xmlns:x="urn:schemas-microsoft-com:office:excel" '
    xlsContent += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" '
    xlsContent += 'xmlns:html="http://www.w3.org/TR/REC-html40">'

    // Add styles
    xlsContent += '<Styles>'
    xlsContent += '<Style ss:ID="Header"><Font ss:Bold="1"/></Style>'
    xlsContent += '</Styles>'

    // Create worksheet
    xlsContent += '<Worksheet ss:Name="Employees">'
    xlsContent += '<Table>'

    // Add header row
    xlsContent += '<Row ss:StyleID="Header">'
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Status', 'Hire Date']
    headers.forEach(header => {
      xlsContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`
    })
    xlsContent += '</Row>'

    // Add data rows
    filteredEmployees.forEach(employee => {
      xlsContent += '<Row>'

      // Add cells for each employee property
      xlsContent += `<Cell><Data ss:Type="String">${employee.firstName}</Data></Cell>`
      xlsContent += `<Cell><Data ss:Type="String">${employee.lastName}</Data></Cell>`
      xlsContent += `<Cell><Data ss:Type="String">${employee.email}</Data></Cell>`
      xlsContent += `<Cell><Data ss:Type="String">${employee.phone || ''}</Data></Cell>`
      xlsContent += `<Cell><Data ss:Type="String">${employee.department.name}</Data></Cell>`
      xlsContent += `<Cell><Data ss:Type="String">${employee.position.title}</Data></Cell>`

      // Format status
      const status = employee.status === 'ACTIVE'
        ? 'Active'
        : employee.status === 'ON_LEAVE'
          ? 'On Leave'
          : 'Inactive'
      xlsContent += `<Cell><Data ss:Type="String">${status}</Data></Cell>`

      // Format date
      const hireDate = new Date(employee.hireDate).toLocaleDateString('fr-FR')
      xlsContent += `<Cell><Data ss:Type="String">${hireDate}</Data></Cell>`

      xlsContent += '</Row>'
    })

    // Close tags
    xlsContent += '</Table>'
    xlsContent += '</Worksheet>'
    xlsContent += '</Workbook>'

    // Create a blob and download
    const blob = new Blob([xlsContent], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `employees_export_${new Date().toISOString().split('T')[0]}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Employees exported to Excel successfully')
  }

  // Filter employees based on search term, current tab, and filter criteria
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status based on the current tab
    const matchesTab =
      currentTab === 'all' ||
      (currentTab === 'active' && employee.status === 'ACTIVE') ||
      (currentTab === 'onLeave' && employee.status === 'ON_LEAVE') ||
      (currentTab === 'terminated' && employee.status === 'INACTIVE')

    // Filter by department if selected
    const matchesDepartment = !departmentFilter || departmentFilter === 'all' || employee.department.id === departmentFilter

    // Filter by position if selected
    const matchesPosition = !positionFilter || positionFilter === 'all' || employee.position.id === positionFilter

    // Filter by date range if selected
    const hireDate = new Date(employee.hireDate)
    const matchesDateRange =
      (!dateRangeFilter.from || hireDate >= new Date(dateRangeFilter.from)) &&
      (!dateRangeFilter.to || hireDate <= new Date(dateRangeFilter.to))

    return matchesSearch && matchesTab && matchesDepartment && matchesPosition && matchesDateRange
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToXLS}>
                <FileText className="mr-2 h-4 w-4 text-green-600" />
                Export to Excel (XLS)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 gap-1"
                onClick={() => {
                  // Make sure departments and positions are loaded
                  if (departments.length === 0 || positions.length === 0) {
                    fetchDepartmentsAndPositions()
                  }

                  // Reset the form
                  form.reset({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    departmentId: "",
                    positionId: "",
                    status: "ACTIVE",
                    hireDate: new Date().toISOString().split('T')[0],
                  })
                }}
              >
                <PlusCircle className="h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Fill in the employee details. Click save when you're done.
                </DialogDescription>
                <div className="mt-2 text-right">
                  <Link
                    href="/rh/employees/add"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setIsAddEmployeeOpen(false)}
                  >
                    Open in full page
                  </Link>
                </div>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 6 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments && departments.length > 0 ? (
                                departments.map((department) => (
                                  <SelectItem key={department.id} value={department.id}>
                                    {department.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="default">No departments available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="positionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions && positions.length > 0 ? (
                                positions.map((position) => (
                                  <SelectItem key={position.id} value={position.id}>
                                    {position.title}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="default">No positions available</SelectItem>
                              )}
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hire Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsAddEmployeeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Employee Dialog */}
          <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>
                  Update the employee details. Click save when you're done.
                </DialogDescription>
                {selectedEmployee && (
                  <div className="mt-2 text-right">
                    <Link
                      href={`/rh/employees/edit/${selectedEmployee.id}`}
                      className="text-sm text-primary hover:underline"
                      onClick={() => setIsEditEmployeeOpen(false)}
                    >
                      Open in full page
                    </Link>
                  </div>
                )}
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 6 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments && departments.length > 0 ? (
                                departments.map((department) => (
                                  <SelectItem key={department.id} value={department.id}>
                                    {department.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="default">No departments available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="positionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions && positions.length > 0 ? (
                                positions.map((position) => (
                                  <SelectItem key={position.id} value={position.id}>
                                    {position.title}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="default">No positions available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hire Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsEditEmployeeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the employee
                  {selectedEmployee && ` ${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                  and remove their data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteEmployee}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* View Profile Dialog */}
          <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Employee Profile</DialogTitle>
                <DialogDescription>
                  Detailed information about the employee.
                </DialogDescription>
                {selectedEmployee && (
                  <div className="mt-2 text-right">
                    <Link
                      href={`/rh/employees/view/${selectedEmployee.id}`}
                      className="text-sm text-primary hover:underline"
                      onClick={() => setIsViewProfileOpen(false)}
                    >
                      Open in full page
                    </Link>
                  </div>
                )}
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</h3>
                      <p className="text-muted-foreground">{selectedEmployee.position.title}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                      <p>{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                      <p>{selectedEmployee.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                      <p>{selectedEmployee.department.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedEmployee.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : selectedEmployee.status === 'ON_LEAVE'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {selectedEmployee.status === 'ACTIVE'
                          ? 'Active'
                          : selectedEmployee.status === 'ON_LEAVE'
                            ? 'On Leave'
                            : 'Terminated'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Hire Date</h4>
                      <p>{new Date(selectedEmployee.hireDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Employee ID</h4>
                      <p>{selectedEmployee.id}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsViewProfileOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setIsViewProfileOpen(false)
                        handleEditEmployee(selectedEmployee)
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
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
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="onLeave">On Leave</TabsTrigger>
            <TabsTrigger value="terminated">Terminated</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={(departmentFilter && departmentFilter !== 'all') || (positionFilter && positionFilter !== 'all') || dateRangeFilter.from || dateRangeFilter.to ? "default" : "outline"}
                  size="sm"
                  className="h-9 gap-1"
                >
                  <Filter className="h-4 w-4" />
                  {(departmentFilter && departmentFilter !== 'all') || (positionFilter && positionFilter !== 'all') || dateRangeFilter.from || dateRangeFilter.to ? "Filters Active" : "Filter"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Filter Employees</DialogTitle>
                  <DialogDescription>
                    Apply filters to narrow down the employee list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                      value={positionFilter}
                      onValueChange={setPositionFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Positions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hire Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="fromDate" className="text-xs">From</Label>
                        <Input
                          id="fromDate"
                          type="date"
                          value={dateRangeFilter.from || ''}
                          onChange={(e) => setDateRangeFilter(prev => ({ ...prev, from: e.target.value || null }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="toDate" className="text-xs">To</Label>
                        <Input
                          id="toDate"
                          type="date"
                          value={dateRangeFilter.to || ''}
                          onChange={(e) => setDateRangeFilter(prev => ({ ...prev, to: e.target.value || null }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDepartmentFilter('all')
                      setPositionFilter('all')
                      setDateRangeFilter({ from: null, to: null })
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Employees</CardTitle>
              <CardDescription>
                View and manage all employees in the organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-7 gap-4">
                      {Array(7).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-7 gap-4 py-2">
                        {Array(7).fill(0).map((_, j) => (
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
              ) : filteredEmployees.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No employees found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredEmployees}
                  filterColumn="name"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          {/* Content for active employees is handled by the filter */}
          <Card>
            <CardHeader>
              <CardTitle>Active Employees</CardTitle>
              <CardDescription>
                View and manage all currently active employees.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-7 gap-4">
                      {Array(7).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-7 gap-4 py-2">
                        {Array(7).fill(0).map((_, j) => (
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
              ) : filteredEmployees.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No active employees found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredEmployees}
                  filterColumn="name"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="onLeave" className="space-y-4">
          {/* Content for employees on leave is handled by the filter */}
          <Card>
            <CardHeader>
              <CardTitle>Employees on Leave</CardTitle>
              <CardDescription>
                View and manage all employees currently on leave.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-7 gap-4">
                      {Array(7).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-7 gap-4 py-2">
                        {Array(7).fill(0).map((_, j) => (
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
              ) : filteredEmployees.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No employees on leave found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredEmployees}
                  filterColumn="name"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="terminated" className="space-y-4">
          {/* Content for terminated employees is handled by the filter */}
          <Card>
            <CardHeader>
              <CardTitle>Terminated Employees</CardTitle>
              <CardDescription>
                View all terminated or inactive employees.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-7 gap-4">
                      {Array(7).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-7 gap-4 py-2">
                        {Array(7).fill(0).map((_, j) => (
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
              ) : filteredEmployees.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No terminated employees found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredEmployees}
                  filterColumn="name"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
