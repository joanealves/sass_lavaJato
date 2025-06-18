import React from 'react';
import { Car, Plus, Eye, User, BarChart3, LogOut } from 'lucide-react';

type UserType = 'user' | 'admin';
type ViewType = 'customer' | 'tracking' | 'admin' | 'dashboard';

interface HeaderProps {
  userType: UserType;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userType, 
  currentView, 
  onViewChange, 
  onLogout 
}): React.ReactElement => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <Car className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Lava-Jato Santa Mônica</h1>
            <p className="text-sm text-gray-500">
              {userType === 'admin' ? 'Painel Administrativo' : 'Portal do Cliente'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userType === 'user' && (
            <div className="flex gap-2">
              <button
                onClick={() => onViewChange('customer')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'customer'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Novo Pedido
              </button>
              <button
                onClick={() => onViewChange('tracking')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'tracking'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="inline w-4 h-4 mr-2" />
                Acompanhar
              </button>
            </div>
          )}

          {userType === 'admin' && (
            <div className="flex gap-2">
              <button
                onClick={() => onViewChange('customer')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'customer'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Atendimento
              </button>
              <button
                onClick={() => onViewChange('admin')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <User className="inline w-4 h-4 mr-2" />
                Funcionários
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="inline w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => onViewChange('tracking')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'tracking'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="inline w-4 h-4 mr-2" />
                Acompanhar
              </button>
            </div>
          )}

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="inline w-4 h-4 mr-2" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;