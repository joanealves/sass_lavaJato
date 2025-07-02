'use client';
import React, { useState } from 'react';
import { Car, LogIn } from 'lucide-react';
import Link from 'next/link'; 
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
            Bem-vindo ao CarFlow!
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

        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-4 text-gray-700 shadow-sm max-w-md mx-auto">
            <strong className="text-base font-semibold text-gray-800">Plano Freemium</strong>
            <div className="text-xs mt-1 text-gray-500 leading-relaxed">
              • Até 50 pedidos por mês<br />
              • Acompanhamento de pedidos em tempo real<br />
              • Agendamento simplificado
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 px-4 py-3 rounded-xl inline-block border border-blue-100 text-sm text-blue-800 font-medium shadow-sm max-w-md mx-auto">
            🎁 Experimente grátis por <span className="font-bold text-blue-900">7 dias</span> todos os recursos premium!
          </div>

          <Link
            href="/PricingPage"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 hover:underline text-sm font-medium"
          >
            Ver todos os planos e fazer upgrade →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginView;
