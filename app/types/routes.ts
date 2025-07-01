import { UserRole, Permission } from './auth';

export type AllRoutes = 
  | 'home'
  | 'customer'
  | 'tracking'
  | 'scheduling'
  | 'login'
  | 'register'
  | 'employee-dashboard'
  | 'employee-orders'
  | 'employee-scheduling'
  | 'messages'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-employees'
  | 'admin-orders'
  | 'admin-scheduling'
  | 'admin-reports'
  | 'admin-settings'
  | 'admin-financial';

export interface RouteConfig {
  path: AllRoutes;
  title: string;
  isPublic: boolean;
  requiresAuth: boolean;
  permissions?: Permission[];
  roles?: UserRole[];
  description?: string;
}

export const ROUTE_CONFIGS: Record<AllRoutes, RouteConfig> = {
  'home': {
    path: 'home',
    title: 'Início',
    isPublic: true,
    requiresAuth: false
  },
  'customer': {
    path: 'customer',
    title: 'Fazer Pedido',
    isPublic: true,
    requiresAuth: false,
    permissions: [Permission.CREATE_PUBLIC_ORDER]
  },
  'tracking': {
    path: 'tracking',
    title: 'Rastrear Pedido',
    isPublic: true,
    requiresAuth: false,
    permissions: [Permission.TRACK_PUBLIC_ORDER]
  },
  'scheduling': {
    path: 'scheduling',
    title: 'Agendamento',
    isPublic: true,
    requiresAuth: false,
    permissions: [Permission.SCHEDULE_PUBLIC_APPOINTMENT]
  },
  'login': {
    path: 'login',
    title: 'Login',
    isPublic: true,
    requiresAuth: false
  },
  'register': {
    path: 'register',
    title: 'Cadastro',
    isPublic: true,
    requiresAuth: false
  },
  
  'employee-dashboard': {
    path: 'employee-dashboard',
    title: 'Dashboard',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.VIEW_EMPLOYEE_DASHBOARD],
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN]
  },
  'employee-orders': {
    path: 'employee-orders',
    title: 'Atendimento',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.MANAGE_ORDERS],
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN]
  },
  'employee-scheduling': {
    path: 'employee-scheduling',
    title: 'Agenda',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.VIEW_EMPLOYEE_SCHEDULING],
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN]
  },
  'messages': {
    path: 'messages',
    title: 'Mensagens',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.SEND_MESSAGES],
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN]
  },
  
  'admin-dashboard': {
    path: 'admin-dashboard',
    title: 'Dashboard Admin',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.VIEW_ADMIN_DASHBOARD],
    roles: [UserRole.ADMIN]
  },
  'admin-users': {
    path: 'admin-users',
    title: 'Gerenciar Clientes',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.MANAGE_USERS],
    roles: [UserRole.ADMIN]
  },
  'admin-employees': {
    path: 'admin-employees',
    title: 'Gerenciar Funcionários',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.MANAGE_EMPLOYEES],
    roles: [UserRole.ADMIN]
  },
  'admin-orders': {
    path: 'admin-orders',
    title: 'Todos os Pedidos',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.VIEW_ALL_ORDERS],
    roles: [UserRole.ADMIN]
  },
  'admin-scheduling': {
    path: 'admin-scheduling',
    title: 'Sistema de Agenda',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.MANAGE_SCHEDULING],
    roles: [UserRole.ADMIN]
  },
  'admin-reports': {
    path: 'admin-reports',
    title: 'Relatórios',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.VIEW_REPORTS],
    roles: [UserRole.ADMIN]
  },
  'admin-settings': {
    path: 'admin-settings',
    title: 'Configurações',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.MANAGE_SETTINGS],
    roles: [UserRole.ADMIN]
  },
  'admin-financial': {
    path: 'admin-financial',
    title: 'Financeiro',
    isPublic: false,
    requiresAuth: true,
    permissions: [Permission.VIEW_FINANCIAL_DATA],
    roles: [UserRole.ADMIN]
  }
};

export const isPublicRoute = (route: AllRoutes): boolean => {
  return ROUTE_CONFIGS[route]?.isPublic || false;
};

export const requiresLogin = (route: AllRoutes): boolean => {
  return ROUTE_CONFIGS[route]?.requiresAuth || false;
};

export const canUserAccessRoute = (userRole: UserRole, route: AllRoutes, userPermissions?: Permission[]): boolean => {
  const config = ROUTE_CONFIGS[route];
  if (!config) return false;
  
  if (config.isPublic) return true;
  
  if (config.roles && !config.roles.includes(userRole)) return false;
  
  if (config.permissions && userPermissions) {
    return config.permissions.some(permission => userPermissions.includes(permission));
  }
  
  return true;
};

export const getDefaultRouteForRole = (userRole: UserRole): AllRoutes => {
  switch (userRole) {
    case UserRole.EMPLOYEE:
      return 'employee-dashboard';
    case UserRole.ADMIN:
      return 'admin-dashboard';
    case UserRole.PUBLIC:
    default:
      return 'home';
  }
};

export const getRouteTitle = (route: AllRoutes): string => {
  return ROUTE_CONFIGS[route]?.title || 'Página não encontrada';
};