import React, { useState } from 'react';
import { User, Clock, Car, CheckCircle, Phone, Trash2, MessageCircle } from 'lucide-react';
import { Order, OrderStatus, AdminViewProps } from '../types/types';



export interface Service {
  id: string;
  name: string;
  price: string;
}

export interface CurrentOrder {
  customerName: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: string;
  extraServices: string[];
}

interface ServiceTypeWithDuration extends Service {
  duration: number;
}

interface ExtraService extends Service {
  needsApproval: boolean;
}

const serviceTypes: ServiceTypeWithDuration[] = [
  { id: 'simples', name: 'Lavagem Simples', price: 'R$ 15,00', duration: 30 },
  { id: 'completa', name: 'Lavagem Completa', price: 'R$ 25,00', duration: 45 },
  { id: 'detalhada', name: 'Lavagem Detalhada', price: 'R$ 40,00', duration: 60 },
  { id: 'premium', name: 'Lavagem Premium', price: 'R$ 60,00', duration: 90 }
];

const extraServices: ExtraService[] = [
  { id: 'motor', name: 'Lavagem do Motor', price: 'R$ 20,00', needsApproval: true },
  { id: 'cera', name: 'Enceramento', price: 'R$ 15,00', needsApproval: false },
  { id: 'aspiracao', name: 'Aspiração Detalhada', price: 'R$ 10,00', needsApproval: false },
  { id: 'pneus', name: 'Pretinho nos Pneus', price: 'R$ 8,00', needsApproval: false }
];

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onSendWhatsApp: (order: Order) => void;
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.WAITING: return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case OrderStatus.IN_PROGRESS: return 'bg-blue-100 border-blue-300 text-blue-800';
    case OrderStatus.READY: return 'bg-green-100 border-green-300 text-green-800';
    case OrderStatus.COMPLETED: return 'bg-gray-100 border-gray-300 text-gray-800';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.WAITING: return 'Aguardando';
    case OrderStatus.IN_PROGRESS: return 'Em Andamento';
    case OrderStatus.READY: return 'Pronto';
    case OrderStatus.COMPLETED: return 'Finalizado';
    default: return status;
  }
};

const getStatusIcon = (status: OrderStatus): React.ReactElement => {
  switch (status) {
    case OrderStatus.WAITING: return <Clock className="w-5 h-5" />;
    case OrderStatus.IN_PROGRESS: return <Car className="w-5 h-5" />;
    case OrderStatus.READY: return <CheckCircle className="w-5 h-5" />;
    case OrderStatus.COMPLETED: return <CheckCircle className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
  switch (currentStatus) {
    case OrderStatus.WAITING: return OrderStatus.IN_PROGRESS;
    case OrderStatus.IN_PROGRESS: return OrderStatus.READY;
    case OrderStatus.READY: return OrderStatus.COMPLETED;
    default: return currentStatus;
  }
};

const getNextStatusText = (currentStatus: OrderStatus): string => {
  switch (currentStatus) {
    case OrderStatus.WAITING: return 'Iniciar Lavagem';
    case OrderStatus.IN_PROGRESS: return 'Marcar como Pronto';
    case OrderStatus.READY: return 'Finalizar (Retirado)';
    default: return 'Finalizado';
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, onDeleteOrder, onSendWhatsApp }): React.ReactElement => {
  const service = serviceTypes.find(s => s.id === order.serviceType);
  const extras = order.extraServices
    .map(id => extraServices.find(s => s.id === id))
    .filter((extra): extra is ExtraService => Boolean(extra));

  const calculateTotal = (): string => {
    const servicePrice = parseFloat(service?.price.replace('R$ ', '').replace(',', '.') || '0');
    const extrasPrice = extras.reduce((total, extra) => {
      return total + parseFloat(extra.price.replace('R$ ', '').replace(',', '.'));
    }, 0);
    return `R$ ${(servicePrice + extrasPrice).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Pedido #{order.id}</h3>
          <p className="text-sm text-gray-600">{order.createdAt?.toLocaleString('pt-BR')}</p>
        </div>
        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Cliente</h4>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-gray-600 flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {order.phone}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Veículo</h4>
          <p className="text-gray-600">{order.carModel}</p>
          {order.carPlate && <p className="text-gray-600">Placa: {order.carPlate}</p>}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Serviços</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-medium text-gray-800">{service?.name} - {service?.price}</p>
          {extras.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Extras:</p>
              {extras.map(extra => (
                <p key={extra.id} className="text-sm text-gray-600">
                  • {extra.name} - {extra.price}
                  {extra.needsApproval && <span className="text-orange-600 ml-1">(aprovação necessária)</span>}
                </p>
              ))}
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <p className="font-bold text-gray-800">Total: {calculateTotal()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {order.status !== OrderStatus.COMPLETED && (
          <button
            onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {getStatusIcon(getNextStatus(order.status))}
            {getNextStatusText(order.status)}
          </button>
        )}
        
        <button
          onClick={() => onSendWhatsApp(order)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
        
        <button
          onClick={() => onDeleteOrder(order.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>
    </div>
  );
};

const AdminView: React.FC<AdminViewProps> = ({ orders, onUpdateOrderStatus, onDeleteOrder }): React.ReactElement => {
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const handleSendWhatsApp = (order: Order): void => {
    const service = serviceTypes.find(s => s.id === order.serviceType);
    let message = '';
    
    switch (order.status) {
      case OrderStatus.WAITING:
        message = `Olá ${order.customerName}! Recebemos seu ${order.carModel} para ${service?.name}. Seu pedido #${order.id} está na fila. Obrigado!`;
        break;
      case OrderStatus.IN_PROGRESS:
        message = `${order.customerName}, sua ${service?.name} do ${order.carModel} já está em andamento! Pedido #${order.id}`;
        break;
      case OrderStatus.READY:
        message = `🎉 ${order.customerName}, seu ${order.carModel} está pronto! Pode vir buscar no Lava-Jato Santa Mônica. Pedido #${order.id}`;
        break;
      case OrderStatus.COMPLETED:
        message = `Obrigado ${order.customerName}! Esperamos que tenha gostado do nosso serviço. Volte sempre! Pedido #${order.id}`;
        break;
    }
    
    alert(`WhatsApp enviado para ${order.phone}:\n\n${message}`);
  };

  const getOrderCountByStatus = (status: OrderStatus): number => {
    return orders.filter(o => o.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Painel de Funcionários</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus(OrderStatus.WAITING)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === OrderStatus.WAITING ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                Aguardando ({getOrderCountByStatus(OrderStatus.WAITING)})
              </button>
              <button
                onClick={() => setFilterStatus(OrderStatus.IN_PROGRESS)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === OrderStatus.IN_PROGRESS ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Em Andamento ({getOrderCountByStatus(OrderStatus.IN_PROGRESS)})
              </button>
              <button
                onClick={() => setFilterStatus(OrderStatus.READY)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === OrderStatus.READY ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Prontos ({getOrderCountByStatus(OrderStatus.READY)})
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">
                {filterStatus === 'all' ? 'Não há pedidos cadastrados.' : `Não há pedidos com status "${getStatusText(filterStatus as OrderStatus)}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={onUpdateOrderStatus}
                  onDeleteOrder={onDeleteOrder}
                  onSendWhatsApp={handleSendWhatsApp}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;