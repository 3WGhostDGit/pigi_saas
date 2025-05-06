"use client";

import { Badge } from "@/components/ui/badge";
import {
  getEmployeeRoleType,
  getRoleBadgeVariant,
  getRoleDisplayText
} from "@/lib/utils/employee-utils";
import { Shield, Users, User, Building2 } from "lucide-react";
import { useEffect, useState } from "react";

interface RoleBadgeProps {
  user: any;
  className?: string;
}

export function RoleBadge({ user, className = "" }: RoleBadgeProps) {
  // Ensure user has a roles array
  if (!user.roles) {
    user.roles = ['EMPLOYEE'];
  } else if (user.roles.length === 0) {
    user.roles = ['EMPLOYEE'];
  }

  const roleType = getEmployeeRoleType(user);
  const variant = getRoleBadgeVariant(roleType);
  const displayText = getRoleDisplayText(roleType);

  // Get department name for department-specific badges
  const departmentName = user.department?.name || user.currentDepartmentName || null;

  // Create badge label with department for department managers
  let badgeLabel = displayText;

  if (roleType === 'dept_manager' && departmentName) {
    badgeLabel = `${departmentName} Manager`;
  } else if (roleType === 'admin') {
    badgeLabel = 'Admin';
  } else if (roleType === 'manager') {
    badgeLabel = 'Manager';
  } else {
    badgeLabel = 'Employee';
  }

  return (
    <Badge
      variant={variant as any}
      className={`flex items-center ${className}`}
    >
      {roleType === 'admin' && <Shield className="h-3 w-3 mr-1" />}
      {roleType === 'dept_manager' && <Building2 className="h-3 w-3 mr-1" />}
      {roleType === 'manager' && <Users className="h-3 w-3 mr-1" />}
      {roleType === 'employee' && <User className="h-3 w-3 mr-1" />}
      {badgeLabel}
    </Badge>
  );
}
