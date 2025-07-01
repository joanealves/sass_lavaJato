import React, { useState } from 'react';
import { 
  Home, 
  Car, 
  Search, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Users,
  UserCheck,
  DollarSign
} from 'lucide-react';
import { UserRole } from '../types/auth';
import { AllRoutes } from '../types/routes';
import { NavigationItem } from '../hooks/useNavigationGuard';

interface NavigationProps {
  currentView: AllRoutes;
  onViewChange: (view: AllRoutes) => void;
  userRole: UserRole;
  onLogout: () => void;
  navigationItems: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  userRole,
  onLogout,
  navigationItems
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getIcon = (path: AllRoutes): React.FC<React.SVGProps<SVGSVGElement>> => {
    const iconMap: Record<AllRoutes, React.FC<React.SVGProps<SVGSVGElement>>> = {
      'home': Home,
      'customer': Car,
      'tracking': Search,
      'scheduling': Calendar,
      'login': User,
      'register': User,

      'employee-dashboard': BarChart3,
      'employee-orders': ClipboardList,
      'employee-scheduling': Calendar,
      'messages': MessageSquare,

      'admin-dashboard': BarChart3,
      'admin-users': Users,
      'admin-employees': UserCheck,
      'admin-orders': ClipboardList,
      'admin-scheduling': Calendar,
      'admin-reports': BarChart3,
      'admin-settings': Settings,
      'admin-financial': DollarSign
    };
    return iconMap[path] || Home;
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    const section = item.section || 'main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const renderNavigationItems = (items: NavigationItem[]) => {
    return items.map((item) => {
      const Icon = getIcon(item.path);
      const isActive = currentView === item.path;

      return (
        <button
          key={item.path}
          onClick={() => {
            onViewChange(item.path);
            setIsMobileMenuOpen(false);
          }}
          aria-current={isActive ? 'page' : undefined}
          className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Icon className="mr-3 h-5 w-5" aria-hidden="true" focusable={false} />
          {item.title}
        </button>
      );
    });
  };

  const getUserDisplayName = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.EMPLOYEE:
        return 'Funcionário';
      default:
        return 'Visitante';
    }
  };

  const handleAuthClick = () => {
    onViewChange('login');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
   <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      <div className="flex items-center">
        <Car className="h-8 w-8 text-indigo-600 mr-3" aria-hidden="true" />
        <span className="text-2xl font-bold text-gray-900">Lava-Jato</span>
      </div>
      <nav className="hidden md:flex space-x-6" aria-label="Menu principal">
        {groupedItems.main?.map((item) => {
          const Icon = getIcon(item.path);
          const isActive = currentView === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onViewChange(item.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
              {item.title}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center space-x-4">
        {userRole !== UserRole.PUBLIC ? (
          <div className="hidden md:flex items-center space-x-4" aria-label="Usuário logado">
            <span className="text-sm text-gray-600">{getUserDisplayName()}</span>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition"
            >
              <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
              Sair
            </button>
          </div>
        ) : (
          <button
            onClick={handleAuthClick}
            className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            <User className="mr-2 h-5 w-5" aria-hidden="true" />
            Entrar
          </button>
        )}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  </div>
</header>


      {isMobileMenuOpen && (
        <div className="md:hidden" role="menu" aria-label="Menu móvel">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Menu Principal
              </div>
              {groupedItems.main && renderNavigationItems(groupedItems.main)}
            </div>

            {groupedItems.admin && groupedItems.admin.length > 0 && (
              <div className="space-y-1 pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administração
                </div>
                {renderNavigationItems(groupedItems.admin)}
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              {userRole !== UserRole.PUBLIC ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Logado como: {getUserDisplayName()}
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  <User className="mr-3 h-5 w-5" aria-hidden="true" />
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;