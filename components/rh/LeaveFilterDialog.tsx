'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { toast } from 'sonner';

// Define types for departments and employees
type Department = {
  id: string;
  name: string;
};

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: {
    id: string;
    name: string;
  };
};

type LeaveType = {
  id: string;
  name: string;
};

interface LeaveFilterDialogProps {
  onFilter: (filters: LeaveFilters) => void;
  onReset: () => void;
}

export interface LeaveFilters {
  departmentId?: string;
  employeeId?: string;
  leaveTypeId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'all';
}

export function LeaveFilterDialog({ onFilter, onReset }: LeaveFilterDialogProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<LeaveFilters>({
    departmentId: undefined,
    employeeId: undefined,
    leaveTypeId: undefined,
    startDateFrom: undefined,
    startDateTo: undefined,
    status: 'all',
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      if (status !== 'authenticated') return;

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
      }
    };

    fetchDepartments();
  }, [status]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      if (status !== 'authenticated') return;

      try {
        const response = await fetch('/api/rh/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [status]);

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      if (status !== 'authenticated') return;

      try {
        const response = await fetch('/api/rh/leave-types');
        if (!response.ok) {
          throw new Error('Failed to fetch leave types');
        }

        const data = await response.json();
        setLeaveTypes(data || []);
      } catch (error) {
        console.error('Error fetching leave types:', error);
      }
    };

    fetchLeaveTypes();
  }, [status]);

  // Filter employees by department
  const filteredEmployees = filters.departmentId
    ? employees.filter(employee => employee.department?.id === filters.departmentId)
    : employees;

  // Handle filter changes
  const handleFilterChange = (key: keyof LeaveFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilter(filters);
    setIsOpen(false);

    // Show toast with active filters
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (key === 'departmentId') {
          const dept = departments.find(d => d.id === value);
          return dept ? `Department: ${dept.name}` : '';
        }
        if (key === 'employeeId') {
          const emp = employees.find(e => e.id === value);
          return emp ? `Employee: ${emp.firstName} ${emp.lastName}` : '';
        }
        if (key === 'leaveTypeId') {
          const type = leaveTypes.find(t => t.id === value);
          return type ? `Leave Type: ${type.name}` : '';
        }
        if (key === 'startDateFrom') return `From: ${value}`;
        if (key === 'startDateTo') return `To: ${value}`;
        if (key === 'status' && value !== 'all') return `Status: ${value.toLowerCase()}`;
        return '';
      })
      .filter(Boolean);

    if (activeFilters.length > 0) {
      toast.info(`Filters applied: ${activeFilters.join(', ')}`);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      departmentId: undefined,
      employeeId: undefined,
      leaveTypeId: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      status: 'all',
    });
    onReset();
    setIsOpen(false);
    toast.info('Filters reset');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Employees</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down the leave request list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={filters.departmentId || ''}
              onValueChange={(value) => {
                handleFilterChange('departmentId', value);
                // Reset employee if department changes
                if (filters.employeeId && value !== filters.departmentId) {
                  handleFilterChange('employeeId', undefined);
                }
              }}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={filters.employeeId || ''}
              onValueChange={(value) => handleFilterChange('employeeId', value)}
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Employees</SelectItem>
                {filteredEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              value={filters.leaveTypeId || ''}
              onValueChange={(value) => handleFilterChange('leaveTypeId', value)}
            >
              <SelectTrigger id="leaveType">
                <SelectValue placeholder="All Leave Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Leave Types</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDateFrom" className="text-xs">From</Label>
                <Input
                  id="startDateFrom"
                  type="date"
                  value={filters.startDateFrom || ''}
                  onChange={(e) => handleFilterChange('startDateFrom', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="startDateTo" className="text-xs">To</Label>
                <Input
                  id="startDateTo"
                  type="date"
                  value={filters.startDateTo || ''}
                  onChange={(e) => handleFilterChange('startDateTo', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value: any) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFilters} type="button">
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button onClick={applyFilters} type="button">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
