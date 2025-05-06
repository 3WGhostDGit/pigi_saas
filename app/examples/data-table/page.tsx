"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable, createSelectColumn, createSortableColumn, createActionsColumn, createBadgeColumn, createNumericColumn, createEditableColumn } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

// Define the data type
type Section = {
  id: string
  header: string
  sectionType: string
  target: number
  limit: number
  reviewer: string | null
}

export default function DataTableExample() {
  // Sample data
  const [data, setData] = useState<Section[]>([
    {
      id: "2",
      header: "Table of contents",
      sectionType: "Table of contents",
      target: 29,
      limit: 24,
      reviewer: "Eddie Lake"
    },
    {
      id: "3",
      header: "Executive summary",
      sectionType: "Narrative",
      target: 10,
      limit: 13,
      reviewer: "Eddie Lake"
    },
    {
      id: "4",
      header: "Technical approach",
      sectionType: "Narrative",
      target: 27,
      limit: 23,
      reviewer: "Jamik Tashpulatov"
    },
    {
      id: "1",
      header: "Cover page",
      sectionType: "Cover page",
      target: 18,
      limit: 5,
      reviewer: "Eddie Lake"
    },
    {
      id: "5",
      header: "Design",
      sectionType: "Narrative",
      target: 2,
      limit: 16,
      reviewer: "Jamik Tashpulatov"
    },
    {
      id: "6",
      header: "Capabilities",
      sectionType: "Narrative",
      target: 20,
      limit: 8,
      reviewer: "Jamik Tashpulatov"
    },
    {
      id: "7",
      header: "Integration with existing systems",
      sectionType: "Narrative",
      target: 19,
      limit: 21,
      reviewer: "Jamik Tashpulatov"
    },
    {
      id: "8",
      header: "Innovation and Advantages",
      sectionType: "Narrative",
      target: 25,
      limit: 26,
      reviewer: null
    },
    {
      id: "9",
      header: "Overview of EMR's Innovative Solutions",
      sectionType: "Technical content",
      target: 7,
      limit: 23,
      reviewer: null
    },
    {
      id: "10",
      header: "Advanced Algorithms and Machine Learning",
      sectionType: "Narrative",
      target: 30,
      limit: 28,
      reviewer: null
    }
  ])

  // Handle target value change
  const handleTargetChange = (rowIndex: number, value: any) => {
    const newData = [...data]
    newData[rowIndex].target = parseInt(value)
    setData(newData)
  }

  // Handle limit value change
  const handleLimitChange = (rowIndex: number, value: any) => {
    const newData = [...data]
    newData[rowIndex].limit = parseInt(value)
    setData(newData)
  }

  // Handle row reordering
  const handleRowReorder = (oldIndex: number, newIndex: number) => {
    const newData = [...data]
    const [movedItem] = newData.splice(oldIndex, 1)
    newData.splice(newIndex, 0, movedItem)
    setData(newData)
    toast.success(`Moved "${movedItem.header}" to position ${newIndex + 1}`)
  }

  // Define columns
  const columns: ColumnDef<Section>[] = [
    createSelectColumn<Section>(),
    createSortableColumn<Section>("header", "Header"),
    createBadgeColumn<Section>(
      "sectionType",
      "Section Type",
      (value) => ({ label: value })
    ),
    createNumericColumn<Section>("target", "Target"),
    createNumericColumn<Section>("limit", "Limit"),
    {
      accessorKey: "reviewer",
      header: "Reviewer",
      cell: ({ row }) => {
        const reviewer = row.getValue("reviewer") as string | null
        return reviewer || (
          <select
            className="flex items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 h-8 w-40"
          >
            <option value="">Assign reviewer</option>
            <option value="Eddie Lake">Eddie Lake</option>
            <option value="Jamik Tashpulatov">Jamik Tashpulatov</option>
          </select>
        )
      }
    },
    createActionsColumn<Section>([
      {
        label: "Edit Section",
        onClick: (row) => toast.info(`Editing ${row.header}`)
      },
      {
        label: "Delete Section",
        onClick: (row) => toast.error(`Deleting ${row.header}`)
      },
      {
        label: "View Details",
        onClick: (row) => toast.info(`Viewing details for ${row.header}`)
      }
    ])
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <h1 className="text-2xl font-bold">Document Sections</h1>
          <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
        
        <DataTable
          columns={columns}
          data={data}
          filterColumn="header"
          filterPlaceholder="Search sections..."
          onRowReorder={handleRowReorder}
        />
      </div>
    </div>
  )
}
