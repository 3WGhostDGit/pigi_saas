"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, User, Building2, Briefcase, Calendar, Mail, Phone, ArrowUpDown } from "lucide-react"
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
import { RoleBadge } from "@/components/rh/RoleBadge"
import { DepartmentBadge } from "@/components/rh/DepartmentBadge"

// Define the Employee type based on the API response
export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    title: string;
  };
  status: string;
  hireDate: string;
  phone?: string;
  address?: string;
  roles: string[]; // Make roles required, not optional
}

export const columns: ColumnDef<Employee>[] = [
  createSelectColumn<Employee>(),
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const employee = row.original;
      const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {`${employee.firstName} ${employee.lastName}`}
            </div>
            <div className="flex gap-1 mt-1">
              <RoleBadge user={employee} className="text-xs px-1.5 py-0 h-5" />
            </div>
          </div>
        </div>
      )
    },
  },
  createSortableColumn<Employee>("email", "Email"),
  {
    accessorKey: "department.name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Department <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const department = row.original.department.name;
      return (
        <div className="flex items-center">
          <DepartmentBadge departmentName={department} />
        </div>
      );
    },
  },
  {
    accessorKey: "position.title",
    header: "Job Title",
    cell: ({ row }) => {
      const position = row.original.position.title;
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
      let textAndBorderClass = "";

      if (status === "ACTIVE") {
        badgeVariant = "default";
      } else if (status === "ON_LEAVE") {
        badgeVariant = "default";
        textAndBorderClass = "text-yellow-700 bg-yellow-100/80 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-700/30 dark:border-yellow-600";
      } else {
        badgeVariant = "destructive";
      }

      return (
        <Badge
          variant={badgeVariant}
          className={`capitalize ${textAndBorderClass}`}
        >
          {status === "ACTIVE" ? "Active" :
           status === "ON_LEAVE" ? "On Leave" :
           "Terminated"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "hireDate",
    header: "Join Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("hireDate") as string)
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
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original

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
              <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('view-employee-profile', { detail: employee }))}>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  View Profile (Dialog)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/rh/employees/view/${employee.id}`}>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    View Profile (Full Page)
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('edit-employee', { detail: employee }))}>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                  Edit (Dialog)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/rh/employees/edit/${employee.id}`}>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                    Edit (Full Page)
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Related Sections</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/rh/leave?employeeId=${employee.id}`}>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
                    View Leave Requests
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('delete-employee', { detail: employee }))}>
                <span className="flex items-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                  Delete
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
