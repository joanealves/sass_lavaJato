import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Clock, 
  Car, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Calendar,
  LucideIcon
} from 'lucide-react';

import { Order, OrderStatus, Service } from '../types/types'; 

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

interface ServiceChartProps {
  orders: Order[];
}

interface RecentOrdersProps {
  orders: Order[];
}

export interface DashboardViewProps { 
  orders: Order[];
}

interface ServiceStat extends Service {
  count: number;
  percentage: string | number;
}

interface DashboardStats {
  totalOrders: number;
  waitingOrders: number;
  inProgressOrders: number;
  readyOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  todayOrders: number;
}

const serviceTypes: Service[] = [
  { id: 'simples', name: 'Lavagem Simples', price: 'R$ 15,00' },
  { id: 'completa', name: 'Lavagem Completa', price: 'R$ 25,00' },
  { id: 'detalhada', name: 'Lavagem Detalhada', price: 'R$ 40,00' },
  { id: 'premium', name: 'Lavagem Premium', price: 'R$ 60,00' }
];

const extraServices: Service[] = [
  { id: 'motor', name: 'Lavagem do Motor', price: 'R$ 20,00' },
  { id: 'cera', name: 'Enceramento', price: 'R$ 15,00' },
  { id: 'aspiracao', name: 'Aspiração Detalhada', price: 'R$ 10,00' },
  { id: 'pneus', name: 'Pretinho nos Pneus', price: 'R$ 8,00' }
];

const parsePrice = (price: string): number => {
  return parseFloat(price.replace('R$ ', '').replace(',', '.')) || 0;
};

const formatPrice = (value: number): string => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.WAITING:
      return 'text-yellow-600 bg-yellow-100';
    case OrderStatus.IN_PROGRESS:
      return 'text-blue-600 bg-blue-100';
    case OrderStatus.READY:
      return 'text-green-600 bg-green-100';
    case OrderStatus.COMPLETED:
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.WAITING:
      return 'Aguardando';
    case OrderStatus.IN_PROGRESS:
      return 'Em Andamento';
    case OrderStatus.READY:
      return 'Pronto';
    case OrderStatus.COMPLETED:
      return 'Finalizado';
    default:
      return status; 
  }
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
    </div>
  </div>
);

const ServiceChart: React.FC<ServiceChartProps> = ({ orders }) => {
  const serviceStats: ServiceStat[] = serviceTypes.map(service => {
    const count = orders.filter(order => order.serviceType === service.id).length;
    const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : 0;
    return { ...service, count, percentage };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Serviços Mais Solicitados
      </h3>
      <div className="space-y-4">
        {serviceStats.map(service => (
          <div key={service.id} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{service.name}</span>
                <span className="text-sm text-gray-600">{service.count} ({service.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${service.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Pedidos Recentes
      </h3>
      <div className="space-y-3">
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum pedido cadastrado ainda</p>
        ) : (
          recentOrders.map(order => {
            const service = serviceTypes.find(s => s.id === order.serviceType);
            const orderDate = typeof order.createdAt === 'string' ? new Date(order.createdAt) : order.createdAt;
            
            return (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">#{order.id} - {order.customerName}</p>
                  <p className="text-sm text-gray-600">{service?.name || 'Serviço não encontrado'}</p>
                  <p className="text-xs text-gray-500">
                    {orderDate.toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ orders }) => {
  const calculateStats = (): DashboardStats => {
    const totalOrders = orders.length;
    const waitingOrders = orders.filter(o => o.status === OrderStatus.WAITING).length;
    const inProgressOrders = orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length;
    const readyOrders = orders.filter(o => o.status === OrderStatus.READY).length;
    const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

    const calculateOrderRevenue = (order: Order): number => {
      const service = serviceTypes.find(s => s.id === order.serviceType);
      const servicePrice = service ? parsePrice(service.price) : 0;
      
      const extrasPrice = order.extraServices.reduce((extrasTotal, extraId) => {
        const extra = extraServices.find(e => e.id === extraId);
        return extrasTotal + (extra ? parsePrice(extra.price) : 0);
      }, 0);
      
      return servicePrice + extrasPrice;
    };

    const totalRevenue = orders.reduce((total, order) => {
      return total + calculateOrderRevenue(order);
    }, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(order => {
      const orderDate = typeof order.createdAt === 'string' ? new Date(order.createdAt) : order.createdAt;
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const todayRevenue = todayOrders.reduce((total, order) => {
      return total + calculateOrderRevenue(order);
    }, 0);

    return {
      totalOrders,
      waitingOrders,
      inProgressOrders,
      readyOrders,
      completedOrders,
      totalRevenue,
      todayRevenue,
      todayOrders: todayOrders.length
    };
  };

  const stats = calculateStats();

  const completionRate = stats.totalOrders > 0 
    ? (stats.completedOrders / stats.totalOrders * 100).toFixed(1) 
    : '0.0';

  const averageTicket = stats.totalOrders > 0 
    ? (stats.totalRevenue / stats.totalOrders).toFixed(2).replace('.', ',') 
    : '0,00';

  const activeOrders = stats.readyOrders + stats.inProgressOrders;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-gray-600">Visão geral do Lava-Jato Santa Mônica</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Pedidos"
            value={stats.totalOrders}
            icon={Car}
            color="#3B82F6"
            subtitle="Todos os tempos"
          />
          <StatCard
            title="Pedidos Hoje"
            value={stats.todayOrders}
            icon={Calendar}
            color="#10B981"
            subtitle="Últimas 24h"
          />
          <StatCard
            title="Receita Total"
            value={formatPrice(stats.totalRevenue)}
            icon={DollarSign}
            color="#F59E0B"
            subtitle="Todos os tempos"
          />
          <StatCard
            title="Receita Hoje"
            value={formatPrice(stats.todayRevenue)}
            icon={TrendingUp}
            color="#8B5CF6"
            subtitle="Últimas 24h"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Aguardando"
            value={stats.waitingOrders}
            icon={Clock}
            color="#F59E0B"
            subtitle="Na fila"
          />
          <StatCard
            title="Em Andamento"
            value={stats.inProgressOrders}
            icon={Car}
            color="#3B82F6"
            subtitle="Sendo lavados"
          />
          <StatCard
            title="Prontos"
            value={stats.readyOrders}
            icon={CheckCircle}
            color="#10B981"
            subtitle="Para retirada"
          />
          <StatCard
            title="Finalizados"
            value={stats.completedOrders}
            icon={Users}
            color="#6B7280"
            subtitle="Retirados"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceChart orders={orders} />
          <RecentOrders orders={orders} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {completionRate}%
              </div>
              <div className="text-sm text-blue-700">Taxa de Conclusão</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {averageTicket}
              </div>
              <div className="text-sm text-green-700">Ticket Médio (R$)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {activeOrders}
              </div>
              <div className="text-sm text-purple-700">Pedidos Ativos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;