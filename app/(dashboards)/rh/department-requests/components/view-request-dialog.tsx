'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Calendar, FileText, User, Mail, CheckCircle2, XCircle } from 'lucide-react';
import type { DepartmentRequest } from '../columns';

interface ViewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DepartmentRequest | null;
  onApprove: (request: DepartmentRequest) => void;
  onReject: (request: DepartmentRequest) => void;
}

export function ViewRequestDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: ViewRequestDialogProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  if (!request) return null;

  // Format date
  const createdAt = new Date(request.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get initials for avatar
  const nameParts = request.userName.split(' ');
  const initials = nameParts.length > 1
    ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    : request.userName.substring(0, 2).toUpperCase();

  // Handle action confirmation
  const handleActionClick = (action: 'approve' | 'reject') => {
    setActionType(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'approve') {
      onApprove(request);
    } else if (actionType === 'reject') {
      onReject(request);
    }
    setIsConfirmModalOpen(false);
    onOpenChange(false);
  };

  // Determine status badge styling
  let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
  let textAndBorderClass = "";

  if (request.status === "APPROVED") {
    badgeVariant = "default";
    textAndBorderClass = "text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600";
  } else if (request.status === "PENDING") {
    badgeVariant = "default";
    textAndBorderClass = "text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600";
  } else if (request.status === "REJECTED") {
    badgeVariant = "destructive";
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Department Update Request</DialogTitle>
            <DialogDescription>
              Review the details of this department update request
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* User info */}
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{request.userName}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{request.userEmail}</span>
                </div>
              </div>
              <div className="ml-auto">
                <Badge
                  variant={badgeVariant}
                  className={`capitalize ${textAndBorderClass}`}
                >
                  {request.status.toLowerCase()}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Request details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Current Department</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{request.currentDepartmentName || 'Not assigned'}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Requested Department</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{request.requestedDepartmentName}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Reason for Request</Label>
              <div className="mt-1 p-3 bg-muted/50 rounded-md">
                {request.reason}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Date Submitted</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{createdAt}</span>
              </div>
            </div>

            {request.adminNotes && (
              <div>
                <Label className="text-muted-foreground">Admin Notes</Label>
                <div className="mt-1 p-3 bg-muted/50 rounded-md">
                  {request.adminNotes}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {request.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  className="border-red-200 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleActionClick('reject')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleActionClick('approve')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {request.status !== 'PENDING' && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve this department change request? This will update the employee's department to ${request.requestedDepartmentName}.`
                : 'Are you sure you want to reject this department change request?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
