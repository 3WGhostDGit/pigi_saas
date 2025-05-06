'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define the form schema
const departmentUpdateSchema = z.object({
  requestedDepartmentId: z.string({
    required_error: 'Please select a department',
  }),
  currentJobTitle: z.string().optional(),
  requestedJobTitle: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type DepartmentUpdateFormValues = z.infer<typeof departmentUpdateSchema>;

type Department = {
  id: string;
  name: string;
  description?: string;
};

export function DepartmentUpdateForm() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the form
  const form = useForm<DepartmentUpdateFormValues>({
    resolver: zodResolver(departmentUpdateSchema),
    defaultValues: {
      requestedDepartmentId: '',
      currentJobTitle: '',
      requestedJobTitle: '',
      additionalInfo: '',
    },
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/rh/departments');
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        console.log('Departments data:', data);

        // Check if data is an array or has a departments property
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data.departments) {
          setDepartments(data.departments);
        } else {
          console.error('Unexpected departments data format:', data);
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Pre-fill current job title if available
  useEffect(() => {
    if (session?.user) {
      form.setValue('currentJobTitle', session.user.jobTitle || '');
    }
  }, [session, form]);

  // Handle form submission
  const onSubmit = async (data: DepartmentUpdateFormValues) => {
    if (status !== 'authenticated') {
      toast.error('You must be logged in to submit this form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile/department-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      toast.success('Department update request submitted successfully');
      form.reset({
        requestedDepartmentId: '',
        currentJobTitle: session?.user?.jobTitle || '',
        requestedJobTitle: '',
        additionalInfo: '',
      });
    } catch (error) {
      console.error('Error submitting department update request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Department Update Request</CardTitle>
          <CardDescription>
            Loading department information...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[300px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading form data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Department Update Request</CardTitle>
        <CardDescription>
          Submit a request to update your department or job title. This will be reviewed by HR.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requestedDepartmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Select the department you would like to be assigned to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentJobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your current job title"
                        {...field}
                        disabled={true}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Your current job title in the system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requestedJobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your requested job title"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Enter the job title you would like to have.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide any additional information to support your request"
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Explain why you are requesting this change and any relevant qualifications or experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
