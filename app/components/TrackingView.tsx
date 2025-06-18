import React, { useState } from 'react';
import { Eye, Clock, Car, CheckCircle, Search } from 'lucide-react';

import { Order, OrderStatus } from '../types/types'; 

interface ServiceType {
  id: string;
  name: string;
  price: string;
  duration: number;
}

interface ExtraService {
  id: string;
  name: string;
  price: string;
  needsApproval: boolean;
}

interface TrackingViewProps {
  orders: Order[]; 
}

const serviceTypes: ServiceType[] = [
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

const OrderTrackingDetails: React.FC<{ order: Order }> = ({ order }) => {
  const getStatusProgress = (status: OrderStatus): number => { 
    switch (status) {
      case OrderStatus.WAITING: return 25;
      case OrderStatus.IN_PROGRESS: return 50;
      case OrderStatus.READY: return 75;
      case OrderStatus.COMPLETED: return 100;
      default: return 0;
    }
  };

  const getProgressColor = (status: OrderStatus): string => { 
    switch (status) {
      case OrderStatus.WAITING: return 'bg-yellow-500';
      case OrderStatus.IN_PROGRESS: return 'bg-blue-500';
      case OrderStatus.READY: return 'bg-green-500';
      case OrderStatus.COMPLETED: return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: OrderStatus): React.ReactElement => { 
    switch (status) {
      case OrderStatus.WAITING: return <Clock className="w-8 h-8 text-yellow-600" />;
      case OrderStatus.IN_PROGRESS: return <Car className="w-8 h-8 text-blue-600" />;
      case OrderStatus.READY: return <CheckCircle className="w-8 h-8 text-green-600" />;
      case OrderStatus.COMPLETED: return <CheckCircle className="w-8 h-8 text-gray-600" />;
      default: return <Clock className="w-8 h-8 text-gray-400" />;
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

  const getEstimatedTime = (order: Order): string => {
    if (!order) return '';
    
    const service = serviceTypes.find(s => s.id === order.serviceType);
    if (!service) return '';
    
    const baseDuration = service.duration;
    const extraTime = (order.extraServices || []).length * 15;
    const totalMinutes = baseDuration + extraTime;
    
    if (order.status === OrderStatus.COMPLETED) return 'Finalizado';
    if (order.status === OrderStatus.READY) return 'Pronto para retirada!'; 
    
    return `Tempo estimado: ${totalMinutes} minutos`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Pedido #{order.id}</h3>
        <p className="text-gray-600">Olá, {order.customerName || 'Cliente'}!</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progresso</span>
          <span className="text-sm font-semibold text-gray-800">{getStatusText(order.status)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(order.status)}`}
            style={{ width: `${getStatusProgress(order.status)}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6 text-center">
        <div className="mb-4">
          {getStatusIcon(order.status)}
        </div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">
          Status: {getStatusText(order.status)}
        </h4>
        <p className="text-gray-600 mb-2">{getEstimatedTime(order)}</p>
        
        {order.status === OrderStatus.READY && ( 
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
            <div className="text-green-800 font-semibold text-lg">🎉 Seu carro está pronto!</div>
            <div className="text-green-700 text-sm">Pode vir buscar no Lava-Jato Santa Mônica</div>
          </div>
        )}
      </div>

      <OrderTimeline order={order} />
      <OrderServiceDetails order={order} />
    </div>
  );
};

const OrderTimeline: React.FC<{ order: Order }> = ({ order }) => {
  const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return 'Data não disponível';
    
    if (typeof date === 'string') {
      return new Date(date).toLocaleString('pt-BR');
    }
    
    if (date instanceof Date) {
      return date.toLocaleString('pt-BR');
    }
    
    return 'Data inválida';
  };

  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-semibold text-gray-700">Linha do Tempo</h4>
      
      <div className="space-y-3">
        <div className={`flex items-center gap-3 p-3 rounded-lg ${order.status === OrderStatus.WAITING ? 'bg-yellow-100 border border-yellow-200' : 'bg-gray-50'}`}>
          <div className={`w-3 h-3 rounded-full ${order.status === OrderStatus.WAITING ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
          <div>
            <div className="font-medium text-gray-800">Pedido Recebido</div>
            <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg ${order.status === OrderStatus.IN_PROGRESS ? 'bg-blue-100 border border-blue-200' : 'bg-gray-50'}`}>
          <div className={`w-3 h-3 rounded-full ${[OrderStatus.IN_PROGRESS, OrderStatus.READY, OrderStatus.COMPLETED].includes(order.status) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div>
            <div className="font-medium text-gray-800">Lavagem Iniciada</div>
            <div className="text-sm text-gray-600">
              {[OrderStatus.IN_PROGRESS, OrderStatus.READY, OrderStatus.COMPLETED].includes(order.status) ? 'Em andamento' : 'Aguardando'}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg ${order.status === OrderStatus.READY ? 'bg-green-100 border border-green-200' : 'bg-gray-50'}`}>
          <div className={`w-3 h-3 rounded-full ${[OrderStatus.READY, OrderStatus.COMPLETED].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div>
            <div className="font-medium text-gray-800">Carro Pronto</div>
            <div className="text-sm text-gray-600">
              {order.readyAt ? formatDate(order.readyAt) : 'Aguardando finalização'}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg ${order.status === OrderStatus.COMPLETED ? 'bg-gray-100 border border-gray-200' : 'bg-gray-50'}`}>
          <div className={`w-3 h-3 rounded-full ${order.status === OrderStatus.COMPLETED ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
          <div>
            <div className="font-medium text-gray-800">Carro Retirado</div>
            <div className="text-sm text-gray-600">
              {order.status === OrderStatus.COMPLETED ? 'Pedido finalizado' : 'Aguardando retirada'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderServiceDetails: React.FC<{ order: Order }> = ({ order }) => { 
  const getServiceName = (serviceId: string): string => {
    const service = serviceTypes.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const getExtraServicesNames = (extraServiceIds: string[] | undefined): string => {
    if (!Array.isArray(extraServiceIds) || extraServiceIds.length === 0) {
      return 'Nenhum serviço extra';
    }
    
    return extraServiceIds.map(id => {
      const service = extraServices.find(s => s.id === id);
      return service ? service.name : 'Serviço não encontrado';
    }).join(', ');
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h4 className="font-semibold text-gray-700 mb-3">Detalhes do Serviço</h4>
      <div className="text-sm text-gray-600 space-y-1">
        <div><strong>Serviço:</strong> {getServiceName(order.serviceType)}</div>
        <div><strong>Contato:</strong> {order.phone || 'Não informado'}</div> 
        <div><strong>Veículo:</strong> {order.carModel || 'Não informado'} {order.carPlate && `(${order.carPlate})`}</div>
        <div><strong>Extras:</strong> {getExtraServicesNames(order.extraServices)}</div>
      </div>
    </div>
  );
};

const TrackingView: React.FC<TrackingViewProps> = ({ orders = [] }) => {
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const searchOrder = (): void => {
    if (!searchOrderId.trim()) {
      alert('Digite o número do pedido!');
      return;
    }
    
    let found = orders.find(o => o.id === searchOrderId.trim());

    if (!found) {
      found = sampleOrders.find(o => o.id === searchOrderId.trim());
    }

    setFoundOrder(found || null);
    if (!found) {
      alert('Pedido não encontrado! Verifique o número digitado.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      searchOrder();
    }
  };

  const sampleOrders: Order[] = [
    {
      id: '1', 
      customerName: 'João Silva',
      phone: '11987654321', 
      serviceType: 'completa',
      carModel: 'Honda Civic',
      carPlate: 'ABC-1234',
      extraServices: ['cera', 'aspiracao'],
      status: OrderStatus.IN_PROGRESS, 
      createdAt: new Date(2025, 5, 18, 10, 30),
      readyAt: null
    },
    {
      id: '2', 
      customerName: 'Maria Santos',
      phone: '21998765432', 
      serviceType: 'premium',
      carModel: 'Toyota Corolla',
      carPlate: 'XYZ-9876',
      extraServices: ['motor', 'pneus'],
      status: OrderStatus.READY, 
      createdAt: new Date(2025, 5, 18, 9, 15),
      readyAt: new Date(2025, 5, 18, 11, 45)
    },
    {
      id: '3', 
      customerName: 'Pedro Costa',
      phone: '31976543210', 
      serviceType: 'simples',
      carModel: 'Volkswagen Gol',
      carPlate: 'DEF-5678',
      extraServices: [],
      status: OrderStatus.WAITING, 
      createdAt: new Date(2025, 5, 18, 11, 0),
      readyAt: null
    }
  ];

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Acompanhar Pedido</h2>
            <p className="text-gray-600">Digite o número do seu pedido para ver o andamento</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite o número do pedido (ex: 1, 2, 3...)"
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={searchOrder}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar
              </button>
            </div>

            {foundOrder === null && searchOrderId && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-600">Pedido não encontrado</p>
                <p className="text-sm text-gray-500">Verifique se o número está correto</p>
              </div>
            )}
          </div>
        </div>

        {foundOrder && (
          <OrderTrackingDetails order={foundOrder} />
        )}

        {!foundOrder && !searchOrderId && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Eye className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Como acompanhar seu pedido</h3>
            <div className="text-gray-600 text-left max-w-md mx-auto space-y-2">
              <p>• Você recebeu um número de pedido após fazer o cadastro</p>
              <p>• Digite esse número no campo acima</p>
              <p>• Acompanhe o status em tempo real</p>
              <p>• Você receberá notificações por WhatsApp</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium mb-2">Para testar, use um destes números:</p>
              <div className="flex gap-2 justify-center flex-wrap"> 
                {sampleOrders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSearchOrderId(order.id.toString());
                      setFoundOrder(order);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    #{order.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingView;