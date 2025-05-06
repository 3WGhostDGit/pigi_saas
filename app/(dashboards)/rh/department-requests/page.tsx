'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Download, FileSpreadsheet, FileText, FileUp } from 'lucide-react';
import { columns } from './columns'; // Import columns
import type { DepartmentRequest } from './columns';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewRequestDialog } from './components/view-request-dialog';

export default function DepartmentRequestsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [requests, setRequests] = useState<DepartmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DepartmentRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/rh/department-requests'); // Adjust API endpoint if needed
      if (!response.ok) {
        throw new Error('Failed to fetch department requests');
      }
      const data = await response.json();
      setRequests(data.requests || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      toast.error(err.message || 'Failed to load requests.');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Log the current tab when it changes
  useEffect(() => {
    console.log('Current tab changed to:', currentTab);
  }, [currentTab]);

  const [adminNotes, setAdminNotes] = useState('');

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;

    const endpoint = `/api/rh/department-requests/${selectedRequest.id}/${actionType}`;
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${actionType} request`);
      }

      toast.success(`Request ${actionType}d successfully.`);
      fetchRequests(); // Re-fetch to update the list
      setAdminNotes(''); // Reset admin notes
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsConfirmModalOpen(false);
      setSelectedRequest(null);
      setActionType(null);
    }
  };

  useEffect(() => {
    const handleViewRequest = (event: CustomEvent<DepartmentRequest>) => {
      setSelectedRequest(event.detail);
      setIsViewModalOpen(true);
    };
    const handleApproveRequest = (event: CustomEvent<DepartmentRequest>) => {
      setSelectedRequest(event.detail);
      setActionType('approve');
      setIsConfirmModalOpen(true);
    };
    const handleRejectRequest = (event: CustomEvent<DepartmentRequest>) => {
      setSelectedRequest(event.detail);
      setActionType('reject');
      setIsConfirmModalOpen(true);
    };

    window.addEventListener('view-department-request', handleViewRequest as EventListener);
    window.addEventListener('approve-department-request', handleApproveRequest as EventListener);
    window.addEventListener('reject-department-request', handleRejectRequest as EventListener);

    return () => {
      window.removeEventListener('view-department-request', handleViewRequest as EventListener);
      window.removeEventListener('approve-department-request', handleApproveRequest as EventListener);
      window.removeEventListener('reject-department-request', handleRejectRequest as EventListener);
    };
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Department Update Requests</h2>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => setCurrentTab(value as 'all' | 'pending' | 'approved' | 'rejected')}
        className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8 w-[200px] sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.info("Exporting to CSV...")}>
                  <FileText className="mr-2 h-4 w-4" /> Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Exporting to Excel...")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Exporting to PDF...")}>
                  <FileUp className="mr-2 h-4 w-4" /> Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Department Update Requests</CardTitle>
              <CardDescription>
                View and manage all department update requests from employees.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !requests.length ? (
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
              ) : requests.length === 0 ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <p>No department requests found.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={requests}
                  filterColumn="userName"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>
                Review and process pending department update requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !requests.length ? (
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
              ) : (
                <DataTable
                  columns={columns}
                  data={requests.filter(request => request.status === 'PENDING')}
                  filterColumn="userName"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>
                View all approved department update requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !requests.length ? (
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
              ) : (
                <DataTable
                  columns={columns}
                  data={requests.filter(request => request.status === 'APPROVED')}
                  filterColumn="userName"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
              <CardDescription>
                View all rejected department update requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !requests.length ? (
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
              ) : (
                <DataTable
                  columns={columns}
                  data={requests.filter(request => request.status === 'REJECTED')}
                  filterColumn="userName"
                  filterPlaceholder="Filter by name..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Request Dialog */}
      <ViewRequestDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        request={selectedRequest}
        onApprove={(request) => {
          setSelectedRequest(request);
          setActionType('approve');
          setIsConfirmModalOpen(true);
        }}
        onReject={(request) => {
          setSelectedRequest(request);
          setActionType('reject');
          setIsConfirmModalOpen(true);
        }}
      />

      {/* Confirmation Modal for Approve/Reject */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this department update request for {selectedRequest?.userName}?
              {actionType === 'approve' && " This will update the user's department."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Admin Notes (optional)</div>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this decision"
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedRequest(null);
              setActionType(null);
              setAdminNotes('');
            }}>
              Cancel
            </AlertDialogCancel>
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
