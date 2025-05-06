"use client";

import { Badge } from "@/components/ui/badge";
import { getDepartmentBadgeConfig } from "@/lib/utils/employee-utils";
import {
  Users, DollarSign, TrendingUp, ShoppingCart, Laptop,
  Settings, Headphones, FileText, Building, Beaker
} from "lucide-react";

interface DepartmentBadgeProps {
  departmentName: string | undefined | null;
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  'Users': <Users className="h-3 w-3 mr-1" />,
  'DollarSign': <DollarSign className="h-3 w-3 mr-1" />,
  'TrendingUp': <TrendingUp className="h-3 w-3 mr-1" />,
  'ShoppingCart': <ShoppingCart className="h-3 w-3 mr-1" />,
  'Laptop': <Laptop className="h-3 w-3 mr-1" />,
  'Settings': <Settings className="h-3 w-3 mr-1" />,
  'HeadPhones': <Headphones className="h-3 w-3 mr-1" />,
  'FileText': <FileText className="h-3 w-3 mr-1" />,
  'Building': <Building className="h-3 w-3 mr-1" />,
  'Beaker': <Beaker className="h-3 w-3 mr-1" />,
};

export function DepartmentBadge({ departmentName, className = "" }: DepartmentBadgeProps) {
  const config = getDepartmentBadgeConfig(departmentName);
  const icon = iconMap[config.icon] || <Building className="h-3 w-3 mr-1" />;

  return (
    <Badge
      variant="outline"
      className={`flex items-center ${config.color} ${className}`}
    >
      {icon}
      {departmentName || 'No Department'}
    </Badge>
  );
}
