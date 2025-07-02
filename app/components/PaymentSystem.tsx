import React, { useState } from 'react';
import { CreditCard, DollarSign, Clock, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../types/orders';

interface PaymentSystemProps {
  orders: Order[];
  onUpdatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus, paymentMethod: PaymentMethod) => void;
}

const serviceTypes = [
  { id: 'simples', name: 'Lavagem Simples', price: 15.00 },
  { id: 'completa', name: 'Lavagem Completa', price: 25.00 },
  { id: 'detalhada', name: 'Lavagem Detalhada', price: 40.00 },
  { id: 'premium', name: 'Lavagem Premium', price: 60.00 }
];

const extraServices = [
  { id: 'motor', name: 'Lavagem do Motor', price: 20.00 },
  { id: 'cera', name: 'Enceramento', price: 15.00 },
  { id: 'aspiracao', name: 'Aspiração Detalhada', price: 10.00 },
  { id: 'pneus', name: 'Pretinho nos Pneus', price: 8.00 }
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case PaymentStatus.PROCESSING:
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case PaymentStatus.PAID:
      return 'bg-green-100 text-green-800 border-green-300';
    case PaymentStatus.FAILED:
      return 'bg-red-100 text-red-800 border-red-300';
    case PaymentStatus.CANCELLED:
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case PaymentStatus.REFUNDED:
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getPaymentStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'Pendente';
    case PaymentStatus.PROCESSING:
      return 'Processando';
    case PaymentStatus.PAID:
      return 'Pago';
    case PaymentStatus.FAILED:
      return 'Falhou';
    case PaymentStatus.CANCELLED:
      return 'Cancelado';
    case PaymentStatus.REFUNDED:
      return 'Reembolsado';
    default:
      return status;
  }
};

const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.PIX:
      return <QrCode className="w-5 h-5" />;
    case PaymentMethod.CREDIT_CARD:
    case PaymentMethod.DEBIT_CARD:
      return <CreditCard className="w-5 h-5" />;
    case PaymentMethod.CASH:
      return <DollarSign className="w-5 h-5" />;
    default:
      return <DollarSign className="w-5 h-5" />;
  }
};

const getPaymentMethodText = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.PIX:
      return 'PIX';
    case PaymentMethod.CREDIT_CARD:
      return 'Cartão de Crédito';
    case PaymentMethod.DEBIT_CARD:
      return 'Cartão de Débito';
    case PaymentMethod.CASH:
      return 'Dinheiro';
    default:
      return method;
  }
};

const calculateOrderTotal = (order: Order): number => {
  const service = serviceTypes.find(s => s.id === order.serviceType);
  const servicePrice = service ? service.price : 0;
  
  const extrasPrice = order.extraServices.reduce((total, extraId) => {
    const extra = extraServices.find(e => e.id === extraId);
    return total + (extra ? extra.price : 0);
  }, 0);
  
  return servicePrice + extrasPrice;
};

const PaymentCard: React.FC<{
  order: Order;
  onUpdatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus, paymentMethod: PaymentMethod) => void;
}> = ({ order, onUpdatePaymentStatus }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [pixCode] = useState(`PIX${order.id}${Date.now()}`);
  
  const total = calculateOrderTotal(order);
  const service = serviceTypes.find(s => s.id === order.serviceType);

  const handleProcessPayment = () => {
    setPaymentStatus(PaymentStatus.PROCESSING);
    
    setTimeout(() => {
      if (selectedMethod === PaymentMethod.PIX) {
        setPaymentStatus(PaymentStatus.PAID);
        onUpdatePaymentStatus(order.id, PaymentStatus.PAID, selectedMethod);
      } else {
        const success = Math.random() > 0.1;
        const newStatus = success ? PaymentStatus.PAID : PaymentStatus.FAILED;
        setPaymentStatus(newStatus);
        onUpdatePaymentStatus(order.id, newStatus, selectedMethod);
      }
      setShowPaymentModal(false);
    }, 2000);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Processar Pagamento</h3>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Pedido #{order.id}</p>
          <p className="text-lg font-bold">{formatCurrency(total)}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pagamento
          </label>
          <div className="space-y-2">
            {Object.values(PaymentMethod).map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                  className="mr-2"
                />
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(method)}
                  <span>{getPaymentMethodText(method)}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedMethod === PaymentMethod.PIX && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border">{pixCode}</p>
            <p className="text-xs text-gray-500 mt-1">
              Use este código para efetuar o pagamento via PIX
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowPaymentModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleProcessPayment}
            disabled={paymentStatus === PaymentStatus.PROCESSING}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {paymentStatus === PaymentStatus.PROCESSING ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>

        {paymentStatus === PaymentStatus.PROCESSING && (
          <div className="mt-4 flex items-center justify-center text-blue-600">
            <Clock className="w-4 h-4 mr-2 animate-spin" />
            Processando pagamento...
          </div>
        )}

        {paymentStatus === PaymentStatus.PAID && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            Pagamento aprovado!
          </div>
        )}

        {paymentStatus === PaymentStatus.FAILED && (
          <div className="mt-4 flex items-center justify-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            Pagamento recusado. Tente novamente.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Pedido #{order.id}</h3>
            <p className="text-sm text-gray-600">{order.customerName}</p>
            <p className="text-xs text-gray-500">{order.carModel} - {order.carPlate}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border ${getPaymentStatusColor(paymentStatus)}`}>
            {getPaymentStatusText(paymentStatus)}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Serviço: {service?.name}</p>
          {order.extraServices.length > 0 && (
            <p className="text-xs text-gray-500">
              Extras: {order.extraServices.map(extraId => {
                const extra = extraServices.find(e => e.id === extraId);
                return extra?.name;
              }).filter(Boolean).join(', ')}
            </p>
          )}
          <p className="text-lg font-bold text-blue-600">{formatCurrency(total)}</p>
          {order.paymentMethod && (
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
              {getPaymentMethodIcon(order.paymentMethod)}
              <span>{getPaymentMethodText(order.paymentMethod)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {paymentStatus === PaymentStatus.PENDING && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Processar Pagamento
            </button>
          )}
          
          {paymentStatus === PaymentStatus.FAILED && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Tentar Novamente
            </button>
          )}

          {paymentStatus === PaymentStatus.PAID && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Pagamento confirmado</span>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && <PaymentModal />}
    </>
  );
};

const PaymentSystem: React.FC<PaymentSystemProps> = ({ orders, onUpdatePaymentStatus }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');

  const paymentOrders = orders.filter(order => 
    order.status === OrderStatus.READY || order.status === OrderStatus.COMPLETED
  );

  const filteredOrders = paymentOrders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.paymentStatus === filterStatus;
  });

  const totalRevenue = paymentOrders.reduce((total, order) => {
    return total + calculateOrderTotal(order);
  }, 0);

  const paidRevenue = paymentOrders
    .filter(order => order.paymentStatus === PaymentStatus.PAID)
    .reduce((total, order) => total + calculateOrderTotal(order), 0);
  
  const pendingRevenue = totalRevenue - paidRevenue;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sistema de Pagamentos</h2>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | PaymentStatus)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Todos</option>
                <option value={PaymentStatus.PENDING}>Pendente</option>
                <option value={PaymentStatus.PROCESSING}>Processando</option>
                <option value={PaymentStatus.PAID}>Pago</option>
                <option value={PaymentStatus.FAILED}>Falhou</option>
                <option value={PaymentStatus.CANCELLED}>Cancelado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Receita Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalRevenue)}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Recebido</span>
              </div>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(paidRevenue)}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">Pendente</span>
              </div>
              <p className="text-2xl font-bold text-yellow-800">{formatCurrency(pendingRevenue)}</p>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {filterStatus === 'all' ? 'Nenhum pagamento pendente' : `Nenhum pedido com status "${getPaymentStatusText(filterStatus as PaymentStatus)}"`}
              </h3>
              <p className="text-gray-500">
                {filterStatus === 'all' ? 'Todos os pagamentos estão em dia!' : 'Tente filtrar por outro status.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <PaymentCard
                  key={order.id}
                  order={order}
                  onUpdatePaymentStatus={onUpdatePaymentStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;