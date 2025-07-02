import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Car,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';

import { OrderStatus, DashboardViewProps } from '../types/orders';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-md ${color}`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {trend.isPositive ? 'Aumento' : 'Diminuição'} de
                  </span>
                  {Math.abs(trend.value)}%
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ orders }) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt) >= todayStart
  );
  
  const pendingOrders = orders.filter(order => 
    order.status === OrderStatus.PENDING || order.status === OrderStatus.WAITING
  );
  
  const inProgressOrders = orders.filter(order => 
    order.status === OrderStatus.IN_PROGRESS || order.status === OrderStatus.PROCESSING
  );
  
  const completedOrders = orders.filter(order => 
    order.status === OrderStatus.COMPLETED
  );
  
  const readyOrders = orders.filter(order => 
    order.status === OrderStatus.READY
  );
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  const ordersByStatus = [
    { status: 'Pendente', count: pendingOrders.length, color: 'bg-yellow-500' },
    { status: 'Em Andamento', count: inProgressOrders.length, color: 'bg-blue-500' },
    { status: 'Pronto', count: readyOrders.length, color: 'bg-green-500' },
    { status: 'Concluído', count: completedOrders.length, color: 'bg-gray-500' },
  ];
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.WAITING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.IN_PROGRESS:
      case OrderStatus.PROCESSING:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendente';
      case OrderStatus.WAITING:
        return 'Aguardando';
      case OrderStatus.IN_PROGRESS:
        return 'Em Andamento';
      case OrderStatus.PROCESSING:
        return 'Processando';
      case OrderStatus.READY:
        return 'Pronto';
      case OrderStatus.COMPLETED:
        return 'Concluído';
      case OrderStatus.CANCELLED:
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-600">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Pedidos"
          value={orders.length}
          icon={<Car className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        
        <StatCard
          title="Pedidos Hoje"
          value={todayOrders.length}
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        
        <StatCard
          title="Em Andamento"
          value={inProgressOrders.length}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        
        <StatCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Pedidos por Status
            </h3>
            <div className="space-y-3">
              {ordersByStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.status}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Alertas
            </h3>
            <div className="space-y-3">
              {pendingOrders.length > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {pendingOrders.length} pedido(s) pendente(s)
                    </p>
                    <p className="text-xs text-yellow-600">
                      Aguardando início do atendimento
                    </p>
                  </div>
                </div>
              )}
              
              {readyOrders.length > 0 && (
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {readyOrders.length} pedido(s) pronto(s)
                    </p>
                    <p className="text-xs text-green-600">
                      Aguardando retirada pelo cliente
                    </p>
                  </div>
                </div>
              )}
              
              {pendingOrders.length === 0 && readyOrders.length === 0 && (
                <div className="text-center py-4">
                  <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum alerta no momento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pedidos Recentes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Últimos 5 pedidos realizados
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentOrders.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Nenhum pedido encontrado
            </li>
          ) : (
            recentOrders.map((order) => (
              <li key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Car className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.carModel} - {order.carPlate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      R$ {order.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receita Hoje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {todayRevenue.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ticket Médio
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taxa de Conclusão
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;