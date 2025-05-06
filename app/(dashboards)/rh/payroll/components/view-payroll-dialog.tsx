'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Calendar, DollarSign, User, Mail, Briefcase, Download } from 'lucide-react';
import Link from 'next/link';
import type { PayrollEntry } from '../columns';

interface ViewPayrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: PayrollEntry | null;
  onDownloadPayslip: (entry: PayrollEntry) => void;
}

export function ViewPayrollDialog({
  open,
  onOpenChange,
  entry,
  onDownloadPayslip,
}: ViewPayrollDialogProps) {
  if (!entry) return null;

  // Format dates
  const effectiveDate = new Date(entry.effectiveDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const paymentDate = entry.paymentDate 
    ? new Date(entry.paymentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not processed yet';

  // Get initials for avatar
  const nameParts = entry.employee.split(' ');
  const initials = nameParts.length > 1
    ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    : entry.employee.substring(0, 2).toUpperCase();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: entry.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine status badge styling
  let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
  let textAndBorderClass = "";

  if (entry.status === "PAID") {
    badgeVariant = "default";
    textAndBorderClass = "text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600";
  } else if (entry.status === "PENDING") {
    badgeVariant = "default";
    textAndBorderClass = "text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600";
  } else if (entry.status === "CANCELLED") {
    badgeVariant = "destructive";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payroll Entry Details</DialogTitle>
          <DialogDescription>
            Review the details of this payroll entry
          </DialogDescription>
          <div className="mt-2 text-right">
            <Link
              href={`/rh/payroll/view/${entry.id}`}
              className="text-sm text-primary hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Open in full page
            </Link>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Employee info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{entry.employee}</h3>
              {entry.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{entry.email}</span>
                </div>
              )}
            </div>
            <div className="ml-auto">
              <Badge
                variant={badgeVariant}
                className={`capitalize ${textAndBorderClass}`}
              >
                {entry.status.toLowerCase()}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Job details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Department</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium">{entry.department}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Position</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium">{entry.position}</span>
              </div>
            </div>
          </div>

          {/* Salary details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Salary</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium">{formatCurrency(entry.salary)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Net Pay</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium">{formatCurrency(entry.netPay)}</span>
              </div>
            </div>
          </div>

          {/* Additional details */}
          {(entry.bonus || entry.deductions) && (
            <div className="grid grid-cols-2 gap-4">
              {entry.bonus && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Bonus</div>
                  <div className="font-medium text-green-600">{formatCurrency(entry.bonus)}</div>
                </div>
              )}
              {entry.deductions && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Deductions</div>
                  <div className="font-medium text-red-600">-{formatCurrency(entry.deductions)}</div>
                </div>
              )}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Effective Date</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{effectiveDate}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Payment Date</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{paymentDate}</span>
              </div>
            </div>
          </div>

          {/* Reason */}
          {entry.reason && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Reason</div>
              <div className="p-3 bg-muted/50 rounded-md">
                {entry.reason}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onDownloadPayslip(entry)}>
            <Download className="mr-2 h-4 w-4" />
            Download Payslip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
