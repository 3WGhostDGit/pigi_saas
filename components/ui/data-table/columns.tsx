"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Helper function to create a column with a checkbox
export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

// Helper function to create a sortable column
export function createSortableColumn<T>(
  accessorKey: keyof T,
  header: string,
  enableSorting: boolean = true
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: ({ column }) => {
      return enableSorting ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {header}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        header
      )
    },
  }
}

// Helper function to create an actions column
export function createActionsColumn<T>(
  actions: {
    label: string
    onClick: (row: T) => void
  }[]
): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              type="button"
            >
              <MoreVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(item)}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
}

// Helper function to create a badge column
export function createBadgeColumn<T>(
  accessorKey: keyof T,
  header: string,
  getBadgeProps: (value: any) => {
    label: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string)
      const { label, variant = "outline" } = getBadgeProps(value)
      
      return (
        <div className="w-32">
          <div className={`inline-flex items-center rounded-md border py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 px-1.5 text-muted-foreground`}>
            {label}
          </div>
        </div>
      )
    },
  }
}

// Helper function to create a numeric column with right alignment
export function createNumericColumn<T>(
  accessorKey: keyof T,
  header: string,
  formatter?: (value: any) => string
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: () => <div className="w-full text-right">{header}</div>,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string)
      const formattedValue = formatter ? formatter(value) : value
      
      return <div className="w-full text-right">{formattedValue}</div>
    },
  }
}

// Helper function to create an editable column
export function createEditableColumn<T>(
  accessorKey: keyof T,
  header: string,
  onValueChange: (rowIndex: number, value: any) => void
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: header,
    cell: ({ row, table }) => {
      const rowIndex = row.index
      const value = row.getValue(accessorKey as string)
      
      return (
        <form>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only" htmlFor={`${rowIndex}-${accessorKey}`}>
            {header}
          </label>
          <input
            className="flex rounded-md border px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
            id={`${rowIndex}-${accessorKey}`}
            value={value as string}
            onChange={(e) => onValueChange(rowIndex, e.target.value)}
          />
        </form>
      )
    },
  }
}
