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
  Gift,
  Users,
  FileText,
  CheckCircle2,
  DollarSign,
  Calendar
} from "lucide-react"

// Mock data for benefits
const benefits = [
  {
    id: "1",
    name: "Health Insurance",
    description: "Comprehensive health insurance plan covering medical, dental, and vision",
    provider: "MediCare Plus",
    costPerMonth: 350,
    employeeContribution: 50,
    companyContribution: 300,
    isActive: true,
    enrolledEmployees: 145,
    category: "HEALTH"
  },
  {
    id: "2",
    name: "Retirement Plan",
    description: "401(k) retirement savings plan with company matching",
    provider: "RetireWell Financial",
    costPerMonth: 0,
    employeeContribution: null,
    companyContribution: null,
    isActive: true,
    enrolledEmployees: 120,
    category: "FINANCIAL"
  },
  {
    id: "3",
    name: "Meal Vouchers",
    description: "Monthly meal vouchers for lunch and snacks",
    provider: "FoodBenefits Inc.",
    costPerMonth: 200,
    employeeContribution: 50,
    companyContribution: 150,
    isActive: true,
    enrolledEmployees: 152,
    category: "LIFESTYLE"
  },
  {
    id: "4",
    name: "Gym Membership",
    description: "Discounted gym membership at partner fitness centers",
    provider: "FitLife Gyms",
    costPerMonth: 80,
    employeeContribution: 30,
    companyContribution: 50,
    isActive: true,
    enrolledEmployees: 78,
    category: "WELLNESS"
  },
  {
    id: "5",
    name: "Professional Development",
    description: "Annual budget for courses, certifications, and conferences",
    provider: "Internal",
    costPerMonth: 0,
    employeeContribution: 0,
    companyContribution: 1500,
    isActive: true,
    enrolledEmployees: 95,
    category: "DEVELOPMENT"
  },
]

// Mock data for employee benefits
const employeeBenefits = [
  {
    id: "1",
    employee: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    benefitId: "1",
    benefitName: "Health Insurance",
    startDate: "2022-06-01",
    endDate: null,
    status: "ACTIVE",
    planLevel: "Family",
    notes: "Includes spouse and two children"
  },
  {
    id: "2",
    employee: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    benefitId: "3",
    benefitName: "Meal Vouchers",
    startDate: "2022-06-01",
    endDate: null,
    status: "ACTIVE",
    planLevel: "Standard",
    notes: ""
  },
  {
    id: "3",
    employee: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    benefitId: "1",
    benefitName: "Health Insurance",
    startDate: "2022-08-15",
    endDate: null,
    status: "ACTIVE",
    planLevel: "Individual",
    notes: ""
  },
  {
    id: "4",
    employee: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    benefitId: "4",
    benefitName: "Gym Membership",
    startDate: "2022-09-01",
    endDate: null,
    status: "ACTIVE",
    planLevel: "Premium",
    notes: "Includes personal training sessions"
  },
  {
    id: "5",
    employee: "Robert Johnson",
    employeeId: "EMP003",
    department: "Finance",
    benefitId: "2",
    benefitName: "Retirement Plan",
    startDate: "2023-01-01",
    endDate: null,
    status: "ACTIVE",
    planLevel: "Standard",
    notes: "6% contribution with company match"
  },
]

// Helper function to get category badge
const getCategoryBadge = (category) => {
  switch(category) {
    case 'HEALTH':
      return <Badge className="bg-blue-600">Health</Badge>
    case 'FINANCIAL':
      return <Badge className="bg-green-600">Financial</Badge>
    case 'LIFESTYLE':
      return <Badge className="bg-purple-600">Lifestyle</Badge>
    case 'WELLNESS':
      return <Badge className="bg-yellow-600">Wellness</Badge>
    case 'DEVELOPMENT':
      return <Badge className="bg-pink-600">Development</Badge>
    default:
      return <Badge>{category}</Badge>
  }
}

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch(status) {
    case 'ACTIVE':
      return <Badge className="bg-green-600">Active</Badge>
    case 'INACTIVE':
      return <Badge variant="outline" className="text-gray-600 border-gray-300">Inactive</Badge>
    case 'PENDING':
      return <Badge className="bg-yellow-600">Pending</Badge>
    case 'EXPIRED':
      return <Badge variant="outline" className="text-red-600 border-red-600">Expired</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function BenefitsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('benefits')
  const [isAddBenefitOpen, setIsAddBenefitOpen] = useState(false)
  const [isEnrollEmployeeOpen, setIsEnrollEmployeeOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [selectedEmployeeBenefit, setSelectedEmployeeBenefit] = useState(null)
  
  // Filter benefits based on search term
  const filteredBenefits = benefits.filter(benefit => 
    benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter employee benefits based on search term
  const filteredEmployeeBenefits = employeeBenefits.filter(benefit => 
    benefit.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.benefitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewBenefitDetails = (benefit) => {
    setSelectedBenefit(benefit)
    setSelectedEmployeeBenefit(null)
    setIsViewDetailsOpen(true)
  }

  const handleViewEmployeeBenefitDetails = (benefit) => {
    setSelectedEmployeeBenefit(benefit)
    setSelectedBenefit(null)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employee Benefits</h2>
        <div className="flex items-center space-x-2">
          {activeTab === 'benefits' ? (
            <Dialog open={isAddBenefitOpen} onOpenChange={setIsAddBenefitOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Benefit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>New Benefit</DialogTitle>
                  <DialogDescription>
                    Fill in the benefit details. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Benefit Name</Label>
                    <Input id="name" placeholder="Enter benefit name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter benefit description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <Input id="provider" placeholder="Benefit provider" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HEALTH">Health</SelectItem>
                          <SelectItem value="FINANCIAL">Financial</SelectItem>
                          <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                          <SelectItem value="WELLNESS">Wellness</SelectItem>
                          <SelectItem value="DEVELOPMENT">Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="costPerMonth">Total Cost/Month</Label>
                      <Input id="costPerMonth" type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="employeeContribution">Employee Contribution</Label>
                      <Input id="employeeContribution" type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="companyContribution">Company Contribution</Label>
                      <Input id="companyContribution" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isActive" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="isActive">Active Benefit</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddBenefitOpen(false)}>Cancel</Button>
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
                  <DialogTitle>Enroll Employee in Benefit</DialogTitle>
                  <DialogDescription>
                    Select an employee and a benefit. Click submit when you're done.
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
                    <Label htmlFor="benefit">Benefit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select benefit" />
                      </SelectTrigger>
                      <SelectContent>
                        {benefits.map(benefit => (
                          <SelectItem key={benefit.id} value={benefit.id}>{benefit.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="planLevel">Plan Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
      <Tabs defaultValue="benefits" onValueChange={setActiveTab}>
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="benefits">Benefit Plans</TabsTrigger>
            <TabsTrigger value="enrollments">Employee Enrollments</TabsTrigger>
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
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benefit Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Cost/Month</TableHead>
                    <TableHead className="text-right">Employee Pays</TableHead>
                    <TableHead className="text-right">Company Pays</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBenefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell className="font-medium">{benefit.name}</TableCell>
                      <TableCell>{benefit.provider}</TableCell>
                      <TableCell>{getCategoryBadge(benefit.category)}</TableCell>
                      <TableCell className="text-right">
                        {benefit.costPerMonth ? `$${benefit.costPerMonth.toLocaleString()}` : 'Varies'}
                      </TableCell>
                      <TableCell className="text-right">
                        {benefit.employeeContribution !== null ? `$${benefit.employeeContribution.toLocaleString()}` : 'Varies'}
                      </TableCell>
                      <TableCell className="text-right">
                        {benefit.companyContribution !== null ? `$${benefit.companyContribution.toLocaleString()}` : 'Varies'}
                      </TableCell>
                      <TableCell>{benefit.enrolledEmployees}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewBenefitDetails(benefit)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Enrollments
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
        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Benefit</TableHead>
                    <TableHead>Plan Level</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployeeBenefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell className="font-medium">{benefit.employee}</TableCell>
                      <TableCell>{benefit.department}</TableCell>
                      <TableCell>{benefit.benefitName}</TableCell>
                      <TableCell>{benefit.planLevel}</TableCell>
                      <TableCell>{new Date(benefit.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(benefit.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewEmployeeBenefitDetails(benefit)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit Enrollment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel Enrollment
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
              {selectedBenefit ? 'Benefit Plan Details' : 'Employee Benefit Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedBenefit && (
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium text-sm">Benefit Name</h3>
                <p className="text-base">{selectedBenefit.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p className="text-sm">{selectedBenefit.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Provider</h3>
                  <p>{selectedBenefit.provider}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Category</h3>
                  {getCategoryBadge(selectedBenefit.category)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Total Cost/Month</h3>
                  <p>{selectedBenefit.costPerMonth ? `$${selectedBenefit.costPerMonth.toLocaleString()}` : 'Varies'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Employee Pays</h3>
                  <p>{selectedBenefit.employeeContribution !== null ? `$${selectedBenefit.employeeContribution.toLocaleString()}` : 'Varies'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Company Pays</h3>
                  <p>{selectedBenefit.companyContribution !== null ? `$${selectedBenefit.companyContribution.toLocaleString()}` : 'Varies'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  <p>{selectedBenefit.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Enrolled Employees</h3>
                  <p>{selectedBenefit.enrolledEmployees}</p>
                </div>
              </div>
            </div>
          )}
          {selectedEmployeeBenefit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Employee</h3>
                  <p>{selectedEmployeeBenefit.employee}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Employee ID</h3>
                  <p>{selectedEmployeeBenefit.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Department</h3>
                  <p>{selectedEmployeeBenefit.department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Benefit</h3>
                  <p>{selectedEmployeeBenefit.benefitName}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Start Date</h3>
                  <p>{new Date(selectedEmployeeBenefit.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">End Date</h3>
                  <p>{selectedEmployeeBenefit.endDate ? new Date(selectedEmployeeBenefit.endDate).toLocaleDateString() : 'Ongoing'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  {getStatusBadge(selectedEmployeeBenefit.status)}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Plan Level</h3>
                <p>{selectedEmployeeBenefit.planLevel}</p>
              </div>
              {selectedEmployeeBenefit.notes && (
                <div>
                  <h3 className="font-medium text-sm">Notes</h3>
                  <p className="text-sm">{selectedEmployeeBenefit.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {selectedBenefit && (
              <Button>
                <Users className="mr-2 h-4 w-4" />
                View Enrollments
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
