import React, { useState } from 'react';
import { Eye, Clock, Car, CheckCircle, Search, MessageCircle, Copy, Phone, AlertCircle } from 'lucide-react';
import { Order, OrderStatus, TrackingViewProps } from '../types/orders';

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

const generateWhatsAppLink = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

const OrderTrackingDetails: React.FC<{ order: Order }> = ({ order }) => {
  const [showNotifications, setShowNotifications] = useState(false);

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

  const copyOrderCode = () => {
    navigator.clipboard.writeText(order.id);
    alert('Código do pedido copiado!');
  };

 const generateStatusMessage = (status: OrderStatus): string => {
  const selectedService = serviceTypes.find(s => s.id === order.serviceType);

 const statusMessages: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.WAITING]: `🕐 *Pedido em Fila - ${order.id}*

Olá ${order.customerName}! Seu pedido está na fila de espera.

📋 *Status:* Aguardando início
🚙 *Veículo:* ${order.carModel} ${order.carPlate ? `(${order.carPlate})` : ''}
⏱️ *Previsão:* ${getEstimatedTime(order)}

Você será notificado quando iniciarmos o serviço!

🏪 *Lava-Jato*
📞 (11) 99999-9999`,

  [OrderStatus.IN_PROGRESS]: `🚗 *Serviço Iniciado - ${order.id}*

${order.customerName}, começamos a lavagem do seu veículo!

📋 *Status:* Em andamento
🧽 *Serviço:* ${selectedService?.name}
⏱️ *Tempo restante:* Aproximadamente ${selectedService?.duration} minutos

Você será notificado quando estiver pronto!

🏪 *Lava-Jato*
📞 (11) 99999-9999`,

  [OrderStatus.READY]: `✅ *Veículo Pronto - ${order.id}*

🎉 ${order.customerName}, seu veículo está pronto para retirada!

🚙 *Veículo:* ${order.carModel} ${order.carPlate ? `(${order.carPlate})` : ''}
📍 *Local:* Lava-Jato 
📞 *Contato:* (11) 99999-9999

⚠️ *Importante:* Retire em até 2 horas para evitar taxa de estacionamento.

Venha buscar quando puder! 🚗💨

🏪 *Lava-Jato*`,

  [OrderStatus.COMPLETED]: `🏁 *Serviço Finalizado - ${order.id}*

Obrigado ${order.customerName}! 

✅ Serviço concluído com sucesso
⭐ Que tal avaliar nosso atendimento?
🔄 Volte sempre que precisar

📱 *Próxima lavagem:* Mande mensagem direto no WhatsApp
🎁 *Dica:* Cliente frequente ganha desconto!

🏪 *Lava-Jato*
📞 (11) 99999-9999`
};

  return statusMessages[status] || `Status: ${getStatusText(status)}`;
};

  const sendStatusNotification = () => {
    const message = generateStatusMessage(order.status);
    const whatsappLink = generateWhatsAppLink(order.phone, message);
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-800">Pedido {order.id}</h3>
            <button
              onClick={copyOrderCode}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copiar código"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
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
          <p className="text-gray-600 mb-4">{getEstimatedTime(order)}</p>
          
          {order.status === OrderStatus.READY && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
              <div className="text-green-800 font-semibold text-lg">🎉 Seu carro está pronto!</div>
              <div className="text-green-700 text-sm">Pode vir buscar no Lava-Jato </div>
            </div>
          )}

          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={sendStatusNotification}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar por WhatsApp
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Ver Todas as Notificações
            </button>
          </div>
        </div>

        {showNotifications && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Notificações Disponíveis</h4>
            <div className="space-y-2">
              {Object.values(OrderStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    const message = generateStatusMessage(status);
                    const whatsappLink = generateWhatsAppLink(order.phone, message);
                    window.open(whatsappLink, '_blank');
                  }}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-800">{getStatusText(status)}</div>
                  <div className="text-sm text-gray-600">Enviar notificação de {getStatusText(status).toLowerCase()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <OrderTimeline order={order} />
        <OrderServiceDetails order={order} />
      </div>
    </div>
  );
};

const OrderTimeline: React.FC<{ order: Order }> = ({ order }) => {
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return 'Data não disponível';
    
    if (date instanceof Date) {
      return date.toLocaleString('pt-BR');
    }
    
    return 'Data inválida';
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
            <div className="font-medium text-gray-800">Pedido Finalizado</div>
            <div className="text-sm text-gray-600">
              {order.status === OrderStatus.COMPLETED ? 'Concluído' : 'Aguardando'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderServiceDetails: React.FC<{ order: Order }> = ({ order }) => {
  const selectedService = serviceTypes.find(s => s.id === order.serviceType);
  const selectedExtras = extraServices.filter(e => order.extraServices.includes(e.id));

  return (
    <div className="bg-white rounded-lg p-4">
      <h4 className="font-semibold text-gray-700 mb-3">Detalhes do Serviço</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-800">{selectedService?.name || 'Serviço não encontrado'}</div>
            <div className="text-sm text-gray-600">Serviço principal</div>
          </div>
          <div className="text-blue-600 font-semibold">{selectedService?.price}</div>
        </div>

        {selectedExtras.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Serviços Adicionais:</div>
            {selectedExtras.map((extra) => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg mb-1">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{extra.name}</div>
                  {extra.needsApproval && (
                    <div className="text-xs text-orange-600">Precisa aprovação</div>
                  )}
                </div>
                <div className="text-green-600 font-semibold text-sm">{extra.price}</div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Informações do Veículo:</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <div>Modelo: {order.carModel || 'Não informado'}</div>
            {order.carPlate && <div>Placa: {order.carPlate}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingView: React.FC<TrackingViewProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.carPlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Voltar para lista de pedidos
          </button>
        </div>
        <OrderTrackingDetails order={selectedOrder} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Rastreamento de Pedidos</h1>
        <p className="text-gray-600">Acompanhe o status dos serviços em tempo real</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por código, cliente, modelo ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Tente ajustar sua pesquisa' : 'Ainda não há pedidos para rastrear'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">#{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  <span>{order.carModel}</span>
                  {order.carPlate && <span className="text-gray-400">({order.carPlate})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{order.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalhes
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const message = `🚗 *Lava-Jato*

Olá! Gostaria de acompanhar o status do pedido ${order.id}.

Pode me passar uma atualização?

Obrigado!`;
                    const whatsappLink = generateWhatsAppLink(order.phone, message);
                    window.open(whatsappLink, '_blank');
                  }}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackingView;