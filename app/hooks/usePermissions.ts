import { 
  User, 
  UserRole, 
  Permission, 
  DEFAULT_ROLE_PERMISSIONS 
} from '../types/auth';
import { 
  AllRoutes, 
  canUserAccessRoute 
} from '../types/routes';

export const usePermissions = (user: User | null) => {
  const userRole = user?.role || UserRole.PUBLIC;
  const userPermissions = user?.permissions || DEFAULT_ROLE_PERMISSIONS[userRole];

  return {
    canAccess: (permission: Permission): boolean => {
      return userPermissions.includes(permission);
    },

    hasRole: (role: UserRole): boolean => {
      return userRole === role;
    },

    hasAnyRole: (roles: UserRole[]): boolean => {
      return roles.includes(userRole);
    },

    canAccessRoute: (route: AllRoutes): boolean => {
      return canUserAccessRoute(userRole, route, userPermissions);
    },

    getAccessibleRoutes: (): AllRoutes[] => {
      const allRoutes: AllRoutes[] = [
        'home', 'customer', 'tracking', 'scheduling', 'login', 'register',
        'employee-dashboard', 'employee-orders', 'employee-scheduling', 'messages',
        'admin-dashboard', 'admin-users', 'admin-employees', 'admin-orders',
        'admin-scheduling', 'admin-reports', 'admin-settings', 'admin-financial'
      ];

      return allRoutes.filter(route =>
        canUserAccessRoute(userRole, route, userPermissions)
      );
    },

    canAccessPublicFeatures: (): boolean => {
      return userPermissions.includes(Permission.CREATE_PUBLIC_ORDER);
    },

    canAccessEmployeeFeatures: (): boolean => {
      return userPermissions.includes(Permission.VIEW_EMPLOYEE_DASHBOARD) ||
             userPermissions.includes(Permission.MANAGE_ORDERS);
    },

    canAccessAdminFeatures: (): boolean => {
      return userPermissions.includes(Permission.VIEW_ADMIN_DASHBOARD) ||
             userPermissions.includes(Permission.MANAGE_USERS);
    },

    canCreateOrders: (): boolean => {
      return userPermissions.includes(Permission.CREATE_PUBLIC_ORDER);
    },

    canTrackOrders: (): boolean => {
      return userPermissions.includes(Permission.TRACK_PUBLIC_ORDER);
    },

    canManageAllOrders: (): boolean => {
      return userPermissions.includes(Permission.MANAGE_ORDERS) ||
             userPermissions.includes(Permission.VIEW_ALL_ORDERS);
    },

    canScheduleAppointments: (): boolean => {
      return userPermissions.includes(Permission.SCHEDULE_PUBLIC_APPOINTMENT);
    },

    canManageScheduling: (): boolean => {
      return userPermissions.includes(Permission.MANAGE_SCHEDULING) ||
             userPermissions.includes(Permission.VIEW_EMPLOYEE_SCHEDULING);
    },

    canSendMessages: (): boolean => {
      return userPermissions.includes(Permission.SEND_MESSAGES);
    },

    canManageUsers: (): boolean => {
      return userPermissions.includes(Permission.MANAGE_USERS);
    },

    canManageEmployees: (): boolean => {
      return userPermissions.includes(Permission.MANAGE_EMPLOYEES);
    },

    canViewReports: (): boolean => {
      return userPermissions.includes(Permission.VIEW_REPORTS);
    },

    canViewFinancialData: (): boolean => {
      return userPermissions.includes(Permission.VIEW_FINANCIAL_DATA);
    },

    canManageSettings: (): boolean => {
      return userPermissions.includes(Permission.MANAGE_SETTINGS);
    },

    userRole,
    userPermissions,
    isPublicUser: userRole === UserRole.PUBLIC,
    isEmployee: userRole === UserRole.EMPLOYEE,
    isAdmin: userRole === UserRole.ADMIN,
    isAuthenticated: user !== null,

    hasEmployeeLevelAccess: (): boolean => {
      return [UserRole.EMPLOYEE, UserRole.ADMIN].includes(userRole);
    },

    hasAdminLevelAccess: (): boolean => {
      return userRole === UserRole.ADMIN;
    }
  };
};