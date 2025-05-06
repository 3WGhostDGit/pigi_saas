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
import { ArrowLeft, Edit, User, Mail, Phone, Building2, Briefcase, Calendar, Clock, Shield } from "lucide-react"
import { RoleBadge } from "@/components/rh/RoleBadge"
import { DepartmentBadge } from "@/components/rh/DepartmentBadge"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  roles: string[] // Make roles required, not optional
  address?: string
  joinDate?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {`${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{`${employee.firstName} ${employee.lastName}`}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription className="text-base">{employee.position.title}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <RoleBadge user={employee} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="font-medium">{employee.phone || 'Not provided'}</p>
                  </div>
                </div>
                {employee.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="font-medium">{employee.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <div className="flex items-center">
                      <DepartmentBadge departmentName={employee.department.name} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p className="font-medium">{employee.position.title}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge
                      variant={employee.status === "ACTIVE" ? "default" :
                              employee.status === "ON_LEAVE" ? "outline" : "destructive"}
                      className={employee.status === "ON_LEAVE" ?
                                "text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600" : ""}
                    >
                      {formatStatus(employee.status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
                    <p className="font-medium">{formatDate(employee.hireDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {employee.emergencyContact && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><path d="M8 2h8"></path><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"></path><path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0"></path></svg>
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="font-medium">{employee.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                      <p className="font-medium">{employee.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="font-medium">{employee.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage this employee's information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/rh/employees/edit/${employee.id}`} className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </Button>
            </Link>
            <Link href={`/rh/leave?employeeId=${employee.id}`} className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
                View Leave Requests
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Download Profile
            </Button>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <h4 className="text-sm font-medium">Employee Status</h4>
              <div className="flex gap-2">
                <Button
                  variant={employee.status === "ACTIVE" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  Active
                </Button>
                <Button
                  variant={employee.status === "ON_LEAVE" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  On Leave
                </Button>
                <Button
                  variant={employee.status === "INACTIVE" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
