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
  Star,
  TrendingUp,
  Award,
  FileText
} from "lucide-react"

// Mock data for performance reviews
const performanceReviews = [
  {
    id: "1",
    employee: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    reviewDate: "2023-04-15",
    periodStart: "2022-10-01",
    periodEnd: "2023-03-31",
    rating: "EXCEEDS_EXPECTATIONS",
    reviewer: "Alice Johnson",
    status: "COMPLETED",
    strengths: "Technical expertise, problem-solving, mentoring junior developers",
    weaknesses: "Documentation could be improved, sometimes takes on too many tasks",
    goals: "Improve documentation practices, lead a major project, mentor two junior developers"
  },
  {
    id: "2",
    employee: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    position: "Marketing Manager",
    reviewDate: "2023-04-12",
    periodStart: "2022-10-01",
    periodEnd: "2023-03-31",
    rating: "OUTSTANDING",
    reviewer: "Robert Brown",
    status: "COMPLETED",
    strengths: "Campaign management, team leadership, creative direction",
    weaknesses: "Could delegate more tasks, sometimes misses minor details",
    goals: "Launch international campaign, improve team efficiency by 15%, develop new marketing strategy"
  },
  {
    id: "3",
    employee: "Robert Johnson",
    employeeId: "EMP003",
    department: "Finance",
    position: "Financial Analyst",
    reviewDate: "2023-04-18",
    periodStart: "2022-10-01",
    periodEnd: "2023-03-31",
    rating: "MEETS_EXPECTATIONS",
    reviewer: "Sarah Williams",
    status: "COMPLETED",
    strengths: "Analytical skills, attention to detail, regulatory compliance",
    weaknesses: "Communication with non-finance departments, presentation skills",
    goals: "Improve cross-department communication, develop presentation skills, complete advanced certification"
  },
  {
    id: "4",
    employee: "Emily Davis",
    employeeId: "EMP004",
    department: "Human Resources",
    position: "HR Specialist",
    reviewDate: null,
    periodStart: "2022-10-01",
    periodEnd: "2023-03-31",
    rating: null,
    reviewer: "Michael Wilson",
    status: "PENDING",
    strengths: "",
    weaknesses: "",
    goals: ""
  },
  {
    id: "5",
    employee: "Michael Wilson",
    employeeId: "EMP005",
    department: "Sales",
    position: "Sales Representative",
    reviewDate: null,
    periodStart: "2022-10-01",
    periodEnd: "2023-03-31",
    rating: null,
    reviewer: "David Thompson",
    status: "PENDING",
    strengths: "",
    weaknesses: "",
    goals: ""
  },
]

// Helper function to get rating badge color
const getRatingBadge = (rating) => {
  switch(rating) {
    case 'OUTSTANDING':
      return <Badge className="bg-green-600">Outstanding</Badge>
    case 'EXCEEDS_EXPECTATIONS':
      return <Badge className="bg-blue-600">Exceeds Expectations</Badge>
    case 'MEETS_EXPECTATIONS':
      return <Badge>Meets Expectations</Badge>
    case 'NEEDS_IMPROVEMENT':
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Needs Improvement</Badge>
    case 'POOR':
      return <Badge variant="outline" className="text-red-600 border-red-600">Poor</Badge>
    default:
      return <Badge variant="outline">Not Rated</Badge>
  }
}

export default function PerformancePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  
  // Filter reviews based on search term
  const filteredReviews = performanceReviews.filter(review => 
    review.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (review.rating && review.rating.toLowerCase().includes(searchTerm.toLowerCase())) ||
    review.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (review) => {
    setSelectedReview(review)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Performance Management</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                New Performance Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Performance Review</DialogTitle>
                <DialogDescription>
                  Fill in the performance review details. Click submit when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="reviewer">Reviewer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rev001">Alice Johnson</SelectItem>
                        <SelectItem value="rev002">Robert Brown</SelectItem>
                        <SelectItem value="rev003">Sarah Williams</SelectItem>
                        <SelectItem value="rev004">David Thompson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="reviewDate">Review Date</Label>
                    <Input id="reviewDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="periodStart">Period Start</Label>
                    <Input id="periodStart" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="periodEnd">Period End</Label>
                    <Input id="periodEnd" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OUTSTANDING">Outstanding</SelectItem>
                      <SelectItem value="EXCEEDS_EXPECTATIONS">Exceeds Expectations</SelectItem>
                      <SelectItem value="MEETS_EXPECTATIONS">Meets Expectations</SelectItem>
                      <SelectItem value="NEEDS_IMPROVEMENT">Needs Improvement</SelectItem>
                      <SelectItem value="POOR">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="strengths">Strengths</Label>
                  <Textarea id="strengths" placeholder="Employee's strengths" />
                </div>
                <div>
                  <Label htmlFor="weaknesses">Areas for Improvement</Label>
                  <Textarea id="weaknesses" placeholder="Areas where employee can improve" />
                </div>
                <div>
                  <Label htmlFor="goals">Goals for Next Period</Label>
                  <Textarea id="goals" placeholder="Goals for the next review period" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddReviewOpen(false)}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reviews..."
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
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Review Date</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.employee}</TableCell>
                      <TableCell>{review.department}</TableCell>
                      <TableCell>{review.position}</TableCell>
                      <TableCell>{review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'Not scheduled'}</TableCell>
                      <TableCell>{review.rating ? getRatingBadge(review.rating) : 'Not rated'}</TableCell>
                      <TableCell>{review.reviewer}</TableCell>
                      <TableCell>
                        <Badge variant={review.status === 'COMPLETED' ? 'default' : 'outline'}>
                          {review.status}
                        </Badge>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(review)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {review.status === 'COMPLETED' && (
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                            )}
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
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Review Period</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews
                    .filter(review => review.status === 'PENDING')
                    .map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.employee}</TableCell>
                        <TableCell>{review.department}</TableCell>
                        <TableCell>{review.position}</TableCell>
                        <TableCell>
                          {new Date(review.periodStart).toLocaleDateString()} - {new Date(review.periodEnd).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{review.reviewer}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">
                            <FileEdit className="mr-2 h-4 w-4" />
                            Complete Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Review Date</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews
                    .filter(review => review.status === 'COMPLETED')
                    .map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.employee}</TableCell>
                        <TableCell>{review.department}</TableCell>
                        <TableCell>{new Date(review.reviewDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getRatingBadge(review.rating)}</TableCell>
                        <TableCell>{review.reviewer}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(review)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Review Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Performance Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Employee</h3>
                  <p>{selectedReview.employee}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Employee ID</h3>
                  <p>{selectedReview.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Department</h3>
                  <p>{selectedReview.department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Position</h3>
                  <p>{selectedReview.position}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Review Date</h3>
                  <p>{selectedReview.reviewDate ? new Date(selectedReview.reviewDate).toLocaleDateString() : 'Not scheduled'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Period Start</h3>
                  <p>{new Date(selectedReview.periodStart).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Period End</h3>
                  <p>{new Date(selectedReview.periodEnd).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Reviewer</h3>
                  <p>{selectedReview.reviewer}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Rating</h3>
                  {selectedReview.rating ? getRatingBadge(selectedReview.rating) : <Badge variant="outline">Not Rated</Badge>}
                </div>
              </div>
              {selectedReview.status === 'COMPLETED' && (
                <>
                  <div>
                    <h3 className="font-medium text-sm">Strengths</h3>
                    <p className="mt-1 text-sm">{selectedReview.strengths}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Areas for Improvement</h3>
                    <p className="mt-1 text-sm">{selectedReview.weaknesses}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Goals for Next Period</h3>
                    <p className="mt-1 text-sm">{selectedReview.goals}</p>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {selectedReview && selectedReview.status === 'COMPLETED' && (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
