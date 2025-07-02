import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, LoginCredentials, RegisterData, DEFAULT_ROLE_PERMISSIONS } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const DEMO_USERS: (User & { senha: string })[] = [
  {
    id: '2',
    name: 'Maria Funcionária',
    email: 'funcionario@lava-jato.com',
    phone: '11987654322',
    senha: 'senha123',
    role: UserRole.EMPLOYEE,
    permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.EMPLOYEE],
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Carlos Admin',
    email: 'admin@lava-jato.com',
    phone: '11987654323',
    senha: 'admin123',
    role: UserRole.ADMIN,
    permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.ADMIN],
    createdAt: new Date()
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = DEMO_USERS.find(u => 
        u.email === credentials.email && 
        u.senha === credentials.password
      );

      if (foundUser) {
        const { senha: _senha, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        console.log('senha', _senha)
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingUser = DEMO_USERS.find(u => u.email === data.email);
      if (existingUser) {
        return false; 
      }

      const newUser: User & { senha: string } = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        senha: data.password,
        role: UserRole.EMPLOYEE, 
        permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.EMPLOYEE],
        createdAt: new Date()
      };

      DEMO_USERS.push(newUser);
      const { senha: _senha, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      console.log('senha', _senha)
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};