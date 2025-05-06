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
  FileText,
  Upload,
  Eye,
  Calendar,
  AlertTriangle,
  FolderArchive
} from "lucide-react"

// Mock data for document types
const documentTypes = [
  { id: "ID_CARD", name: "ID Card" },
  { id: "PASSPORT", name: "Passport" },
  { id: "RESIDENCE_PERMIT", name: "Residence Permit" },
  { id: "CONTRACT", name: "Employment Contract" },
  { id: "CERTIFICATE", name: "Certificate" },
  { id: "PAYSLIP", name: "Pay Slip" },
  { id: "OTHER", name: "Other" }
]

// Mock data for employee documents
const employeeDocuments = [
  {
    id: "1",
    employee: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    documentType: "PASSPORT",
    fileName: "john_doe_passport.pdf",
    fileUrl: "https://example.com/documents/john_doe_passport.pdf",
    description: "International passport",
    issueDate: "2020-03-15",
    expiryDate: "2030-03-14",
    uploadedAt: "2022-06-01",
    fileSize: "2.4 MB"
  },
  {
    id: "2",
    employee: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    documentType: "CONTRACT",
    fileName: "john_doe_contract_2022.pdf",
    fileUrl: "https://example.com/documents/john_doe_contract_2022.pdf",
    description: "Employment contract",
    issueDate: "2022-06-01",
    expiryDate: null,
    uploadedAt: "2022-06-01",
    fileSize: "1.8 MB"
  },
  {
    id: "3",
    employee: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    documentType: "ID_CARD",
    fileName: "jane_smith_id.pdf",
    fileUrl: "https://example.com/documents/jane_smith_id.pdf",
    description: "National ID card",
    issueDate: "2019-08-10",
    expiryDate: "2029-08-09",
    uploadedAt: "2022-08-15",
    fileSize: "1.2 MB"
  },
  {
    id: "4",
    employee: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    documentType: "CERTIFICATE",
    fileName: "jane_smith_marketing_cert.pdf",
    fileUrl: "https://example.com/documents/jane_smith_marketing_cert.pdf",
    description: "Digital Marketing Certification",
    issueDate: "2021-05-20",
    expiryDate: null,
    uploadedAt: "2022-08-15",
    fileSize: "3.5 MB"
  },
  {
    id: "5",
    employee: "Robert Johnson",
    employeeId: "EMP003",
    department: "Finance",
    documentType: "CONTRACT",
    fileName: "robert_johnson_contract_2023.pdf",
    fileUrl: "https://example.com/documents/robert_johnson_contract_2023.pdf",
    description: "Employment contract",
    issueDate: "2023-01-01",
    expiryDate: null,
    uploadedAt: "2023-01-01",
    fileSize: "1.9 MB"
  },
  {
    id: "6",
    employee: "Robert Johnson",
    employeeId: "EMP003",
    department: "Finance",
    documentType: "CERTIFICATE",
    fileName: "robert_johnson_cpa.pdf",
    fileUrl: "https://example.com/documents/robert_johnson_cpa.pdf",
    description: "CPA Certification",
    issueDate: "2020-11-15",
    expiryDate: null,
    uploadedAt: "2023-01-01",
    fileSize: "4.2 MB"
  },
]

// Helper function to get document type name
const getDocumentTypeName = (type) => {
  const docType = documentTypes.find(dt => dt.id === type)
  return docType ? docType.name : type
}

// Helper function to check if document is expiring soon (within 90 days)
const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false

  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 && diffDays <= 90
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploadDocumentOpen, setIsUploadDocumentOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)

  // Filter documents based on search term and filters
  const filteredDocuments = employeeDocuments.filter(doc => {
    // Apply search term filter
    const matchesSearch =
      doc.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDocumentTypeName(doc.documentType).toLowerCase().includes(searchTerm.toLowerCase())

    // Apply employee filter
    const matchesEmployee = !selectedEmployee || selectedEmployee === 'all' || doc.employeeId === selectedEmployee

    // Apply document type filter
    const matchesDocType = !selectedDocumentType || selectedDocumentType === 'all' || doc.documentType === selectedDocumentType

    return matchesSearch && matchesEmployee && matchesDocType
  })

  const handleViewDetails = (document) => {
    setSelectedDocument(document)
    setIsViewDetailsOpen(true)
  }

  // Group documents by employee for the "By Employee" tab
  const documentsByEmployee = {}
  filteredDocuments.forEach(doc => {
    if (!documentsByEmployee[doc.employeeId]) {
      documentsByEmployee[doc.employeeId] = {
        employee: doc.employee,
        employeeId: doc.employeeId,
        department: doc.department,
        documents: []
      }
    }
    documentsByEmployee[doc.employeeId].documents.push(doc)
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isUploadDocumentOpen} onOpenChange={setIsUploadDocumentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document for an employee. Fill in the details and click upload when you're done.
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
                      <SelectItem value="EMP001">John Doe</SelectItem>
                      <SelectItem value="EMP002">Jane Smith</SelectItem>
                      <SelectItem value="EMP003">Robert Johnson</SelectItem>
                      <SelectItem value="EMP004">Emily Davis</SelectItem>
                      <SelectItem value="EMP005">Michael Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file">Document File</Label>
                  <Input id="file" type="file" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter document description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDocumentOpen(false)}>Cancel</Button>
                <Button type="submit">Upload</Button>
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
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="byEmployee">By Employee</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="EMP001">John Doe</SelectItem>
                <SelectItem value="EMP002">Jane Smith</SelectItem>
                <SelectItem value="EMP003">Robert Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.fileName}</TableCell>
                      <TableCell>{getDocumentTypeName(document.documentType)}</TableCell>
                      <TableCell>{document.employee}</TableCell>
                      <TableCell>{document.department}</TableCell>
                      <TableCell>{document.issueDate ? new Date(document.issueDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        {document.expiryDate ? (
                          <div className="flex items-center gap-1">
                            <span>{new Date(document.expiryDate).toLocaleDateString()}</span>
                            {isExpiringSoon(document.expiryDate) && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        ) : (
                          'No Expiry'
                        )}
                      </TableCell>
                      <TableCell>{new Date(document.uploadedAt).toLocaleDateString()}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(document)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview Document
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
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
        <TabsContent value="byEmployee" className="space-y-4">
          {Object.values(documentsByEmployee).map(employeeData => (
            <Card key={employeeData.employeeId} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{employeeData.employee}</CardTitle>
                <CardDescription>{employeeData.department} • ID: {employeeData.employeeId}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeData.documents.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.fileName}</TableCell>
                        <TableCell>{getDocumentTypeName(document.documentType)}</TableCell>
                        <TableCell>{document.issueDate ? new Date(document.issueDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          {document.expiryDate ? (
                            <div className="flex items-center gap-1">
                              <span>{new Date(document.expiryDate).toLocaleDateString()}</span>
                              {isExpiringSoon(document.expiryDate) && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          ) : (
                            'No Expiry'
                          )}
                        </TableCell>
                        <TableCell>{new Date(document.uploadedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(document)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents Expiring Soon</CardTitle>
              <CardDescription>Documents that will expire within the next 90 days</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments
                    .filter(doc => isExpiringSoon(doc.expiryDate))
                    .map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.fileName}</TableCell>
                        <TableCell>{getDocumentTypeName(document.documentType)}</TableCell>
                        <TableCell>{document.employee}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{new Date(document.expiryDate).toLocaleDateString()}</span>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(document)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="ml-2">
                            <FileEdit className="mr-2 h-4 w-4" />
                            Renew
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredDocuments.filter(doc => isExpiringSoon(doc.expiryDate)).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Calendar className="h-12 w-12 mb-2" />
                          <p>No documents expiring soon</p>
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

      {/* Document Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium text-sm">Document Name</h3>
                <p className="text-base">{selectedDocument.fileName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Document Type</h3>
                  <p>{getDocumentTypeName(selectedDocument.documentType)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">File Size</h3>
                  <p>{selectedDocument.fileSize}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p className="text-sm">{selectedDocument.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Employee</h3>
                  <p>{selectedDocument.employee}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Department</h3>
                  <p>{selectedDocument.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Issue Date</h3>
                  <p>{selectedDocument.issueDate ? new Date(selectedDocument.issueDate).toLocaleDateString() : 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Expiry Date</h3>
                  <p>
                    {selectedDocument.expiryDate ? (
                      <div className="flex items-center gap-1">
                        <span>{new Date(selectedDocument.expiryDate).toLocaleDateString()}</span>
                        {isExpiringSoon(selectedDocument.expiryDate) && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    ) : (
                      'No Expiry'
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Uploaded</h3>
                  <p>{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
