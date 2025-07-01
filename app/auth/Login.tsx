import React, { useState } from 'react';
import { Car, LogIn, UserPlus } from 'lucide-react';
import { LoginCredentials, RegisterData } from '../types/auth';

interface LoginViewProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  onRegister: (userData: RegisterData) => Promise<boolean>;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister }): React.ReactElement => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAuth = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);

    let success = false;

    if (isRegisterMode) {
      if (!name || !email || !password || !confirmPassword || !phone) {
        setError('Por favor, preencha todos os campos para registro.');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setIsLoading(false);
        return;
      }

      success = await onRegister({ name, email, password, confirmPassword, phone });

      if (!success) {
        setError('Falha no registro. O email pode já estar em uso ou dados inválidos.');
      }

    } else {
      if (!email || !password) {
        setError('Por favor, preencha o email e a senha.');
        setIsLoading(false);
        return;
      }

      success = await onLogin({ email, password });

      if (!success) {
        setError('Email ou senha incorretos.');
      }
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleAuth();
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
            {isRegisterMode ? 'Crie sua conta para começar' : 'Faça login na sua conta'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-5">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Seu nome..."
              />
            </div>
          )}

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

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
            </>
          )}

          <button
            onClick={handleAuth}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              'Carregando...'
            ) : isRegisterMode ? (
              <>
                <UserPlus className="inline w-5 h-5 mr-2" />
                Registrar
              </>
            ) : (
              <>
                <LogIn className="inline w-5 h-5 mr-2" />
                Entrar
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {isRegisterMode ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button
              onClick={() => setIsRegisterMode(prev => !prev)}
              className="text-indigo-600 hover:text-indigo-800 font-medium ml-1 focus:outline-none"
            >
              {isRegisterMode ? 'Faça Login' : 'Registre-se'}
            </button>
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <strong>Plano Freemium</strong>
            <div className="text-xs mt-1">
              • Até 50 pedidos por mês
              <br />• Acompanhamento de pedidos em tempo real
              <br />• Agendamento simplificado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
