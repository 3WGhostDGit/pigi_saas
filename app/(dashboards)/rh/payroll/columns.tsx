"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Download, DollarSign, Calendar, Building2, Briefcase, User } from "lucide-react"
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

export type PayrollEntry = {
  id: string;
  userId: string;
  employee: string;
  email?: string;
  department: string;
  position: string;
  salary: number;
  currency: string;
  bonus?: number;
  deductions?: number;
  netPay: number;
  effectiveDate: string;
  paymentDate?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  reason?: string;
};

export const columns: ColumnDef<PayrollEntry>[] = [
  createSelectColumn<PayrollEntry>(),
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Employee <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const entry = row.original;
      const nameParts = entry.employee.split(' ');
      const initials = nameParts.length > 1 
        ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
        : entry.employee.substring(0, 2).toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{entry.employee}</div>
            {entry.email && (
              <div className="text-sm text-muted-foreground">{entry.email}</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Department <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
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
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const position = row.getValue("position") as string;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-full">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
          </div>
          <span>{position}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="justify-end w-full">
        Salary <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"));
      const currency = row.original.currency;
      
      // Format the amount as currency
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      
      return (
        <div className="text-right font-medium">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "netPay",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="justify-end w-full">
        Net Pay <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("netPay"));
      const currency = row.original.currency;
      
      // Format the amount as currency
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      
      return (
        <div className="text-right font-medium">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "effectiveDate",
    header: "Effective Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("effectiveDate") as string);
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as PayrollEntry['status'];
      let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
      let textAndBorderClass = "";

      if (status === "PAID") {
        badgeVariant = "default";
        textAndBorderClass = "text-green-700 bg-green-100/80 border-green-300 dark:text-green-300 dark:bg-green-700/30 dark:border-green-600";
      } else if (status === "PENDING") {
        badgeVariant = "default";
        textAndBorderClass = "text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600";
      } else if (status === "CANCELLED") {
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
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original;

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
              <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('view-payroll-entry', { detail: entry }))}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <Link href={`/rh/payroll/view/${entry.id}`} className="w-full">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FileEdit className="mr-2 h-4 w-4" /> View Full Page
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('download-payslip', { detail: entry }))}>
                <Download className="mr-2 h-4 w-4" /> Download Payslip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
