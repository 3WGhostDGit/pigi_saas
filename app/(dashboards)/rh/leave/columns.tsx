"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle, XCircle, Eye, User, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createSelectColumn, createSortableColumn } from "@/components/ui/data-table"
import Link from "next/link"

// Define the LeaveRequest type based on the API response
export type LeaveRequest = {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  approverId?: string;
  approvedAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    jobTitle?: string;
    department?: {
      id: string;
      name: string;
    };
  };
  leaveType: {
    id: string;
    name: string;
    description?: string;
  };
  approver?: {
    id: string;
    name: string;
    email: string;
  };
}

// Helper function to get status badge class
export const getStatusBadgeClass = (status: string) => {
  switch(status) {
    case 'APPROVED':
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case 'REJECTED':
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case 'PENDING':
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case 'CANCELLED':
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

// Define the columns for the leave requests table
export const columns = (
  onViewDetails: (leaveRequest: LeaveRequest) => void,
  onApprove: (id: string) => void,
  onReject: (id: string) => void
): ColumnDef<LeaveRequest>[] => [
  createSelectColumn<LeaveRequest>(),
  {
    accessorFn: (row) => row.user.name,
    id: "employee",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Employee <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const leaveRequest = row.original
      return (
        <div className="font-medium flex items-center gap-2">
          <Link
            href={`/rh/employees/view/${leaveRequest.userId}`}
            className="hover:underline flex items-center gap-1"
          >
            {leaveRequest.user.name}
          </Link>
        </div>
      )
    },
  },
  createSortableColumn<LeaveRequest>("leaveType.name", "Leave Type"),
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Start Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate") as string)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        End Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate") as string)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const startDate = new Date(row.original.startDate)
      const endDate = new Date(row.original.endDate)
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return <div>{duration} days</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant="outline"
          className={`capitalize ${getStatusBadgeClass(status)}`}
        >
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Submitted <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const leaveRequest = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(leaveRequest)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`/rh/employees/view/${leaveRequest.userId}`, '_blank')}>
              <User className="mr-2 h-4 w-4" />
              View Employee
            </DropdownMenuItem>
            {leaveRequest.status === 'PENDING' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => onApprove(leaveRequest.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onReject(leaveRequest.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
