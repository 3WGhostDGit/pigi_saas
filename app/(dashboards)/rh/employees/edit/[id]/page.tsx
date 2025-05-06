"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Define the form schema
const employeeFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  departmentId: z.string({
    required_error: "Please select a department.",
  }),
  positionId: z.string({
    required_error: "Please select a position.",
  }),
  status: z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE"], {
    required_error: "Please select a status.",
  }),
  hireDate: z.string({
    required_error: "Please select a hire date.",
  }),
})

// Define the form values type
type EmployeeFormValues = z.infer<typeof employeeFormSchema>

// Define the employee type
interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: {
    id: string
    name: string
  }
  position: {
    id: string
    title: string
  }
  status: string
  hireDate: string
}

// Define the department type
interface Department {
  id: string
  name: string
}

// Define the position type
interface Position {
  id: string
  title: string
}

export default function EditEmployeePage() {
  const params = useParams();
  const employeeId = params?.id as string;
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize the edit employee form
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

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (status !== 'authenticated') return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/rh/employees/${employeeId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch employee')
        }

        const data = await response.json()

        // Check if data.employee exists before accessing its properties
        if (!data || !data.firstName) {
          throw new Error('Invalid employee data received')
        }

        setEmployee(data)

        // Set form values
        form.reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          departmentId: data.department?.id || '',
          positionId: data.position?.id || '',
          status: data.status as "ACTIVE" | "ON_LEAVE" | "INACTIVE",
          hireDate: new Date(data.hireDate).toISOString().split('T')[0],
        })

        setError(null)
      } catch (err) {
        console.error('Error fetching employee:', err)
        setError('Failed to load employee data. Please try again.')
        toast.error("Failed to load employee data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployee()
  }, [employeeId, status, form])

  // Fetch departments and positions for the form
  useEffect(() => {
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

    if (status === 'authenticated') {
      fetchDepartmentsAndPositions()
    }
  }, [status])

  // Handle form submission
  const onSubmit = async (data: EmployeeFormValues) => {
    if (status !== 'authenticated') return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/rh/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update employee')
      }

      toast.success("Employee updated successfully")
      router.push('/rh/employees')
    } catch (err) {
      console.error('Error updating employee:', err)
      setError('Failed to update employee. Please try again.')
      toast.error("Failed to update employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Link href="/rh/employees">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-40" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Link href="/rh/employees">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-destructive">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/rh/employees">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Edit Employee</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Update the employee details. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="edit-employee-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
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
                          {positions.map((position) => (
                            <SelectItem key={position.id} value={position.id}>
                              {position.title}
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push('/rh/employees')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-employee-form"
            disabled={isSubmitting}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
