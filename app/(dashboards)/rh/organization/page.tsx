'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  PlusCircle, 
  MoreHorizontal, 
  FileEdit, 
  Trash2, 
  Users, 
  Building, 
  Briefcase 
} from "lucide-react"

// Mock data for departments
const departments = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development and technical operations",
    manager: "John Doe",
    employeeCount: 25,
  },
  {
    id: "2",
    name: "Marketing",
    description: "Brand management and marketing campaigns",
    manager: "Jane Smith",
    employeeCount: 12,
  },
  {
    id: "3",
    name: "Finance",
    description: "Financial planning and accounting",
    manager: "Robert Johnson",
    employeeCount: 8,
  },
  {
    id: "4",
    name: "Human Resources",
    description: "Employee management and recruitment",
    manager: "Emily Davis",
    employeeCount: 6,
  },
  {
    id: "5",
    name: "Sales",
    description: "Client acquisition and relationship management",
    manager: "Michael Wilson",
    employeeCount: 15,
  },
]

// Mock data for positions
const positions = [
  {
    id: "1",
    title: "Software Engineer",
    department: "Engineering",
    employeeCount: 12,
  },
  {
    id: "2",
    title: "Marketing Specialist",
    department: "Marketing",
    employeeCount: 5,
  },
  {
    id: "3",
    title: "Financial Analyst",
    department: "Finance",
    employeeCount: 4,
  },
  {
    id: "4",
    title: "HR Specialist",
    department: "Human Resources",
    employeeCount: 3,
  },
  {
    id: "5",
    title: "Sales Representative",
    department: "Sales",
    employeeCount: 8,
  },
]

export default function OrganizationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false)
  const [isViewDepartmentOpen, setIsViewDepartmentOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  
  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.manager.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter positions based on search term
  const filteredPositions = positions.filter(position => 
    position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department)
    setIsViewDepartmentOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Organization</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Fill in the department details. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input id="name" placeholder="Engineering" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Software development and technical operations" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Department Manager</Label>
                  <Input id="manager" placeholder="Select a manager" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDepartmentOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="departments" className="space-y-4">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="orgChart">Org Chart</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.description}</TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell>{department.employeeCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDepartment(department)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Employees
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="positions" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Dialog open={isAddPositionOpen} onOpenChange={setIsAddPositionOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Position
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Position</DialogTitle>
                  <DialogDescription>
                    Fill in the position details. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Position Title</Label>
                    <Input id="title" placeholder="Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Select a department" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPositionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddPositionOpen(false)}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.title}</TableCell>
                      <TableCell>{position.department}</TableCell>
                      <TableCell>{position.employeeCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Employees
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orgChart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Chart</CardTitle>
              <CardDescription>
                Visual representation of the company structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[400px]">
                <div className="text-center">
                  <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Organization chart visualization will be implemented here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Department Details Dialog */}
      <Dialog open={isViewDepartmentOpen} onOpenChange={setIsViewDepartmentOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Department Name</h3>
                  <p className="text-lg font-semibold">{selectedDepartment.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Manager</h3>
                  <p>{selectedDepartment.manager}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p>{selectedDepartment.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Employees ({selectedDepartment.employeeCount})</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Mock employee data for the selected department */}
                        <TableRow>
                          <TableCell className="font-medium">John Smith</TableCell>
                          <TableCell>Senior Developer</TableCell>
                          <TableCell>john.smith@example.com</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sarah Johnson</TableCell>
                          <TableCell>Developer</TableCell>
                          <TableCell>sarah.johnson@example.com</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Michael Brown</TableCell>
                          <TableCell>QA Engineer</TableCell>
                          <TableCell>michael.brown@example.com</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDepartmentOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
