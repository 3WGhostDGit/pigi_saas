"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, CheckCircle2, XCircle, Eye, ArrowUpDown, FileEdit, User, Building2, Calendar, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { createSelectColumn, createSortableColumn } from "@/components/ui/data-table"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DepartmentBadge } from "@/components/rh/DepartmentBadge"

export type DepartmentRequest = {
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
};

export const columns: ColumnDef<DepartmentRequest>[] = [
  createSelectColumn<DepartmentRequest>(),
  {
    accessorFn: (row) => row.userName,
    id: "userName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        User <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const request = row.original;
      const nameParts = request.userName.split(' ');
      const initials = nameParts.length > 1
        ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
        : request.userName.substring(0, 2).toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{request.userName}</div>
            <div className="text-sm text-muted-foreground">{request.userEmail}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "requestedDepartmentName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Requested Department <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const department = row.original.requestedDepartmentName;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-full">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span>{department}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "currentDepartmentName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Current Department <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const department = row.original.currentDepartmentName;
      if (!department) return <span className="text-muted-foreground">N/A</span>;

      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-full">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span>{department}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-full">
            <FileText className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="max-w-[200px] truncate" title={reason}>{reason}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as DepartmentRequest['status'];
      let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
      let textAndBorderClass = "";

      if (status === "APPROVED") {
        // Use default variant and apply custom styling for success
        badgeVariant = "default";
        textAndBorderClass = "text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600";
      } else if (status === "PENDING") {
        // Use default variant and apply custom styling for warning
        badgeVariant = "default";
        textAndBorderClass = "text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600";
      } else if (status === "REJECTED") {
        badgeVariant = "destructive";
      }

      return (
        <Badge
          variant={badgeVariant}
          className={`capitalize ${textAndBorderClass}`}
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Submitted",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-full">
            <Calendar className="h-3.5 w-3.5 text-primary" />
          </div>
          <span>{date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('view-department-request', { detail: request }))}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <Link href={`/rh/department-requests/view/${request.id}`} className="w-full">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FileEdit className="mr-2 h-4 w-4" /> View Full Page
                </DropdownMenuItem>
              </Link>
              {request.status === 'PENDING' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('approve-department-request', { detail: request }))}>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('reject-department-request', { detail: request }))}>
                    <XCircle className="mr-2 h-4 w-4 text-red-600" /> Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];