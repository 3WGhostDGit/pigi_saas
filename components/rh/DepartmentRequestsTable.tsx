'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

// Import the DepartmentRequest type from columns
import { DepartmentRequest as ColumnsDepartmentRequest } from '@/app/(dashboards)/rh/department-requests/columns';

// Extend the type to include properties needed by this component
type DepartmentRequest = ColumnsDepartmentRequest & {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
  requestedDepartment?: {
    id: string;
    name: string;
  };
  currentJobTitle?: string | null;
  requestedJobTitle?: string | null;
  additionalInfo?: string | null;
  updatedAt?: string;
  processedAt?: string | null;
  processedById?: string | null;
};

interface DepartmentRequestsTableProps {
  columns?: any[];
  data: DepartmentRequest[];
  searchTerm?: string;
  statusFilter?: string;
}

export function DepartmentRequestsTable({
  data,
  searchTerm = '',
  statusFilter = 'all'
}: DepartmentRequestsTableProps) {
  const { data: session } = useSession();
  const [filteredRequests, setFilteredRequests] = useState<DepartmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DepartmentRequest | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch department requests
  const fetchRequests = () => {
    // This function is now a no-op since data is passed as props
    // We keep it for compatibility with the existing code
  };

  // Filter requests based on search term and status filter
  useEffect(() => {
    setIsLoading(true);
    let filtered = [...data];

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(request => {
        const userName = request.user?.name?.toLowerCase() || '';
        const userEmail = request.user?.email?.toLowerCase() || '';
        const departmentName = request.requestedDepartment?.name?.toLowerCase() || request.requestedDepartmentName?.toLowerCase() || '';

        return userName.includes(search) ||
               userEmail.includes(search) ||
               departmentName.includes(search);
      });
    }

    setFilteredRequests(filtered);
    setIsLoading(false);
  }, [data, searchTerm, statusFilter]);

  // Handle view request
  const handleViewRequest = (request: DepartmentRequest) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setAdminNotes(request.adminNotes || '');
    setIsViewOpen(true);
  };

  // Handle process request
  const handleProcessRequest = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/profile/department-request/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process request');
      }

      toast.success(`Request ${status.toLowerCase()}`);
      setIsViewOpen(false);
      fetchRequests();
    } catch (error) {
      console.error('Error processing department request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="default" className="text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading requests...</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Current Department</TableHead>
            <TableHead>Requested Department</TableHead>
            <TableHead>Requested Job Title</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No department update requests found
              </TableCell>
            </TableRow>
          ) : (
            filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.user?.name || request.user?.email || request.userName || request.userEmail || 'Unknown'}
                </TableCell>
                <TableCell>
                  {session?.user?.department || 'Not assigned'}
                </TableCell>
                <TableCell>{request.requestedDepartment?.name || request.requestedDepartmentName || 'Unknown'}</TableCell>
                <TableCell>{request.requestedJobTitle || 'Not specified'}</TableCell>
                <TableCell>
                  {format(new Date(request.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{renderStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewRequest(request)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View/Process Request Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Department Update Request</DialogTitle>
            <DialogDescription>
              Review and process the department update request.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Employee</p>
                  <p className="text-sm">
                    {selectedRequest.user?.name || selectedRequest.user?.email || selectedRequest.userName || selectedRequest.userEmail || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Date Requested</p>
                  <p className="text-sm">
                    {format(new Date(selectedRequest.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Current Department</p>
                  <p className="text-sm">
                    {session?.user?.department || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Requested Department</p>
                  <p className="text-sm">{selectedRequest.requestedDepartment?.name || selectedRequest.requestedDepartmentName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Current Job Title</p>
                  <p className="text-sm">{selectedRequest.currentJobTitle || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Requested Job Title</p>
                  <p className="text-sm">{selectedRequest.requestedJobTitle || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Additional Information</p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {selectedRequest.additionalInfo || 'No additional information provided'}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as any)}
                  disabled={isProcessing || selectedRequest.status !== 'PENDING'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Admin Notes</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request"
                  disabled={isProcessing || selectedRequest.status !== 'PENDING'}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Cancel
            </Button>
            {selectedRequest?.status === 'PENDING' && (
              <Button
                onClick={handleProcessRequest}
                disabled={isProcessing}
                className="gap-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : status === 'APPROVED' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
