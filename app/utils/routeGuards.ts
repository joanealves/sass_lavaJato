import React, { createContext, useContext, ReactNode } from 'react';
import { User, UserRole, Permission } from '../types/auth';
import { AllRoutes } from '../types/routes';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    Permission.VIEW_PUBLIC_PAGES,
    Permission.CREATE_PUBLIC_ORDER,
    Permission.TRACK_PUBLIC_ORDER,
    Permission.CREATE_SCHEDULING
  ],
  [UserRole.CLIENT]: [
    ...ROLE_PERMISSIONS[UserRole.GUEST],
    Permission.VIEW_OWN_ORDERS,
    Permission.VIEW_OWN_SCHEDULING,
    Permission.MANAGE_OWN_PROFILE
  ],
  [UserRole.EMPLOYEE]: [
    ...ROLE_PERMISSIONS[UserRole.CLIENT],
    Permission.VIEW_ALL_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.MANAGE_SCHEDULING,
    Permission.SEND_MESSAGES,
    Permission.VIEW_EMPLOYEE_DASHBOARD
  ],
  [UserRole.ADMIN]: [
    ...ROLE_PERMISSIONS[UserRole.EMPLOYEE],
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_SETTINGS,
    Permission.MANAGE_ALL_USERS,
    Permission.DELETE_ORDERS,
    Permission.VIEW_FINANCIAL_DATA
  ]
};
