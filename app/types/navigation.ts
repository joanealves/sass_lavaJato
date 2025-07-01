import { UserRole, Permission } from './auth';
import { AllRoutes } from './routes';
import { ReactNode } from 'react';

export interface NavigationItem {
  id: string;
  key: AllRoutes;
  label: string;
  path: AllRoutes;
  href?: string;
  roles?: UserRole[];
  permission?: Permission;
  icon?: ReactNode;
  isPublic?: boolean;
  section: 'main' | 'profile' | 'admin';
  order: number;
}

export interface NavigationGroup {
  id: string;
  label: string;
  roles?: UserRole[];
  items: NavigationItem[];
  section: 'main' | 'profile' | 'admin';
}

export interface NavigationProps {
  currentView: AllRoutes;
  onViewChange: (view: AllRoutes) => void;
  userRole: UserRole;
  onLogout: () => void;
  navigationItems: NavigationItem[];
}

export type ViewType = 'customer' | 'admin' | 'dashboard' | 'tracking';

export interface HeaderProps {
  userType: UserRole | 'user' | 'admin' | null;
  currentView: ViewType | AllRoutes;
  onViewChange: (view: ViewType | AllRoutes) => void;
  onLogout: () => void;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    key: 'home',
    label: 'Início',
    path: 'home',
    isPublic: true,
    section: 'main',
    order: 1
  },
  {
    id: 'customer',
    key: 'customer',
    label: 'Fazer Pedido',
    path: 'customer',
    isPublic: true,
    section: 'main',
    permission: Permission.CREATE_PUBLIC_ORDER,
    order: 2
  },
  {
    id: 'tracking',
    key: 'tracking',
    label: 'Rastrear Pedido',
    path: 'tracking',
    isPublic: true,
    section: 'main',
    permission: Permission.TRACK_PUBLIC_ORDER,
    order: 3
  },
  {
    id: 'scheduling',
    key: 'scheduling',
    label: 'Agendamento',
    path: 'scheduling',
    isPublic: true,
    section: 'main',
    permission: Permission.SCHEDULE_PUBLIC_APPOINTMENT,
    order: 4
  },
  {
    id: 'login',
    key: 'login',
    label: 'Login',
    path: 'login',
    isPublic: true,
    section: 'main',
    order: 100 
  },
  {
    id: 'register',
    key: 'register',
    label: 'Cadastro',
    path: 'register',
    isPublic: true,
    section: 'main',
    order: 101 
  },

  {
    id: 'employee-dashboard',
    key: 'employee-dashboard',
    label: 'Dashboard',
    path: 'employee-dashboard',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.VIEW_EMPLOYEE_DASHBOARD,
    section: 'main',
    order: 20
  },
  {
    id: 'employee-orders',
    key: 'employee-orders',
    label: 'Atendimento',
    path: 'employee-orders',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.MANAGE_ORDERS,
    section: 'main',
    order: 21
  },
  {
    id: 'employee-scheduling',
    key: 'employee-scheduling',
    label: 'Agenda',
    path: 'employee-scheduling',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.VIEW_EMPLOYEE_SCHEDULING,
    section: 'main',
    order: 22
  },
  {
    id: 'messages',
    key: 'messages',
    label: 'Mensagens',
    path: 'messages',
    roles: [UserRole.EMPLOYEE, UserRole.ADMIN],
    permission: Permission.SEND_MESSAGES,
    section: 'main',
    order: 23
  },

  {
    id: 'admin-dashboard',
    key: 'admin-dashboard',
    label: 'Dashboard Admin',
    path: 'admin-dashboard',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_ADMIN_DASHBOARD,
    section: 'main',
    order: 30
  },
  {
    id: 'admin-users',
    key: 'admin-users',
    label: 'Gerenciar Clientes',
    path: 'admin-users',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_USERS,
    section: 'admin',
    order: 40
  },
  {
    id: 'admin-employees',
    key: 'admin-employees',
    label: 'Gerenciar Funcionários',
    path: 'admin-employees',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_EMPLOYEES,
    section: 'admin',
    order: 41
  },
  {
    id: 'admin-orders',
    key: 'admin-orders',
    label: 'Todos os Pedidos',
    path: 'admin-orders',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_ALL_ORDERS,
    section: 'admin',
    order: 42
  },
  {
    id: 'admin-scheduling',
    key: 'admin-scheduling',
    label: 'Sistema de Agenda',
    path: 'admin-scheduling',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_SCHEDULING,
    section: 'admin',
    order: 43
  },
  {
    id: 'admin-reports',
    key: 'admin-reports',
    label: 'Relatórios',
    path: 'admin-reports',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_REPORTS,
    section: 'admin',
    order: 44
  },
  {
    id: 'admin-financial',
    key: 'admin-financial',
    label: 'Financeiro',
    path: 'admin-financial',
    roles: [UserRole.ADMIN],
    permission: Permission.VIEW_FINANCIAL_DATA,
    section: 'admin',
    order: 45
  },
  {
    id: 'admin-settings',
    key: 'admin-settings',
    label: 'Configurações',
    path: 'admin-settings',
    roles: [UserRole.ADMIN],
    permission: Permission.MANAGE_SETTINGS,
    section: 'admin',
    order: 46
  }
];

export const getNavigationForRole = (userRole: UserRole, userPermissions: Permission[]): NavigationItem[] => {
  return NAVIGATION_ITEMS
    .filter(item => {
      if (item.isPublic) {
        if (userRole !== UserRole.PUBLIC && (item.key === 'login' || item.key === 'register')) {
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
    })
    .sort((a, b) => a.order - b.order);
};

export const getNavigationBySection = (
  userRole: UserRole, 
  userPermissions: Permission[], 
  section: 'main' | 'profile' | 'admin'
): NavigationItem[] => {
  return getNavigationForRole(userRole, userPermissions)
    .filter(item => item.section === section);
};

export const getNavigationGroups = (userRole: UserRole, userPermissions: Permission[]): NavigationGroup[] => {
  const groups: NavigationGroup[] = [];

  const mainItems = getNavigationBySection(userRole, userPermissions, 'main');
  if (mainItems.length > 0) {
    groups.push({
      id: 'main',
      label: 'Principal',
      section: 'main',
      items: mainItems
    });
  }

  const profileItems = getNavigationBySection(userRole, userPermissions, 'profile');
  if (profileItems.length > 0) {
    groups.push({
      id: 'profile',
      label: 'Perfil',
      section: 'profile',
      items: profileItems
    });
  }

  const adminItems = getNavigationBySection(userRole, userPermissions, 'admin');
  if (adminItems.length > 0) {
    groups.push({
      id: 'admin',
      label: 'Administração',
      section: 'admin',
      items: adminItems
    });
  }

  return groups;
};

export const getNavigationItems = (
  userRole: UserRole, 
  userPermissions: Permission[]
): Array<{ path: AllRoutes; title: string; section: 'main' | 'admin'; isPublic?: boolean }> => {
  return getNavigationForRole(userRole, userPermissions).map(item => ({
    path: item.path,
    title: item.label,
    section: item.section === 'profile' ? 'main' : item.section,
    isPublic: item.isPublic
  }));
};