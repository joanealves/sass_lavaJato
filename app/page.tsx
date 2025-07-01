'use client';

import React, { useState, useEffect } from 'react';

import LoginView from './auth/Login';
import CustumerView from './components/CustumerView'; 
import AdminView from './components/AdminView';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';
import SchedulingSystem from './components/SchedulingSystem';
import Navigation from './components/Navigation';

import { 
  Order, 
  OrderStatus, 
  CurrentOrder, 
  ServiceType,
} from './types/orders';
import { UserRole } from './types/auth';
import { AllRoutes } from './types/routes';

import { ScheduledOrder } from './types/scheduling';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useNavigationGuard } from './hooks/useNavigationGuard';

const AppContent: React.FC = () => {
  const { user, isLoading, login, logout, register } = useAuth();
  const { getDefaultRoute, canNavigateTo, getNavigationItems } = useNavigationGuard(user?.role);

  const [currentView, setCurrentView] = useState<AllRoutes>('home');
  const [orders, setOrders] = useState<Order[]>([]);

  const [currentOrder, setCurrentOrder] = useState<CurrentOrder>({
    customerName: '',
    phone: '',
    carModel: '',
    carPlate: '',
    serviceType: ServiceType.SIMPLE,
    extraServices: [],
  });

  useEffect(() => {
    if (user) {
      const defaultRoute = getDefaultRoute();
      setCurrentView(defaultRoute);

      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          customerName: 'João Silva',
          customerEmail: 'joao@example.com',
          phone: '11987654321',
          carModel: 'Ford Ka',
          carPlate: 'ABC1234',
          serviceType: ServiceType.SIMPLE,
          extraServices: ['polimento'],
          status: OrderStatus.COMPLETED,
          totalPrice: 100,
          createdAt: new Date('2023-01-15T10:00:00Z'),
          readyAt: new Date('2023-01-15T11:00:00Z'),
          completedAt: new Date('2023-01-15T11:30:00Z'),
        },
        {
          id: 'ORD002',
          customerName: 'Maria Souza',
          customerEmail: 'maria@example.com',
          phone: '11998765432',
          carModel: 'Fiat Palio',
          carPlate: 'DEF5678',
          serviceType: ServiceType.COMPLETE,
          extraServices: [],
          status: OrderStatus.IN_PROGRESS,
          totalPrice: 50,
          createdAt: new Date('2023-01-16T14:00:00Z'),
        },
        {
          id: 'ORD003',
          customerName: user.name,
          customerEmail: user.email,
          phone: user.phone,
          carModel: 'Honda Civic',
          carPlate: 'GHI9012',
          serviceType: ServiceType.COMPLETE,
          extraServices: ['enceramento'],
          status: OrderStatus.WAITING,
          totalPrice: 80,
          createdAt: new Date(),
        },
      ];

      setOrders(mockOrders);
    } else {
      setCurrentView('home');
      setOrders([]);
    }
  }, [user, getDefaultRoute]);

  const handleViewChange = (view: AllRoutes) => {
    if (canNavigateTo(view)) {
      setCurrentView(view);
    } else {
      console.warn(`Acesso negado à rota: ${view}. Redirecionando para rota padrão.`);
      setCurrentView(getDefaultRoute());
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
  };

  const handleSubmitOrder = (currentOrderData: CurrentOrder) => {
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      customerName: currentOrderData.customerName,
      customerEmail: user?.email || '',
      phone: currentOrderData.phone,
      carModel: currentOrderData.carModel,
      carPlate: currentOrderData.carPlate,
      serviceType: currentOrderData.serviceType,
      extraServices: currentOrderData.extraServices,
      status: OrderStatus.PENDING,
      totalPrice: calculateOrderPrice(currentOrderData),
      createdAt: new Date(),
    };
    handleAddOrder(newOrder);
    setCurrentOrder({
      customerName: '',
      phone: '',
      carModel: '',
      carPlate: '',
      serviceType: ServiceType.SIMPLE,
      extraServices: [],
    });
    alert('Pedido criado com sucesso!');
  };

  const calculateOrderPrice = (orderData: CurrentOrder): number => {
    const basePrice = orderData.serviceType === ServiceType.SIMPLE ? 15 :
                     orderData.serviceType === ServiceType.COMPLETE ? 25 :
                     orderData.serviceType === ServiceType.DETAILED ? 40 : 60;
    
    const extraPrice = orderData.extraServices.reduce((sum, service) => {
      switch (service) {
        case 'motor': return sum + 20;
        case 'cera': return sum + 15;
        case 'aspiracao': return sum + 10;
        case 'pneus': return sum + 8;
        default: return sum;
      }
    }, 0);
    
    return basePrice + extraPrice;
  };

  const handleAddScheduledOrder = (newScheduledOrder: ScheduledOrder) => {
    console.log('Agendamento adicionado:', newScheduledOrder);
  };

  const handleSendWhatsApp = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const message = `Olá ${order.customerName}! Seu pedido ${orderId} foi atualizado. Status: ${order.status}`;
      const whatsappUrl = `https://wa.me/55${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-700 text-lg mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'login' || currentView === 'register') {
    return <LoginView onLogin={login} onRegister={register} />;
  }

  const renderCurrentView = () => {
    if (!canNavigateTo(currentView)) {
      return <AccessDeniedView />;
    }

    switch (currentView) {
      case 'home':
        return <HomeView onViewChange={handleViewChange} />;

      case 'customer':
        return (
          <CustumerView
            currentOrder={currentOrder}
            setCurrentOrder={setCurrentOrder}
            onSubmit={handleSubmitOrder}
          />
        );

      case 'scheduling':
        return (
          <SchedulingSystem
            onAddScheduledOrder={handleAddScheduledOrder}
            isClientView={!user || user.role === UserRole.EMPLOYEE}
          />
        );

      case 'tracking':
        return <TrackingView orders={orders} />;

      case 'employee-dashboard':
        return <DashboardView orders={orders} userRole={user?.role} />;

      case 'employee-orders':
        return (
          <AdminView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onSendWhatsApp={handleSendWhatsApp}
            isClientView={false}
          />
        );

      case 'employee-scheduling':
        return <SchedulingSystem onAddScheduledOrder={handleAddScheduledOrder} isClientView={false} />;

      case 'messages':
        return <MessagesView />;

      case 'admin-dashboard':
        return <DashboardView orders={orders} userRole={user?.role} />;

      case 'admin-users':
        return <UsersManagementView />;

      case 'admin-employees':
        return <EmployeesManagementView />;

      case 'admin-orders':
        return (
          <AdminView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onSendWhatsApp={handleSendWhatsApp}
            isClientView={false}
          />
        );

      case 'admin-scheduling':
        return <SchedulingSystem onAddScheduledOrder={handleAddScheduledOrder} isClientView={false} />;

      case 'admin-reports':
        return <ReportsView orders={orders} />;

      case 'admin-settings':
        return <SettingsView />;

      case 'admin-financial':
        return <FinancialView orders={orders} />;

      default:
        return <NotFoundView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
        userRole={user?.role || UserRole.PUBLIC}
        onLogout={logout}
        navigationItems={getNavigationItems()}
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

const HomeView: React.FC<{ onViewChange: (view: AllRoutes) => void }> = ({ onViewChange }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao Lava-Jato</h1>
      <p className="text-xl text-gray-600 mb-8">Serviços de qualidade para seu veículo</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
        onClick={() => onViewChange('customer')}
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Fazer Pedido</h3>
        <p className="text-gray-600">Solicite nossos serviços de lavagem</p>
      </div>

      <div
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
        onClick={() => onViewChange('tracking')}
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Rastrear Pedido</h3>
        <p className="text-gray-600">Acompanhe o status do seu pedido</p>
      </div>

      <div
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
        onClick={() => onViewChange('scheduling')}
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-700 ">Agendamento</h3>
        <p className="text-gray-600">Agende um horário conveniente</p>
      </div>
    </div>
  </div>
);

const MessagesView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-500">Sistema de mensagens em desenvolvimento.</p>
    </div>
  </div>
);

const UsersManagementView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-500">Gerenciamento de clientes em desenvolvimento.</p>
    </div>
  </div>
);

const EmployeesManagementView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Gerenciar Funcionários</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-500">Gerenciamento de funcionários em desenvolvimento.</p>
    </div>
  </div>
);

const ReportsView: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
          <p className="text-gray-600">Total de Pedidos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === OrderStatus.COMPLETED).length}
          </p>
          <p className="text-gray-600">Pedidos Concluídos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length}
          </p>
          <p className="text-gray-600">Em Andamento</p>
        </div>
      </div>
    </div>
  </div>
);

const SettingsView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-500">Configurações do sistema em desenvolvimento.</p>
    </div>
  </div>
);

const FinancialView: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Dados Financeiros</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Receita Total</h3>
          <p className="text-3xl font-bold text-green-600">
            R$ {orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Pedidos este Mês</h3>
          <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
        </div>
      </div>
    </div>
  </div>
);

const AccessDeniedView: React.FC = () => (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium text-red-600 mb-2">Acesso Negado</h3>
    <p className="text-gray-500">Você não tem permissão para acessar esta página.</p>
  </div>
);

const NotFoundView: React.FC = () => (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium text-gray-600 mb-2">Página não encontrada</h3>
    <p className="text-gray-500">A rota que você tentou acessar não existe.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;