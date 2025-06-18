import React, { useState } from 'react';
import { Car, User, BarChart3, LogIn } from 'lucide-react';

type UserType = 'user' | 'admin';

interface LoginViewProps {
  onLogin: (userType: UserType) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }): React.ReactElement => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const handleLogin = (): void => {
    if (isAdmin && password !== 'admin123') {
      alert('Senha incorreta para administrador!');
      return;
    }
    onLogin(isAdmin ? 'admin' : 'user');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lava-Jato </h1>
          <p className="text-gray-600">Sistema de Gerenciamento SaaS</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                !isAdmin 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Cliente</div>
              <div className="text-sm opacity-75">Fazer pedidos</div>
            </button>
            
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                isAdmin 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Admin</div>
              <div className="text-sm opacity-75">Gerenciar</div>
            </button>
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha do Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Digite a senha..."
                onKeyPress={handleKeyPress}
              />
              <p className="text-xs text-gray-500 mt-1">Senha: admin123</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <LogIn className="inline w-5 h-5 mr-2" />
            {isAdmin ? 'Entrar como Admin' : 'Entrar como Cliente'}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="bg-gray-50 rounded-lg p-4">
            <strong>Plano Freemium</strong>
            <div className="text-xs mt-1">
              • Até 50 pedidos/mês<br />
              • 1 usuário admin<br />
              • Funcionalidades básicas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;