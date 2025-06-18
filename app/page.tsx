'use client';

import React, { useState } from 'react';
import LoginView from './components/Login';
import Header from './components/Header';
import CustomerView from './components/CustumerView';
import AdminView from './components/AdminView';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';

import { Order, OrderStatus, CurrentOrder } from './types/types'; 

type UserType = 'user' | 'admin' | null;
type ViewType = 'customer' | 'admin' | 'dashboard' | 'tracking';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentView, setCurrentView] = useState<ViewType>('customer');
  const [orders, setOrders] = useState<Order[]>([]); 
  const [orderCounter, setOrderCounter] = useState<number>(1);

  const [currentOrder, setCurrentOrder] = useState<CurrentOrder>({
    customerName: '',
    phone: '',
    carModel: '',
    carPlate: '',
    serviceType: '',
    extraServices: []
  });

  const handleLogin = (type: UserType): void => {
    setUserType(type);
    if (type === 'admin') {
      setCurrentView('admin'); 
    } else if (type === 'user') {
      setCurrentView('customer'); 
    }
  };

  const handleLogout = (): void => {
    setUserType(null);
    setCurrentView('customer');
    setCurrentOrder({
      customerName: '',
      phone: '',
      carModel: '',
      carPlate: '',
      serviceType: '',
      extraServices: []
    });
  };

  const handleViewChange = (view: ViewType): void => {
    if (userType !== 'admin' && (view === 'admin' || view === 'dashboard')) {
      return;
    }
    
    if (userType === null && view !== 'customer') {
      return;
    }
    
    setCurrentView(view);
  };

  const handleSubmitOrder = (): void => {
    if (!currentOrder.customerName.trim()) {
      alert('Por favor, digite o nome do cliente!');
      return;
    }
    
    if (!currentOrder.phone.trim()) {
      alert('Por favor, digite o WhatsApp!');
      return;
    }
    
    if (!currentOrder.serviceType) {
      alert('Por favor, selecione o tipo de lavagem!');
      return;
    }

    const newOrder: Order = {
      id: orderCounter.toString(), 
      customerName: currentOrder.customerName.trim(),
      phone: currentOrder.phone.trim(),
      carModel: currentOrder.carModel.trim() || 'Não informado',
      carPlate: currentOrder.carPlate.trim(),
      serviceType: currentOrder.serviceType,
      extraServices: [...currentOrder.extraServices],
      status: OrderStatus.WAITING,
      createdAt: new Date(),
      readyAt: null
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    setOrderCounter(prev => prev + 1);

    setCurrentOrder({
      customerName: '',
      phone: '',
      carModel: '',
      carPlate: '',
      serviceType: '',
      extraServices: []
    });

    alert(`Pedido #${newOrder.id} criado com sucesso!\n\nCliente: ${newOrder.customerName}\nGuarde este número para acompanhar seu pedido.`);

    if (userType === 'user') {
      setCurrentView('tracking');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus): void => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder: Order = { ...order, status: newStatus };
          
          if (newStatus === OrderStatus.READY && !order.readyAt) {
            updatedOrder.readyAt = new Date();
          }
          
          return updatedOrder;
        }
        return order;
      })
    );

    const statusText: Record<OrderStatus, string> = {
      [OrderStatus.WAITING]: 'Aguardando',
      [OrderStatus.IN_PROGRESS]: 'Em Andamento',
      [OrderStatus.READY]: 'Pronto',
      [OrderStatus.COMPLETED]: 'Finalizado'
    };
    
    alert(`Pedido #${orderId} atualizado para: ${statusText[newStatus]}`);
  };

  const handleDeleteOrder = (orderId: string): void => {
    if (window.confirm(`Tem certeza que deseja excluir o pedido #${orderId}?`)) {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      alert(`Pedido #${orderId} excluído com sucesso!`);
    }
  };

  const renderCurrentView = (): React.ReactNode => {
    if (userType === null) {
      return <LoginView onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'customer':
        return (
          <CustomerView
            currentOrder={currentOrder}
            setCurrentOrder={setCurrentOrder}
            onSubmitOrder={handleSubmitOrder}
          />
        );
      
      case 'admin':
        if (userType !== 'admin') {
          return <LoginView onLogin={handleLogin} />;
        }
        return (
          <AdminView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        );
      
      case 'dashboard':
        if (userType !== 'admin') {
          return <LoginView onLogin={handleLogin} />;
        }
        return (
          <div className="p-6">
            <DashboardView orders={orders} />
          </div>
        );
      
      case 'tracking':
        return <TrackingView orders={orders} />; 
        
      default:
        if (userType === 'admin') {
          return (
            <AdminView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          );
        } else {
          return (
            <CustomerView
              currentOrder={currentOrder}
              setCurrentOrder={setCurrentOrder}
              onSubmitOrder={handleSubmitOrder}
            />
          );
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {userType !== null && (
        <Header
          userType={userType}
          currentView={currentView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
        />
      )}
      
      <main>
        {renderCurrentView()}
      </main>

      {userType !== null && (
        <footer className="bg-white border-t border-gray-200 p-4 mt-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Schema Desenvolvimento - Sistema SaaS de Gerenciamento de Lava jatos e oficinas.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {userType === 'admin' ? 'Painel Administrativo' : 'Portal do Cliente'} • 
              Total de pedidos: {orders.length}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;