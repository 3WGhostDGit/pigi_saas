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
import { ArrowLeft, CheckCircle, XCircle, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { getStatusBadgeClass } from "../columns"
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

// Define the LeaveRequest type
interface LeaveRequest {
  id: string
  userId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  approverId?: string
  approvedAt?: string
  user: {
    id: string
    name: string
    email: string
    jobTitle?: string
    department?: {
      id: string
      name: string
    }
  }
  leaveType: {
    id: string
    name: string
    description?: string
  }
  approver?: {
    id: string
    name: string
    email: string
  }
}

export default function ViewLeaveRequestPage() {
  const params = useParams();
  const leaveId = params?.id as string;
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)

  // Fetch leave request data
  useEffect(() => {
    const fetchLeaveRequest = async () => {
      if (status !== 'authenticated') return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/rh/leave/${leaveId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch leave request')
        }

        const data = await response.json()
        console.log('Leave request data:', data) // Debug log

        // Check if the data has the expected structure
        if (!data || !data.id) {
          throw new Error('Invalid leave request data received from server')
        }

        setLeaveRequest(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching leave request:', err)
        setError('Failed to load leave request data. Please try again.')
        toast.error("Failed to load leave request data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (leaveId) {
      fetchLeaveRequest()
    }
  }, [leaveId, status])

  // Handle approve/reject leave request
  const handleLeaveAction = async () => {
    if (!leaveRequest || !actionType) return

    try {
      const response = await fetch(`/api/rh/leave/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Convert 'approve' to 'APPROVED' and 'reject' to 'REJECTED'
          status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle specific status codes
        if (response.status === 400) {
          throw new Error(errorData.error || `Invalid request: ${JSON.stringify(errorData)}`)
        } else if (response.status === 401) {
          throw new Error('You are not authorized to perform this action')
        } else if (response.status === 404) {
          throw new Error('Leave request not found')
        } else {
          throw new Error(errorData.error || `Failed to ${actionType} leave request`)
        }
      }

      toast.success(`Leave request ${actionType}d successfully`)
      setIsConfirmModalOpen(false)

      // Refresh the leave request data
      try {
        const refreshResponse = await fetch(`/api/rh/leave/${leaveId}`)
        if (!refreshResponse.ok) {
          const errorData = await refreshResponse.json()
          console.warn('Error refreshing leave request data:', errorData.error)
          // Don't throw here, just log the warning
        } else {
          const refreshData = await refreshResponse.json()
          console.log('Refreshed leave request data:', refreshData) // Debug log

          // Check if the data has the expected structure
          if (refreshData && refreshData.id) {
            setLeaveRequest(refreshData)
          }
        }
      } catch (refreshErr) {
        console.warn('Error refreshing leave request data:', refreshErr)
        // Don't throw here, the action was successful even if refresh failed
      }
    } catch (err: any) {
      console.error(`Error ${actionType}ing leave request:`, err)
      toast.error(err.message || `Failed to ${actionType} leave request. Please try again.`)
    }
  }

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Link href="/rh/leave">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Leave Requests
            </Button>
          </Link>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[350px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[200px]" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[200px]" />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !leaveRequest) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Link href="/rh/leave">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Leave Requests
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Leave Request Details</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-destructive text-lg">{error || 'Leave request not found'}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/rh/leave')}
              >
                Return to Leave Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/rh/leave">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Leave Requests
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Leave Request Details</h2>
        </div>
        {leaveRequest.status === 'PENDING' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-red-200 hover:bg-red-100 hover:text-red-600"
              onClick={() => {
                setActionType('reject')
                setIsConfirmModalOpen(true)
              }}
            >
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Reject Request
            </Button>
            <Button
              variant="outline"
              className="border-green-200 hover:bg-green-100 hover:text-green-600"
              onClick={() => {
                setActionType('approve')
                setIsConfirmModalOpen(true)
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Approve Request
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Leave Request</CardTitle>
              <CardDescription>
                Details for leave request submitted on {new Date(leaveRequest.createdAt).toLocaleDateString('fr-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </div>
            <Badge
              variant={leaveRequest.status === 'APPROVED' ? 'default' :
                      leaveRequest.status === 'REJECTED' ? 'destructive' : 'outline'}
              className={`text-sm px-3 py-1 ${
                leaveRequest.status === 'PENDING' ?
                'text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600' :
                leaveRequest.status === 'APPROVED' ?
                'text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600' : ''
              }`}
            >
              {leaveRequest.status.toLowerCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Employee Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{leaveRequest.user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{leaveRequest.user.email}</p>
                </div>
                {leaveRequest.user.jobTitle && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p>{leaveRequest.user.jobTitle}</p>
                  </div>
                )}
                {leaveRequest.user.department && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p>{leaveRequest.user.department.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Leave Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leave Type</p>
                  <p className="font-medium">{leaveRequest.leaveType.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p>{new Date(leaveRequest.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p>{new Date(leaveRequest.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p>{calculateDuration(leaveRequest.startDate, leaveRequest.endDate)} days</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Reason for Leave</h3>
            <div className="bg-muted p-4 rounded-md">
              <p>{leaveRequest.reason}</p>
            </div>
          </div>

          {leaveRequest.approver && leaveRequest.approvedAt && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Decision Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Decision By</p>
                    <p>{leaveRequest.approver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Decision Date</p>
                    <p>{new Date(leaveRequest.approvedAt).toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Link href={`/rh/employees/view/${leaveRequest.userId}`}>
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              View Employee Profile
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Confirmation Modal for Approve/Reject */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this leave request for {leaveRequest.user.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionType(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveAction}
              className={actionType === 'reject' ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Confirm {actionType ? actionType.charAt(0).toUpperCase() + actionType.slice(1) : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
