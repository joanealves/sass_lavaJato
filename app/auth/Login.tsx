import React, { useState } from 'react';
import { Car, LogIn } from 'lucide-react';
import { LoginCredentials } from '../types/auth';

interface LoginViewProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha o email e a senha.');
      return;
    }

    setIsLoading(true);

    const success = await onLogin({ email, password });

    if (!success) {
      setError('Email ou senha incorretos.');
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Car className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo ao Lava-Jato!
          </h1>
          <p className="text-gray-500 text-lg">
            Faça login para acessar o sistema
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 focus:ring-indigo-500 focus:border-transparent"
              placeholder="seu.email@exemplo.com"
              onKeyPress={handleKeyPress}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              onKeyPress={handleKeyPress}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              'Carregando...'
            ) : (
              <>
                <LogIn className="inline w-5 h-5 mr-2" />
                Entrar
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Contas de Teste:</strong>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                <strong>Funcionário:</strong> funcionario@lava-jato.com | senha123
              </div>
              <div>
                <strong>Administrador:</strong> admin@lava-jato.com | admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;