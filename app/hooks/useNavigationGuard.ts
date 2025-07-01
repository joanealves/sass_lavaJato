import { useMemo } from 'react';
import { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from '../types/auth';
import { AllRoutes, canUserAccessRoute, getDefaultRouteForRole, requiresLogin, getRouteTitle } from '../types/routes';

export interface NavigationItem {
  path: AllRoutes;
  title: string;
  section: 'main' | 'admin';
  isPublic?: boolean;
  roles?: UserRole[];
  permission?: Permission;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { path: 'home', title: 'Início', section: 'main', isPublic: true },
  { path: 'customer', title: 'Fazer Pedido', section: 'main', isPublic: true },
  { path: 'tracking', title: 'Rastrear Pedido', section: 'main', isPublic: true },
  { path: 'scheduling', title: 'Agendamento', section: 'main', isPublic: true },
  { path: 'login', title: 'Login', section: 'main', isPublic: true },
  { path: 'register', title: 'Cadastro', section: 'main', isPublic: true },

  { 
    path: 'employee-dashboard', 
    title: 'Dashboard', 
    section: 'main',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.VIEW_EMPLOYEE_DASHBOARD
  },
  { 
    path: 'employee-orders', 
    title: 'Atendimento', 
    section: 'main',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.MANAGE_ORDERS
  },
  { 
    path: 'employee-scheduling', 
    title: 'Agenda', 
    section: 'main',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.VIEW_EMPLOYEE_SCHEDULING
  },
  { 
    path: 'messages', 
    title: 'Mensagens', 
    section: 'main',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.SEND_MESSAGES
  },

  { 
    path: 'admin-dashboard', 
    title: 'Dashboard Admin', 
    section: 'main',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_ADMIN_DASHBOARD
  },
  { 
    path: 'admin-users', 
    title: 'Gerenciar Clientes', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_USERS
  },
  { 
    path: 'admin-employees', 
    title: 'Gerenciar Funcionários', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_EMPLOYEES
  },
  { 
    path: 'admin-orders', 
    title: 'Todos os Pedidos', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_ALL_ORDERS
  },
  { 
    path: 'admin-scheduling', 
    title: 'Sistema de Agenda', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_SCHEDULING
  },
  { 
    path: 'admin-reports', 
    title: 'Relatórios', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_REPORTS
  },
  { 
    path: 'admin-settings', 
    title: 'Configurações', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_SETTINGS
  },
  { 
    path: 'admin-financial', 
    title: 'Financeiro', 
    section: 'admin',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_FINANCIAL_DATA
  }
];

export const useNavigationGuard = (userRole: UserRole = UserRole.PUBLIC) => {
  const userPermissions = useMemo(() => {
    return DEFAULT_ROLE_PERMISSIONS[userRole] || [];
  }, [userRole]);

  const getDefaultRoute = useMemo(() => {
    return () => getDefaultRouteForRole(userRole);
  }, [userRole]);

  const canNavigateTo = useMemo(() => {
    return (route: AllRoutes): boolean => {
      return canUserAccessRoute(userRole, route, userPermissions);
    };
  }, [userRole, userPermissions]);

  const getNavigationItems = useMemo(() => {
    return (): NavigationItem[] => {
      return NAVIGATION_ITEMS.filter(item => {
        if (item.isPublic) {
          if (userRole !== UserRole.PUBLIC && (item.path === 'login' || item.path === 'register')) {
            return false;
          }
          return true;
        }

        if (item.roles && !item.roles.includes(userRole)) {
          return false;
        }

        if (item.permission && !userPermissions.includes(item.permission)) {
          return false;
        }

        return true;
      });
    };
  }, [userRole, userPermissions]);

  return {
    getDefaultRoute,
    canNavigateTo,
    getNavigationItems,
    requiresLogin,
    getRouteTitle
  };
};