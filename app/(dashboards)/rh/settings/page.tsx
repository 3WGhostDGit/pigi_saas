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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Save,
  Settings,
  Bell,
  Mail,
  Shield,
  Users,
  FileText,
  Calendar
} from "lucide-react"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Acme Corporation",
    companyEmail: "hr@acmecorp.com",
    companyPhone: "+33 1 23 45 67 89",
    companyAddress: "123 Business Street, Paris, France",
    companyWebsite: "https://www.acmecorp.com",
    defaultCurrency: "EUR",
    defaultLanguage: "fr",
    fiscalYearStart: "01-01",
    workWeekStart: "monday",
    workDaysPerWeek: 5,
    workHoursPerDay: 8
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newEmployeeNotification: true,
    leaveRequestNotification: true,
    documentExpiryNotification: true,
    performanceReviewNotification: true,
    birthdayNotification: true,
    workAnniversaryNotification: true
  })

  const [leaveSettings, setLeaveSettings] = useState({
    annualLeaveDefault: 25,
    sickLeaveDefault: 10,
    maternityLeaveDefault: 112,
    paternityLeaveDefault: 28,
    unpaidLeaveLimit: 30,
    requireApproval: true,
    minDaysBeforeRequest: 7,
    allowHalfDayLeave: true,
    allowLeaveCarryOver: true,
    maxCarryOverDays: 5,
    carryOverExpiryMonths: 3
  })

  const handleGeneralSettingsChange = (field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationSettingsChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLeaveSettingsChange = (field, value) => {
    setLeaveSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">HR Settings</h2>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="leave">
            <Calendar className="mr-2 h-4 w-4" />
            Leave Management
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => handleGeneralSettingsChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={generalSettings.companyWebsite}
                    onChange={(e) => handleGeneralSettingsChange('companyWebsite', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    value={generalSettings.companyEmail}
                    onChange={(e) => handleGeneralSettingsChange('companyEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={generalSettings.companyPhone}
                    onChange={(e) => handleGeneralSettingsChange('companyPhone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={generalSettings.companyAddress}
                  onChange={(e) => handleGeneralSettingsChange('companyAddress', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={generalSettings.defaultCurrency}
                    onValueChange={(value) => handleGeneralSettingsChange('defaultCurrency', value)}
                  >
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select
                    value={generalSettings.defaultLanguage}
                    onValueChange={(value) => handleGeneralSettingsChange('defaultLanguage', value)}
                  >
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                  <Input
                    id="fiscalYearStart"
                    value={generalSettings.fiscalYearStart}
                    onChange={(e) => handleGeneralSettingsChange('fiscalYearStart', e.target.value)}
                    placeholder="MM-DD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workWeekStart">Work Week Start</Label>
                  <Select
                    value={generalSettings.workWeekStart}
                    onValueChange={(value) => handleGeneralSettingsChange('workWeekStart', value)}
                  >
                    <SelectTrigger id="workWeekStart">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workDaysPerWeek">Work Days Per Week</Label>
                  <Input
                    id="workDaysPerWeek"
                    type="number"
                    min="1"
                    max="7"
                    value={generalSettings.workDaysPerWeek}
                    onChange={(e) => handleGeneralSettingsChange('workDaysPerWeek', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workHoursPerDay">Work Hours Per Day</Label>
                  <Input
                    id="workHoursPerDay"
                    type="number"
                    min="1"
                    max="24"
                    value={generalSettings.workHoursPerDay}
                    onChange={(e) => handleGeneralSettingsChange('workHoursPerDay', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newEmployeeNotification">New Employee</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when a new employee is added
                    </p>
                  </div>
                  <Switch
                    id="newEmployeeNotification"
                    checked={notificationSettings.newEmployeeNotification}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('newEmployeeNotification', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="leaveRequestNotification">Leave Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when a leave request is submitted
                    </p>
                  </div>
                  <Switch
                    id="leaveRequestNotification"
                    checked={notificationSettings.leaveRequestNotification}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('leaveRequestNotification', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="documentExpiryNotification">Document Expiry</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when employee documents are about to expire
                    </p>
                  </div>
                  <Switch
                    id="documentExpiryNotification"
                    checked={notificationSettings.documentExpiryNotification}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('documentExpiryNotification', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="performanceReviewNotification">Performance Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when performance reviews are due
                    </p>
                  </div>
                  <Switch
                    id="performanceReviewNotification"
                    checked={notificationSettings.performanceReviewNotification}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('performanceReviewNotification', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="birthdayNotification">Employee Birthdays</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about employee birthdays
                    </p>
                  </div>
                  <Switch
                    id="birthdayNotification"
                    checked={notificationSettings.birthdayNotification}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('birthdayNotification', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="workAnniversaryNotification">Work Anniversaries</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about employee work anniversaries
                    </p>
                  </div>
                  <Switch
                    id="workAnniversaryNotification"
                    checked={notificationSettings.workAnniversaryNotification}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('workAnniversaryNotification', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Management Settings */}
        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Entitlements</CardTitle>
              <CardDescription>
                Default leave entitlements for new employees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualLeaveDefault">Annual Leave (days/year)</Label>
                  <Input
                    id="annualLeaveDefault"
                    type="number"
                    min="0"
                    value={leaveSettings.annualLeaveDefault}
                    onChange={(e) => handleLeaveSettingsChange('annualLeaveDefault', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sickLeaveDefault">Sick Leave (days/year)</Label>
                  <Input
                    id="sickLeaveDefault"
                    type="number"
                    min="0"
                    value={leaveSettings.sickLeaveDefault}
                    onChange={(e) => handleLeaveSettingsChange('sickLeaveDefault', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maternityLeaveDefault">Maternity Leave (days)</Label>
                  <Input
                    id="maternityLeaveDefault"
                    type="number"
                    min="0"
                    value={leaveSettings.maternityLeaveDefault}
                    onChange={(e) => handleLeaveSettingsChange('maternityLeaveDefault', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paternityLeaveDefault">Paternity Leave (days)</Label>
                  <Input
                    id="paternityLeaveDefault"
                    type="number"
                    min="0"
                    value={leaveSettings.paternityLeaveDefault}
                    onChange={(e) => handleLeaveSettingsChange('paternityLeaveDefault', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unpaidLeaveLimit">Unpaid Leave Limit (days/year)</Label>
                <Input
                  id="unpaidLeaveLimit"
                  type="number"
                  min="0"
                  value={leaveSettings.unpaidLeaveLimit}
                  onChange={(e) => handleLeaveSettingsChange('unpaidLeaveLimit', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Policies</CardTitle>
              <CardDescription>
                Configure leave request and approval policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireApproval">Require Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Require manager approval for leave requests
                  </p>
                </div>
                <Switch
                  id="requireApproval"
                  checked={leaveSettings.requireApproval}
                  onCheckedChange={(checked) => handleLeaveSettingsChange('requireApproval', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="minDaysBeforeRequest">Minimum Days Before Request</Label>
                <p className="text-sm text-muted-foreground">
                  Minimum number of days before leave start date that a request must be submitted
                </p>
                <Input
                  id="minDaysBeforeRequest"
                  type="number"
                  min="0"
                  value={leaveSettings.minDaysBeforeRequest}
                  onChange={(e) => handleLeaveSettingsChange('minDaysBeforeRequest', parseInt(e.target.value))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowHalfDayLeave">Allow Half-Day Leave</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow employees to request half-day leave
                  </p>
                </div>
                <Switch
                  id="allowHalfDayLeave"
                  checked={leaveSettings.allowHalfDayLeave}
                  onCheckedChange={(checked) => handleLeaveSettingsChange('allowHalfDayLeave', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowLeaveCarryOver">Allow Leave Carry Over</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow unused leave to be carried over to the next year
                  </p>
                </div>
                <Switch
                  id="allowLeaveCarryOver"
                  checked={leaveSettings.allowLeaveCarryOver}
                  onCheckedChange={(checked) => handleLeaveSettingsChange('allowLeaveCarryOver', checked)}
                />
              </div>
              {leaveSettings.allowLeaveCarryOver && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="maxCarryOverDays">Maximum Carry Over Days</Label>
                    <Input
                      id="maxCarryOverDays"
                      type="number"
                      min="0"
                      value={leaveSettings.maxCarryOverDays}
                      onChange={(e) => handleLeaveSettingsChange('maxCarryOverDays', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carryOverExpiryMonths">Carry Over Expiry (months)</Label>
                    <p className="text-sm text-muted-foreground">
                      Number of months before carried over leave expires
                    </p>
                    <Input
                      id="carryOverExpiryMonths"
                      type="number"
                      min="0"
                      value={leaveSettings.carryOverExpiryMonths}
                      onChange={(e) => handleLeaveSettingsChange('carryOverExpiryMonths', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Settings */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure access permissions for different user roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Feature</TableHead>
                        <TableHead>HR Admin</TableHead>
                        <TableHead>HR Manager</TableHead>
                        <TableHead>Department Manager</TableHead>
                        <TableHead>Employee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">View Employees</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Department Only</TableCell>
                        <TableCell>Self Only</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Edit Employees</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Department Only</TableCell>
                        <TableCell>No Access</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">View Payroll</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Department Only</TableCell>
                        <TableCell>Self Only</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Approve Leave</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Department Only</TableCell>
                        <TableCell>No Access</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">View Reports</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>Department Only</TableCell>
                        <TableCell>No Access</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">System Settings</TableCell>
                        <TableCell>Full Access</TableCell>
                        <TableCell>View Only</TableCell>
                        <TableCell>No Access</TableCell>
                        <TableCell>No Access</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: These are default permissions. You can customize permissions for individual users in the User Management section.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Privacy</CardTitle>
              <CardDescription>
                Configure data privacy and retention settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetentionPeriod">Data Retention Period (months)</Label>
                <p className="text-sm text-muted-foreground">
                  How long to retain employee data after termination
                </p>
                <Input id="dataRetentionPeriod" type="number" min="0" defaultValue="36" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymizeTerminatedEmployees">Anonymize Terminated Employees</Label>
                  <p className="text-sm text-muted-foreground">
                    Anonymize personal data of terminated employees after retention period
                  </p>
                </div>
                <Switch id="anonymizeTerminatedEmployees" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableDataExport">Enable Data Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow employees to export their personal data
                  </p>
                </div>
                <Switch id="enableDataExport" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
