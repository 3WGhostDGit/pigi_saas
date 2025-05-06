import { User } from "@prisma/client";

/**
 * Determines the role type of an employee based on their roles and manager status
 * @param user The user object
 * @returns The role type: 'admin', 'manager', 'dept_manager', or 'employee'
 */
export function getEmployeeRoleType(user: any): 'admin' | 'manager' | 'dept_manager' | 'employee' {
  // Check if user has roles
  const roles = user.roles || [];

  // Check for admin role
  if (roles.includes('ADMIN')) {
    return 'admin';
  }

  // Check for HR_ADMIN role (department manager for HR)
  if (roles.includes('HR_ADMIN') || roles.includes('HR')) {
    return 'dept_manager';
  }

  // Check for department manager role
  if (roles.includes('DEPT_MANAGER')) {
    return 'dept_manager';
  }

  // Check for manager role
  if (roles.includes('MANAGER')) {
    return 'manager';
  }

  // Check based on job structure - if user has reports or no manager
  if ((user.reports && user.reports.length > 0) ||
      (user.managerId === null && user.department)) {
    return 'dept_manager';
  }

  // Default to standard employee
  return 'employee';
}

/**
 * Gets the appropriate badge variant for an employee role
 * @param roleType The role type: 'admin', 'manager', 'dept_manager', or 'employee'
 * @returns The badge variant to use
 */
export function getRoleBadgeVariant(roleType: 'admin' | 'manager' | 'dept_manager' | 'employee'): string {
  switch (roleType) {
    case 'admin':
      return 'destructive';
    case 'dept_manager':
      return 'dept_manager';
    case 'manager':
      return 'default';
    case 'employee':
    default:
      return 'secondary';
  }
}

/**
 * Gets the display text for an employee role
 * @param roleType The role type: 'admin', 'manager', 'dept_manager', or 'employee'
 * @returns The display text for the role
 */
export function getRoleDisplayText(roleType: 'admin' | 'manager' | 'dept_manager' | 'employee'): string {
  switch (roleType) {
    case 'admin':
      return 'Admin';
    case 'dept_manager':
      return 'Department Manager';
    case 'manager':
      return 'Manager';
    case 'employee':
    default:
      return 'Employee';
  }
}

/**
 * Department badge configuration mapping
 */
export const departmentBadgeConfig: Record<string, { icon: string, color: string }> = {
  'Human Resources': {
    icon: 'Users',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  'Finance': {
    icon: 'DollarSign',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  'Marketing': {
    icon: 'TrendingUp',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  },
  'Sales': {
    icon: 'ShoppingCart',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  },
  'IT': {
    icon: 'Laptop',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  },
  'Operations': {
    icon: 'Settings',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  },
  'Customer Service': {
    icon: 'HeadPhones',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
  },
  'Research & Development': {
    icon: 'Beaker',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
  },
  'Legal': {
    icon: 'FileText',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  // Default for any other department
  'default': {
    icon: 'Building',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  }
};

/**
 * Gets the badge configuration for a department
 * @param departmentName The name of the department
 * @returns The badge configuration with icon and color
 */
export function getDepartmentBadgeConfig(departmentName: string | undefined | null) {
  if (!departmentName) {
    return departmentBadgeConfig['default'];
  }

  return departmentBadgeConfig[departmentName] || departmentBadgeConfig['default'];
}
