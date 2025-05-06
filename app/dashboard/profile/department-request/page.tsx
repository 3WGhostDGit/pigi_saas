'use client';

import { useSession } from 'next-auth/react';
import { DepartmentUpdateForm } from '@/components/profile/DepartmentUpdateForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Building2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DepartmentRequestPage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Department Update Request</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form on the left - takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <DepartmentUpdateForm />
        </div>

        {/* User info on the right - takes 1/3 of the space */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-sm">{session?.user?.name || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{session?.user?.email || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building2 className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-medium text-sm">{session?.user?.department || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Briefcase className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Job Title</p>
                    <p className="font-medium text-sm">{session?.user?.jobTitle || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Submit a request to update your department or job title information. Your request will be reviewed by HR administrators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
