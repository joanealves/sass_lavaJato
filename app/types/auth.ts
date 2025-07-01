export enum UserRole {
  PUBLIC = 'PUBLIC',
  EMPLOYEE = 'EMPLOYEE', 
  ADMIN = 'ADMIN'
}

export enum Permission {
  CREATE_PUBLIC_ORDER = 'CREATE_PUBLIC_ORDER',
  TRACK_PUBLIC_ORDER = 'TRACK_PUBLIC_ORDER',
  SCHEDULE_PUBLIC_APPOINTMENT = 'SCHEDULE_PUBLIC_APPOINTMENT',
  
  VIEW_EMPLOYEE_DASHBOARD = 'VIEW_EMPLOYEE_DASHBOARD',
  MANAGE_ORDERS = 'MANAGE_ORDERS',
  VIEW_EMPLOYEE_SCHEDULING = 'VIEW_EMPLOYEE_SCHEDULING',
  SEND_MESSAGES = 'SEND_MESSAGES',
  
  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',
  VIEW_ALL_ORDERS = 'VIEW_ALL_ORDERS',
  MANAGE_SCHEDULING = 'MANAGE_SCHEDULING',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_FINANCIAL_DATA = 'VIEW_FINANCIAL_DATA'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.PUBLIC]: [
    Permission.CREATE_PUBLIC_ORDER,
    Permission.TRACK_PUBLIC_ORDER,
    Permission.SCHEDULE_PUBLIC_APPOINTMENT
  ],
  [UserRole.EMPLOYEE]: [
    Permission.CREATE_PUBLIC_ORDER,
    Permission.TRACK_PUBLIC_ORDER,
    Permission.SCHEDULE_PUBLIC_APPOINTMENT,
    Permission.VIEW_EMPLOYEE_DASHBOARD,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_EMPLOYEE_SCHEDULING,
    Permission.SEND_MESSAGES
  ],
  [UserRole.ADMIN]: [
    Permission.CREATE_PUBLIC_ORDER,
    Permission.TRACK_PUBLIC_ORDER,
    Permission.SCHEDULE_PUBLIC_APPOINTMENT,
    Permission.VIEW_EMPLOYEE_DASHBOARD,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_EMPLOYEE_SCHEDULING,
    Permission.SEND_MESSAGES,
    Permission.VIEW_ADMIN_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_ALL_ORDERS,
    Permission.MANAGE_SCHEDULING,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_FINANCIAL_DATA
  ]
};