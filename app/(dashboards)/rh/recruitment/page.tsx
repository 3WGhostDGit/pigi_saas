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
  Briefcase,
  Users,
  FileText,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  Star
} from "lucide-react"

// Mock data for job openings
const jobOpenings = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Paris, France",
    type: "FULL_TIME",
    status: "OPEN",
    postedDate: "2023-05-15",
    closingDate: "2023-06-30",
    salary: "€70,000 - €90,000",
    description: "We are looking for an experienced software engineer to join our team...",
    requirements: "5+ years of experience in software development, proficiency in JavaScript...",
    responsibilities: "Design and implement new features, collaborate with cross-functional teams...",
    applicantsCount: 24,
    hiringManager: "Alice Johnson"
  },
  {
    id: "2",
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Lyon, France",
    type: "FULL_TIME",
    status: "OPEN",
    postedDate: "2023-05-20",
    closingDate: "2023-06-25",
    salary: "€45,000 - €55,000",
    description: "Join our marketing team to help develop and execute marketing strategies...",
    requirements: "3+ years of experience in digital marketing, knowledge of SEO/SEM...",
    responsibilities: "Create and manage marketing campaigns, analyze market trends...",
    applicantsCount: 18,
    hiringManager: "Robert Brown"
  },
  {
    id: "3",
    title: "Financial Analyst",
    department: "Finance",
    location: "Paris, France",
    type: "FULL_TIME",
    status: "OPEN",
    postedDate: "2023-05-25",
    closingDate: "2023-07-10",
    salary: "€50,000 - €65,000",
    description: "We're seeking a detail-oriented financial analyst to join our finance team...",
    requirements: "Bachelor's degree in Finance or related field, 2+ years of experience...",
    responsibilities: "Prepare financial reports, analyze financial data, support budgeting process...",
    applicantsCount: 12,
    hiringManager: "Sarah Williams"
  },
  {
    id: "4",
    title: "HR Assistant",
    department: "Human Resources",
    location: "Paris, France",
    type: "PART_TIME",
    status: "OPEN",
    postedDate: "2023-06-01",
    closingDate: "2023-06-20",
    salary: "€30,000 - €35,000",
    description: "Looking for an HR assistant to support our HR team with daily operations...",
    requirements: "Bachelor's degree in HR or related field, 1+ year of experience...",
    responsibilities: "Assist with recruitment process, maintain employee records...",
    applicantsCount: 9,
    hiringManager: "Michael Wilson"
  },
  {
    id: "5",
    title: "Sales Representative",
    department: "Sales",
    location: "Marseille, France",
    type: "FULL_TIME",
    status: "CLOSED",
    postedDate: "2023-04-10",
    closingDate: "2023-05-10",
    salary: "€40,000 - €50,000 + Commission",
    description: "Join our sales team to help expand our client base and increase revenue...",
    requirements: "2+ years of sales experience, excellent communication skills...",
    responsibilities: "Identify and pursue sales opportunities, maintain client relationships...",
    applicantsCount: 32,
    hiringManager: "David Thompson"
  },
]

// Mock data for candidates
const candidates = [
  {
    id: "1",
    firstName: "Thomas",
    lastName: "Martin",
    email: "thomas.martin@example.com",
    phone: "+33 6 12 34 56 78",
    jobId: "1",
    jobTitle: "Senior Software Engineer",
    status: "INTERVIEW",
    appliedDate: "2023-05-18",
    resumeUrl: "https://example.com/resumes/thomas_martin.pdf",
    coverLetterUrl: "https://example.com/cover_letters/thomas_martin.pdf",
    rating: 4,
    notes: "Strong technical background, 7 years of experience in full-stack development",
    interviewDate: "2023-06-05"
  },
  {
    id: "2",
    firstName: "Sophie",
    lastName: "Dubois",
    email: "sophie.dubois@example.com",
    phone: "+33 6 23 45 67 89",
    jobId: "2",
    jobTitle: "Marketing Specialist",
    status: "REVIEW",
    appliedDate: "2023-05-22",
    resumeUrl: "https://example.com/resumes/sophie_dubois.pdf",
    coverLetterUrl: "https://example.com/cover_letters/sophie_dubois.pdf",
    rating: 3,
    notes: "4 years of experience in digital marketing, good knowledge of social media strategies",
    interviewDate: null
  },
  {
    id: "3",
    firstName: "Pierre",
    lastName: "Leroy",
    email: "pierre.leroy@example.com",
    phone: "+33 6 34 56 78 90",
    jobId: "1",
    jobTitle: "Senior Software Engineer",
    status: "HIRED",
    appliedDate: "2023-05-16",
    resumeUrl: "https://example.com/resumes/pierre_leroy.pdf",
    coverLetterUrl: "https://example.com/cover_letters/pierre_leroy.pdf",
    rating: 5,
    notes: "Excellent technical skills, 8 years of experience, great cultural fit",
    interviewDate: "2023-05-25"
  },
  {
    id: "4",
    firstName: "Marie",
    lastName: "Petit",
    email: "marie.petit@example.com",
    phone: "+33 6 45 67 89 01",
    jobId: "3",
    jobTitle: "Financial Analyst",
    status: "REJECTED",
    appliedDate: "2023-05-27",
    resumeUrl: "https://example.com/resumes/marie_petit.pdf",
    coverLetterUrl: "https://example.com/cover_letters/marie_petit.pdf",
    rating: 2,
    notes: "Limited experience in financial analysis, not a good match for the position",
    interviewDate: null
  },
  {
    id: "5",
    firstName: "Jean",
    lastName: "Bernard",
    email: "jean.bernard@example.com",
    phone: "+33 6 56 78 90 12",
    jobId: "4",
    jobTitle: "HR Assistant",
    status: "NEW",
    appliedDate: "2023-06-02",
    resumeUrl: "https://example.com/resumes/jean_bernard.pdf",
    coverLetterUrl: "https://example.com/cover_letters/jean_bernard.pdf",
    rating: null,
    notes: "",
    interviewDate: null
  },
]

// Helper function to get job type badge
const getJobTypeBadge = (type) => {
  switch(type) {
    case 'FULL_TIME':
      return <Badge className="bg-blue-600">Full Time</Badge>
    case 'PART_TIME':
      return <Badge className="bg-purple-600">Part Time</Badge>
    case 'CONTRACT':
      return <Badge className="bg-yellow-600">Contract</Badge>
    case 'INTERNSHIP':
      return <Badge className="bg-green-600">Internship</Badge>
    default:
      return <Badge>{type}</Badge>
  }
}

// Helper function to get job status badge
const getJobStatusBadge = (status) => {
  switch(status) {
    case 'OPEN':
      return <Badge className="bg-green-600">Open</Badge>
    case 'CLOSED':
      return <Badge variant="outline" className="text-gray-600 border-gray-300">Closed</Badge>
    case 'DRAFT':
      return <Badge variant="outline">Draft</Badge>
    case 'ON_HOLD':
      return <Badge className="bg-yellow-600">On Hold</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// Helper function to get candidate status badge
const getCandidateStatusBadge = (status) => {
  switch(status) {
    case 'NEW':
      return <Badge className="bg-blue-600">New</Badge>
    case 'REVIEW':
      return <Badge className="bg-yellow-600">In Review</Badge>
    case 'INTERVIEW':
      return <Badge className="bg-purple-600">Interview</Badge>
    case 'HIRED':
      return <Badge className="bg-green-600">Hired</Badge>
    case 'REJECTED':
      return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function RecruitmentPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('jobs')
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  // Filter job openings based on search term
  const filteredJobs = jobOpenings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewJobDetails = (job) => {
    setSelectedJob(job)
    setSelectedCandidate(null)
    setIsViewDetailsOpen(true)
  }

  const handleViewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate)
    setSelectedJob(null)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Recruitment</h2>
        <div className="flex items-center space-x-2">
          {activeTab === 'jobs' ? (
            <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Job Opening
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>New Job Opening</DialogTitle>
                  <DialogDescription>
                    Fill in the job details. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" placeholder="Enter job title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Enter location" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Job Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL_TIME">Full Time</SelectItem>
                          <SelectItem value="PART_TIME">Part Time</SelectItem>
                          <SelectItem value="CONTRACT">Contract</SelectItem>
                          <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input id="salary" placeholder="e.g., €50,000 - €70,000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postedDate">Posted Date</Label>
                      <Input id="postedDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="closingDate">Closing Date</Label>
                      <Input id="closingDate" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea id="description" placeholder="Enter job description" />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea id="requirements" placeholder="Enter job requirements" />
                  </div>
                  <div>
                    <Label htmlFor="responsibilities">Responsibilities</Label>
                    <Textarea id="responsibilities" placeholder="Enter job responsibilities" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Candidate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Candidate</DialogTitle>
                  <DialogDescription>
                    Fill in the candidate details. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="jobOpening">Job Opening</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job opening" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobOpenings
                          .filter(job => job.status === 'OPEN')
                          .map(job => (
                            <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="NEW">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="REVIEW">In Review</SelectItem>
                        <SelectItem value="INTERVIEW">Interview</SelectItem>
                        <SelectItem value="HIRED">Hired</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="resume">Resume</Label>
                      <Input id="resume" type="file" />
                    </div>
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Input id="coverLetter" type="file" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Enter notes about the candidate" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCandidateOpen(false)}>Cancel</Button>
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
      <Tabs defaultValue="jobs" onValueChange={setActiveTab}>
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="jobs">Job Openings</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
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
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{getJobTypeBadge(job.type)}</TableCell>
                      <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(job.closingDate).toLocaleDateString()}</TableCell>
                      <TableCell>{job.applicantsCount}</TableCell>
                      <TableCell>{getJobStatusBadge(job.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewJobDetails(job)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Applicants
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
        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.firstName} {candidate.lastName}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.phone}</TableCell>
                      <TableCell>{candidate.jobTitle}</TableCell>
                      <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getCandidateStatusBadge(candidate.status)}</TableCell>
                      <TableCell>
                        {candidate.rating ? (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < candidate.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        ) : (
                          'Not rated'
                        )}
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
                            <DropdownMenuItem onClick={() => handleViewCandidateDetails(candidate)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Resume
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
        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Interview Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates
                    .filter(candidate => candidate.status === 'INTERVIEW' && candidate.interviewDate)
                    .map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.firstName} {candidate.lastName}</TableCell>
                        <TableCell>{candidate.jobTitle}</TableCell>
                        <TableCell>{new Date(candidate.interviewDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getCandidateStatusBadge(candidate.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewCandidateDetails(candidate)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="ml-2">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredCandidates.filter(candidate => candidate.status === 'INTERVIEW' && candidate.interviewDate).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Calendar className="h-12 w-12 mb-2" />
                          <p>No interviews scheduled</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
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
              {selectedJob ? 'Job Opening Details' : 'Candidate Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium text-sm">Job Title</h3>
                <p className="text-base">{selectedJob.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Department</h3>
                  <p>{selectedJob.department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Location</h3>
                  <p>{selectedJob.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Job Type</h3>
                  {getJobTypeBadge(selectedJob.type)}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  {getJobStatusBadge(selectedJob.status)}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Applicants</h3>
                  <p>{selectedJob.applicantsCount}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Posted Date</h3>
                  <p>{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Closing Date</h3>
                  <p>{new Date(selectedJob.closingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Salary Range</h3>
                  <p>{selectedJob.salary}</p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-sm">Job Description</h3>
                <p className="text-sm mt-1">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Requirements</h3>
                <p className="text-sm mt-1">{selectedJob.requirements}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Responsibilities</h3>
                <p className="text-sm mt-1">{selectedJob.responsibilities}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Hiring Manager</h3>
                <p>{selectedJob.hiringManager}</p>
              </div>
            </div>
          )}
          {selectedCandidate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">First Name</h3>
                  <p>{selectedCandidate.firstName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Last Name</h3>
                  <p>{selectedCandidate.lastName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Email</h3>
                  <p className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${selectedCandidate.email}`} className="text-blue-600 hover:underline">
                      {selectedCandidate.email}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Phone</h3>
                  <p className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${selectedCandidate.phone}`} className="text-blue-600 hover:underline">
                      {selectedCandidate.phone}
                    </a>
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Job Position</h3>
                  <p>{selectedCandidate.jobTitle}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  {getCandidateStatusBadge(selectedCandidate.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Applied Date</h3>
                  <p>{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Interview Date</h3>
                  <p>{selectedCandidate.interviewDate ? new Date(selectedCandidate.interviewDate).toLocaleDateString() : 'Not scheduled'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Rating</h3>
                <div className="flex mt-1">
                  {selectedCandidate.rating ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < selectedCandidate.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </>
                  ) : (
                    'Not rated'
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Notes</h3>
                <p className="text-sm mt-1">{selectedCandidate.notes || 'No notes available'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Resume</h3>
                  {selectedCandidate.resumeUrl ? (
                    <a href={selectedCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 mt-1">
                      <FileText className="h-4 w-4" />
                      View Resume
                    </a>
                  ) : (
                    'No resume available'
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Cover Letter</h3>
                  {selectedCandidate.coverLetterUrl ? (
                    <a href={selectedCandidate.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 mt-1">
                      <FileText className="h-4 w-4" />
                      View Cover Letter
                    </a>
                  ) : (
                    'No cover letter available'
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {selectedJob && (
              <>
                <Button variant="outline">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Job
                </Button>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  View Applicants
                </Button>
              </>
            )}
            {selectedCandidate && (
              <>
                {selectedCandidate.status === 'NEW' || selectedCandidate.status === 'REVIEW' ? (
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                ) : selectedCandidate.status === 'INTERVIEW' ? (
                  <Button>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete Interview
                  </Button>
                ) : null}
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
