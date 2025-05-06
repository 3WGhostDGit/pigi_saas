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
import { Textarea } from "@/components/ui/textarea"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Download,
  Filter,
  Calendar,
  GraduationCap,
  Users,
  FileText,
  CheckCircle2,
  Clock
} from "lucide-react"

// Mock data for training programs
const trainingPrograms = [
  {
    id: "1",
    name: "Leadership Development",
    description: "Comprehensive leadership training for managers and team leads",
    provider: "LeadershipPro Academy",
    duration: 24, // hours
    cost: 1200,
    startDate: "2023-06-10",
    endDate: "2023-06-24",
    isMandatory: false,
    status: "ACTIVE",
    enrolledEmployees: 12,
    maxCapacity: 20
  },
  {
    id: "2",
    name: "Cybersecurity Fundamentals",
    description: "Essential cybersecurity training for all employees",
    provider: "SecureIT Training",
    duration: 8, // hours
    cost: 500,
    startDate: "2023-07-05",
    endDate: "2023-07-05",
    isMandatory: true,
    status: "ACTIVE",
    enrolledEmployees: 45,
    maxCapacity: 50
  },
  {
    id: "3",
    name: "Project Management Certification",
    description: "Preparation for PMP certification",
    provider: "PM Institute",
    duration: 35, // hours
    cost: 1800,
    startDate: "2023-08-14",
    endDate: "2023-08-25",
    isMandatory: false,
    status: "UPCOMING",
    enrolledEmployees: 8,
    maxCapacity: 15
  },
  {
    id: "4",
    name: "Customer Service Excellence",
    description: "Advanced customer service skills for front-line staff",
    provider: "CustomerFirst Training",
    duration: 16, // hours
    cost: 750,
    startDate: "2023-05-15",
    endDate: "2023-05-16",
    isMandatory: false,
    status: "COMPLETED",
    enrolledEmployees: 18,
    maxCapacity: 20
  },
  {
    id: "5",
    name: "Workplace Safety",
    description: "Annual workplace safety and compliance training",
    provider: "SafeWork Consultants",
    duration: 4, // hours
    cost: 300,
    startDate: "2023-04-10",
    endDate: "2023-04-10",
    isMandatory: true,
    status: "COMPLETED",
    enrolledEmployees: 78,
    maxCapacity: 80
  },
]

// Mock data for employee trainings
const employeeTrainings = [
  {
    id: "1",
    employee: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    trainingId: "2",
    trainingName: "Cybersecurity Fundamentals",
    status: "COMPLETED",
    completionDate: "2023-07-05",
    score: 92,
    certificateUrl: "https://example.com/certificates/john-doe-cyber"
  },
  {
    id: "2",
    employee: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    trainingId: "1",
    trainingName: "Leadership Development",
    status: "IN_PROGRESS",
    completionDate: null,
    score: null,
    certificateUrl: null
  },
  {
    id: "3",
    employee: "Robert Johnson",
    employeeId: "EMP003",
    department: "Finance",
    trainingId: "4",
    trainingName: "Customer Service Excellence",
    status: "COMPLETED",
    completionDate: "2023-05-16",
    score: 88,
    certificateUrl: "https://example.com/certificates/robert-johnson-cs"
  },
  {
    id: "4",
    employee: "Emily Davis",
    employeeId: "EMP004",
    department: "Human Resources",
    trainingId: "3",
    trainingName: "Project Management Certification",
    status: "PLANNED",
    completionDate: null,
    score: null,
    certificateUrl: null
  },
  {
    id: "5",
    employee: "Michael Wilson",
    employeeId: "EMP005",
    department: "Sales",
    trainingId: "5",
    trainingName: "Workplace Safety",
    status: "COMPLETED",
    completionDate: "2023-04-10",
    score: 95,
    certificateUrl: "https://example.com/certificates/michael-wilson-safety"
  },
]

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch(status) {
    case 'ACTIVE':
      return <Badge className="bg-green-600">Active</Badge>
    case 'UPCOMING':
      return <Badge className="bg-blue-600">Upcoming</Badge>
    case 'COMPLETED':
      return <Badge>Completed</Badge>
    case 'CANCELLED':
      return <Badge variant="outline" className="text-red-600 border-red-600">Cancelled</Badge>
    case 'IN_PROGRESS':
      return <Badge className="bg-yellow-600">In Progress</Badge>
    case 'PLANNED':
      return <Badge variant="outline">Planned</Badge>
    case 'FAILED':
      return <Badge variant="outline" className="text-red-600 border-red-600">Failed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('programs')
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false)
  const [isEnrollEmployeeOpen, setIsEnrollEmployeeOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [selectedEmployeeTraining, setSelectedEmployeeTraining] = useState(null)

  // Filter training programs based on search term
  const filteredPrograms = trainingPrograms.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter employee trainings based on search term
  const filteredEmployeeTrainings = employeeTrainings.filter(training =>
    training.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.trainingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewTrainingDetails = (training) => {
    setSelectedTraining(training)
    setSelectedEmployeeTraining(null)
    setIsViewDetailsOpen(true)
  }

  const handleViewEmployeeTrainingDetails = (training) => {
    setSelectedEmployeeTraining(training)
    setSelectedTraining(null)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Training & Development</h2>
        <div className="flex items-center space-x-2">
          {activeTab === 'programs' ? (
            <Dialog open={isAddTrainingOpen} onOpenChange={setIsAddTrainingOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Training Program
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>New Training Program</DialogTitle>
                  <DialogDescription>
                    Fill in the training program details. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Training Name</Label>
                    <Input id="name" placeholder="Enter training name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter training description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <Input id="provider" placeholder="Training provider" />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Input id="duration" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost">Cost</Label>
                      <Input id="cost" type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                      <Input id="maxCapacity" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isMandatory" className="h-4 w-4" />
                    <Label htmlFor="isMandatory">Mandatory Training</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTrainingOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isEnrollEmployeeOpen} onOpenChange={setIsEnrollEmployeeOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Enroll Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Enroll Employee in Training</DialogTitle>
                  <DialogDescription>
                    Select an employee and a training program. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="employee">Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp001">John Doe</SelectItem>
                        <SelectItem value="emp002">Jane Smith</SelectItem>
                        <SelectItem value="emp003">Robert Johnson</SelectItem>
                        <SelectItem value="emp004">Emily Davis</SelectItem>
                        <SelectItem value="emp005">Michael Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="training">Training Program</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select training program" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainingPrograms.map(program => (
                          <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="PLANNED">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANNED">Planned</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Additional notes" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEnrollEmployeeOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue="programs" onValueChange={setActiveTab}>
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="programs">Training Programs</TabsTrigger>
            <TabsTrigger value="employees">Employee Trainings</TabsTrigger>
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
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell>{program.provider}</TableCell>
                      <TableCell>{program.duration} hours</TableCell>
                      <TableCell>
                        {new Date(program.startDate).toLocaleDateString('en-US')} - {new Date(program.endDate).toLocaleDateString('en-US')}
                      </TableCell>
                      <TableCell>
                        {program.enrolledEmployees}/{program.maxCapacity}
                      </TableCell>
                      <TableCell>
                        {program.isMandatory ? (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(program.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewTrainingDetails(program)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Participants
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
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
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Training</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployeeTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.employee}</TableCell>
                      <TableCell>{training.department}</TableCell>
                      <TableCell>{training.trainingName}</TableCell>
                      <TableCell>{getStatusBadge(training.status)}</TableCell>
                      <TableCell>
                        {training.completionDate ? new Date(training.completionDate).toLocaleDateString('en-US') : '-'}
                      </TableCell>
                      <TableCell>{training.score ? `${training.score}%` : '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewEmployeeTrainingDetails(training)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            {training.status === 'COMPLETED' && (
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Certificate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
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
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTraining ? 'Training Program Details' : 'Employee Training Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium text-sm">Training Name</h3>
                <p className="text-base">{selectedTraining.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p className="text-sm">{selectedTraining.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Provider</h3>
                  <p>{selectedTraining.provider}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Duration</h3>
                  <p>{selectedTraining.duration} hours</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Start Date</h3>
                  <p>{new Date(selectedTraining.startDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">End Date</h3>
                  <p>{new Date(selectedTraining.endDate).toLocaleDateString('en-US')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Cost</h3>
                  <p>${selectedTraining.cost.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Enrollment</h3>
                  <p>{selectedTraining.enrolledEmployees}/{selectedTraining.maxCapacity}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  {getStatusBadge(selectedTraining.status)}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Mandatory</h3>
                <p>{selectedTraining.isMandatory ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
          {selectedEmployeeTraining && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Employee</h3>
                  <p>{selectedEmployeeTraining.employee}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Employee ID</h3>
                  <p>{selectedEmployeeTraining.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Department</h3>
                  <p>{selectedEmployeeTraining.department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Training</h3>
                  <p>{selectedEmployeeTraining.trainingName}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  {getStatusBadge(selectedEmployeeTraining.status)}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Completion Date</h3>
                  <p>{selectedEmployeeTraining.completionDate ? new Date(selectedEmployeeTraining.completionDate).toLocaleDateString('en-US') : 'Not completed'}</p>
                </div>
              </div>
              {selectedEmployeeTraining.status === 'COMPLETED' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm">Score</h3>
                    <p>{selectedEmployeeTraining.score}%</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Certificate</h3>
                    {selectedEmployeeTraining.certificateUrl ? (
                      <a href={selectedEmployeeTraining.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Certificate
                      </a>
                    ) : (
                      <p>No certificate available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {selectedTraining && (
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Manage Participants
              </Button>
            )}
            {selectedEmployeeTraining && selectedEmployeeTraining.status === 'COMPLETED' && selectedEmployeeTraining.certificateUrl && (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
