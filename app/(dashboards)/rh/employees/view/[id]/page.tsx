"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, User } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function ViewEmployeePage() {
  const params = useParams();
  const employeeId = params?.id as string;
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

        // Check if data exists and has required properties
        if (!data || !data.firstName) {
          throw new Error('Invalid employee data received')
        }

        setEmployee(data)
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
  }, [employeeId, status])

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active'
      case 'ON_LEAVE':
        return 'On Leave'
      case 'INACTIVE':
        return 'Inactive'
      default:
        return status
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-32" />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-full max-w-[200px]" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !employee) {
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
          <div className="text-destructive">{error || 'Employee not found'}</div>
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
          <h2 className="text-3xl font-bold tracking-tight">Employee Profile</h2>
        </div>
        <Link href={`/rh/employees/edit/${employee.id}`}>
          <Button size="sm" className="h-9 gap-1">
            <Edit className="h-4 w-4" />
            Edit Employee
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{`${employee.firstName} ${employee.lastName}`}</CardTitle>
              <CardDescription className="text-lg">{employee.position.title}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{employee.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p>{employee.department.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Position</p>
                <p>{employee.position.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p>{formatStatus(employee.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
                <p>{formatDate(employee.hireDate)}</p>
              </div>
            </div>
          </div>

          {/* Additional sections can be added here as needed */}
        </CardContent>
      </Card>
    </div>
  )
}
