'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, User, Mail, Building2, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Define the department request type
interface DepartmentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentDepartmentName?: string;
  requestedDepartmentName: string;
  requestedDepartmentId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  adminNotes?: string;
  updatedAt?: string;
  processedAt?: string;
  processedById?: string;
  processedByName?: string;
}

export default function ViewDepartmentRequestPage() {
  const params = useParams();
  const requestId = params?.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<DepartmentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch department request data
  useEffect(() => {
    const fetchDepartmentRequest = async () => {
      if (status !== 'authenticated') return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/rh/department-requests/${requestId}`);

        if (!response.ok) {
          const errorData = await response.json();

          // Handle specific status codes
          if (response.status === 403) {
            throw new Error('You do not have permission to view this department request');
          } else if (response.status === 404) {
            throw new Error('Department request not found');
          } else {
            throw new Error(errorData.error || 'Failed to fetch department request');
          }
        }

        const data = await response.json();
        console.log('Department request data:', data); // Debug log

        if (data.request) {
          // New API format returns { request: {...} }
          setRequest(data.request);
          setAdminNotes(data.request.adminNotes || '');
        } else if (data.id) {
          // Direct object format
          setRequest(data);
          setAdminNotes(data.adminNotes || '');
        } else {
          // No valid data found
          throw new Error('Invalid response format from API');
        }
        setError(null);
      } catch (err: any) {
        console.error('Error fetching department request:', err);
        setError(err.message || 'Failed to load department request');
        toast.error('Failed to load department request details');
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId) {
      fetchDepartmentRequest();
    }
  }, [requestId, status]);

  // Handle approve/reject action
  const handleAction = async () => {
    if (!request || !actionType) return;

    try {
      // Use the main endpoint with PUT method instead of a separate endpoint for each action
      const response = await fetch(`/api/rh/department-requests/${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
          adminNotes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific status codes
        if (response.status === 403) {
          throw new Error('You do not have permission to perform this action');
        } else if (response.status === 404) {
          throw new Error('Department request not found');
        } else {
          throw new Error(errorData.error || `Failed to ${actionType} request`);
        }
      }

      const data = await response.json();
      console.log(`${actionType} response data:`, data); // Debug log
      toast.success(`Request ${actionType}d successfully.`);

      // Update the request data from the response
      if (data.request) {
        setRequest(data.request);
      } else if (data.id) {
        // Direct object format
        setRequest(data);
      } else {
        // Refresh the request data if the API doesn't return the updated request
        const updatedResponse = await fetch(`/api/rh/department-requests/${requestId}`);
        if (!updatedResponse.ok) {
          throw new Error('Failed to refresh request data');
        }
        const updatedData = await updatedResponse.json();
        console.log('Refreshed data:', updatedData); // Debug log

        if (updatedData.request) {
          setRequest(updatedData.request);
        } else if (updatedData.id) {
          setRequest(updatedData);
        } else {
          throw new Error('Invalid response format from API');
        }
      }
    } catch (err: any) {
      console.error(`Error ${actionType}ing request:`, err);
      toast.error(err.message || `Failed to ${actionType} request`);
    } finally {
      setIsConfirmModalOpen(false);
      setActionType(null);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-52" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Link href="/rh/department-requests">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Requests
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.refresh()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Link href="/rh/department-requests">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Requests
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">Department request not found</p>
            <Button onClick={() => router.push('/rh/department-requests')}>Return to Requests</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/rh/department-requests">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Requests
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Department Update Request</h2>
        </div>
        {request.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 hover:bg-red-100 hover:text-red-600"
              onClick={() => {
                setActionType('reject');
                setIsConfirmModalOpen(true);
              }}
            >
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Reject Request
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 hover:bg-green-100 hover:text-green-600"
              onClick={() => {
                setActionType('approve');
                setIsConfirmModalOpen(true);
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              Approve Request
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Department update request information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Department</h3>
                <p className="text-lg font-medium">{request.currentDepartmentName || 'Not assigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Requested Department</h3>
                <p className="text-lg font-medium">{request.requestedDepartmentName}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Reason for Request</h3>
              <div className="bg-muted p-4 rounded-md">
                <p>{request.reason || 'No reason provided'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
              <Badge
                variant={request.status === 'APPROVED' ? 'default' :
                        request.status === 'REJECTED' ? 'destructive' : 'outline'}
                className={request.status === 'PENDING' ?
                          'text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600' :
                          request.status === 'APPROVED' ?
                          'text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600' : ''}
              >
                {request.status.toLowerCase()}
              </Badge>
            </div>

            {request.adminNotes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Admin Notes</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p>{request.adminNotes}</p>
                </div>
              </div>
            )}

            {request.status !== 'PENDING' && request.processedByName && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Processed By</h3>
                <p>{request.processedByName}</p>
                {request.processedAt && (
                  <p className="text-sm text-muted-foreground">
                    on {new Date(request.processedAt).toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>
              Details about the employee who submitted this request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{request.userName}</p>
                <p className="text-sm text-muted-foreground">Employee</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{request.userEmail}</span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{request.currentDepartmentName || 'Not assigned'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Submitted on {new Date(request.createdAt).toLocaleDateString('fr-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/rh/employees/view/${request.userId}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Employee Profile
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Confirmation Modal for Approve/Reject */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this department update request for {request.userName}?
              {actionType === 'approve' && " This will update the user's department."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="admin-notes" className="text-sm font-medium">
              Admin Notes (optional)
            </Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes about this decision"
              className="mt-1.5"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setActionType(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === 'reject' ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Confirm {actionType ? actionType.charAt(0).toUpperCase() + actionType.slice(1) : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
