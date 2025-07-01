import React, { useEffect } from 'react';
import { AllRoutes } from '../types/routes';
import { useNavigationGuard } from '../hooks/useNavigationGuard';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

interface RouteHandlerProps {
  currentRoute: AllRoutes;
  onRouteChange: (route: AllRoutes) => void;
  children: React.ReactNode;
}

export const RouteHandler: React.FC<RouteHandlerProps> = ({
  currentRoute,
  onRouteChange,
  children
}) => {
  const { user } = useAuth();
  
  const userRole = user?.role || UserRole.PUBLIC;
  
  const { 
    canNavigateTo, 
    getDefaultRoute, 
    requiresLogin,
    getRouteTitle
  } = useNavigationGuard(userRole);

  useEffect(() => {
    if (requiresLogin(currentRoute) && !user) {
      console.log(`Rota ${currentRoute} requer login. Redirecionando para login.`);
      onRouteChange('login');
      return;
    }

    if (!canNavigateTo(currentRoute)) {
      const defaultRoute = getDefaultRoute();
      console.log(`Acesso negado à rota ${currentRoute}. Redirecionando para ${defaultRoute}.`);
      onRouteChange(defaultRoute);
      return;
    }

    updateURL(currentRoute);
  }, [currentRoute, user, userRole, canNavigateTo, getDefaultRoute, requiresLogin, onRouteChange]);

  const updateURL = (route: AllRoutes) => {
    const routeMap: Record<AllRoutes, string> = {
      'home': '/',
      'customer': '/pedido',
      'tracking': '/rastrear',
      'scheduling': '/agendamento',
      'login': '/login',
      'register': '/cadastro',
      'employee-dashboard': '/funcionario/dashboard',
      'employee-orders': '/funcionario/atendimento',
      'employee-scheduling': '/funcionario/agenda',
      'messages': '/mensagens',
      'admin-dashboard': '/admin/dashboard',
      'admin-users': '/admin/clientes',
      'admin-employees': '/admin/funcionarios',
      'admin-orders': '/admin/pedidos',
      'admin-scheduling': '/admin/agenda',
      'admin-reports': '/admin/relatorios',
      'admin-settings': '/admin/configuracoes',
      'admin-financial': '/admin/financeiro'
    };

    const newPath = routeMap[route] || '/';
    if (window.location.hash !== `#${newPath}`) {
      window.history.replaceState(null, '', `#${newPath}`);
    }
  };

  const getBreadcrumbItems = (): Array<{ title: string; route: AllRoutes }> => {
    const items: Array<{ title: string; route: AllRoutes }> = [
      { title: 'Início', route: 'home' }
    ];

    if (currentRoute !== 'home') {
      if (currentRoute.startsWith('admin-')) {
        items.push({ title: 'Administração', route: currentRoute });
      } else if (currentRoute.startsWith('employee-')) {
        items.push({ title: 'Funcionário', route: currentRoute });
      } else if (
        ['my-orders', 'my-scheduling', 'profile', 'notifications'].includes(currentRoute)
      ) {
        items.push({ title: 'Minha Conta', route: currentRoute });
      }

      const lastItem = items[items.length - 1];
      if (lastItem.route !== currentRoute) {
        items.push({ title: getRouteTitle(currentRoute), route: currentRoute });
      } else {
        lastItem.title = getRouteTitle(currentRoute);
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <>
      {breadcrumbItems.length > 1 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-sm text-gray-500">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                <span 
                  className="hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    if (canNavigateTo(item.route)) {
                      onRouteChange(item.route);
                    }
                  }}
                >
                  {item.title}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {children}
    </>
  );
};

export const useRouteFromURL = (): AllRoutes => {
  const [currentRoute, setCurrentRoute] = React.useState<AllRoutes>('home');

  React.useEffect(() => {
    const getRouteFromHash = (): AllRoutes => {
      const hash = window.location.hash.replace('#', '') || '/';

      const hashToRoute: Record<string, AllRoutes> = {
        '/': 'home',
        '/pedido': 'customer',
        '/rastrear': 'tracking',
        '/agendamento': 'scheduling',
        '/login': 'login',
        '/cadastro': 'register',
        '/funcionario/dashboard': 'employee-dashboard',
        '/funcionario/atendimento': 'employee-orders',
        '/funcionario/agenda': 'employee-scheduling',
        '/mensagens': 'messages',
        '/admin/dashboard': 'admin-dashboard',
        '/admin/clientes': 'admin-users',
        '/admin/funcionarios': 'admin-employees',
        '/admin/pedidos': 'admin-orders',
        '/admin/agenda': 'admin-scheduling',
        '/admin/relatorios': 'admin-reports',
        '/admin/configuracoes': 'admin-settings',
        '/admin/financeiro': 'admin-financial'
      };

      return hashToRoute[hash] || 'home';
    };

    setCurrentRoute(getRouteFromHash());

    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return currentRoute;
};