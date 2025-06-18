import React, { useState } from 'react';
import { Car, User, Phone, Plus, Copy, MessageCircle, Check } from 'lucide-react';

interface ServiceType {
  id: string;
  name: string;
  price: string;
  duration: string;
}

interface ExtraService {
  id: string;
  name: string;
  price: string;
  needsApproval: boolean;
}

interface Order {
  customerName: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: string;
  extraServices: string[];
}

interface CustomerViewProps {
  currentOrder: Order;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>;
  onSubmitOrder: () => void;
}

const serviceTypes: ServiceType[] = [
  { id: 'simples', name: 'Lavagem Simples', price: 'R$ 15,00', duration: '30 min' },
  { id: 'completa', name: 'Lavagem Completa', price: 'R$ 25,00', duration: '45 min' },
  { id: 'detalhada', name: 'Lavagem Detalhada', price: 'R$ 40,00', duration: '60 min' },
  { id: 'premium', name: 'Lavagem Premium', price: 'R$ 60,00', duration: '90 min' }
];

const extraServices: ExtraService[] = [
  { id: 'motor', name: 'Lavagem do Motor', price: 'R$ 20,00', needsApproval: true },
  { id: 'cera', name: 'Enceramento', price: 'R$ 15,00', needsApproval: false },
  { id: 'aspiracao', name: 'Aspiração Detalhada', price: 'R$ 10,00', needsApproval: false },
  { id: 'pneus', name: 'Pretinho nos Pneus', price: 'R$ 8,00', needsApproval: false }
];

// Utilitário para gerar códigos de pedido
const generateOrderCode = (orderCount: number = 0): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // Gera um código único baseado em timestamp
  const timestamp = now.getTime().toString().slice(-6);
  
  return `LJ${year}${month}${day}${hours}${minutes}${timestamp}`;
};

// Função para validar código de pedido
export const isValidOrderCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;
  
  // Verifica se começa com LJ e tem tamanho adequado
  return code.startsWith('LJ') && code.length >= 8 && code.length <= 15;
};

// Função para formatar código para exibição
export const formatOrderCodeForDisplay = (code: string): string => {
  if (!code || typeof code !== 'string') return '';
  
  // Se for um código válido, formata para exibição
  if (isValidOrderCode(code)) {
    // Adiciona espaços para melhor legibilidade
    return code.replace(/(.{2})(.{4})(.{4})(.*)/, '$1 $2 $3 $4').trim();
  }
  
  return code;
};

// Componente para mostrar o pedido criado
const OrderCreatedModal: React.FC<{
  orderCode: string;
  customerName: string;
  onClose: () => void;
  onGoToTracking: () => void;
}> = ({ orderCode, customerName, onClose, onGoToTracking }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="text-green-600 text-2xl" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            🎉 Pedido Criado!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Olá {customerName}! Seu pedido foi registrado com sucesso.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código do seu pedido:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 font-mono text-lg font-bold text-center">
                {orderCode}
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                title="Copiar código"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-2 flex items-center justify-center gap-1">
                <Copy className="w-4 h-4" />
                Código copiado!
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>📱 Importante:</strong> Guarde este código! Você precisará dele para acompanhar seu pedido e receberá notificações no WhatsApp.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onGoToTracking}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Acompanhar Pedido
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Novo Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceTypeSelector: React.FC<{
  currentOrder: Order;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>;
}> = ({ currentOrder, setCurrentOrder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Lavagem *</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {serviceTypes.map((service: ServiceType) => (
          <div
            key={service.id}
            onClick={() => setCurrentOrder(prev => ({...prev, serviceType: service.id}))}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
              currentOrder.serviceType === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{service.name}</h3>
              {currentOrder.serviceType === service.id && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600 font-bold">{service.price}</span>
              <span className="text-gray-500">{service.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExtraServicesSelector: React.FC<{
  currentOrder: Order;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>;
}> = ({ currentOrder, setCurrentOrder }) => {
  const toggleExtraService = (serviceId: string) => {
    setCurrentOrder(prev => ({
      ...prev,
      extraServices: prev.extraServices.includes(serviceId)
        ? prev.extraServices.filter(id => id !== serviceId)
        : [...prev.extraServices, serviceId]
    }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Serviços Extras</label>
      <div className="space-y-3">
        {extraServices.map((service: ExtraService) => (
          <div
            key={service.id}
            onClick={() => toggleExtraService(service.id)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
              currentOrder.extraServices.includes(service.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  {service.needsApproval && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Aprovação
                    </span>
                  )}
                </div>
                <p className="text-blue-600 font-semibold">{service.price}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentOrder.extraServices.includes(service.id)
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
              }`}>
                {currentOrder.extraServices.includes(service.id) && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerForm: React.FC<{
  currentOrder: Order;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>;
}> = ({ currentOrder, setCurrentOrder }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Seus Dados</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Nome Completo *
        </label>
        <input
          type="text"
          value={currentOrder.customerName}
          onChange={(e) => setCurrentOrder(prev => ({...prev, customerName: e.target.value}))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite seu nome completo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          WhatsApp *
        </label>
        <input
          type="tel"
          value={currentOrder.phone}
          onChange={(e) => setCurrentOrder(prev => ({...prev, phone: e.target.value}))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Car className="w-4 h-4 inline mr-2" />
          Modelo do Carro *
        </label>
        <input
          type="text"
          value={currentOrder.carModel}
          onChange={(e) => setCurrentOrder(prev => ({...prev, carModel: e.target.value}))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Honda Civic 2020"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placa do Veículo *
        </label>
        <input
          type="text"
          value={currentOrder.carPlate}
          onChange={(e) => setCurrentOrder(prev => ({...prev, carPlate: e.target.value.toUpperCase()}))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="ABC1234"
          maxLength={7}
        />
      </div>
    </div>
  );
};

const OrderSummary: React.FC<{
  currentOrder: Order;
}> = ({ currentOrder }) => {
  const selectedService = serviceTypes.find(s => s.id === currentOrder.serviceType);
  const selectedExtras = extraServices.filter(s => currentOrder.extraServices.includes(s.id));
  
  const calculateTotal = () => {
    let total = 0;
    if (selectedService) {
      total += parseFloat(selectedService.price.replace('R$ ', '').replace(',', '.'));
    }
    selectedExtras.forEach(extra => {
      total += parseFloat(extra.price.replace('R$ ', '').replace(',', '.'));
    });
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Pedido</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Cliente:</span>
          <span className="font-medium">{currentOrder.customerName || '-'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Veículo:</span>
          <span className="font-medium">
            {currentOrder.carModel || '-'} 
            {currentOrder.carPlate && ` (${currentOrder.carPlate})`}
          </span>
        </div>
        
        {selectedService && (
          <div className="flex justify-between">
            <span className="text-gray-600">{selectedService.name}:</span>
            <span className="font-medium">{selectedService.price}</span>
          </div>
        )}
        
        {selectedExtras.map(extra => (
          <div key={extra.id} className="flex justify-between">
            <span className="text-gray-600">{extra.name}:</span>
            <span className="font-medium">{extra.price}</span>
          </div>
        ))}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-blue-600">{calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const CarWashCustomerApp: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<Order>({
    customerName: '',
    phone: '',
    carModel: '',
    carPlate: '',
    serviceType: '',
    extraServices: []
  });

  const [showModal, setShowModal] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [currentView, setCurrentView] = useState<'form' | 'tracking'>('form');

  const isFormValid = () => {
    return currentOrder.customerName.trim() !== '' &&
           currentOrder.phone.trim() !== '' &&
           currentOrder.carModel.trim() !== '' &&
           currentOrder.carPlate.trim() !== '' &&
           currentOrder.serviceType !== '';
  };

  const handleSubmitOrder = () => {
    if (!isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newOrderCode = generateOrderCode();
    setOrderCode(newOrderCode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Resetar formulário
    setCurrentOrder({
      customerName: '',
      phone: '',
      carModel: '',
      carPlate: '',
      serviceType: '',
      extraServices: []
    });
  };

  const handleGoToTracking = () => {
    setShowModal(false);
    setCurrentView('tracking');
  };

  if (currentView === 'tracking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Car className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Acompanhar Pedido
            </h2>
            <p className="text-gray-600 mb-6">
              Seu pedido <strong>{orderCode}</strong> está sendo processado.
            </p>
            <button
              onClick={() => setCurrentView('form')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Car className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Lava Jato</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Agende sua lavagem de forma rápida e prática
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <CustomerForm 
                  currentOrder={currentOrder}
                  setCurrentOrder={setCurrentOrder}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <ServiceTypeSelector
                  currentOrder={currentOrder}
                  setCurrentOrder={setCurrentOrder}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <ExtraServicesSelector
                  currentOrder={currentOrder}
                  setCurrentOrder={setCurrentOrder}
                />
              </div>
            </div>

            {/* Resumo e Ações */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <OrderSummary currentOrder={currentOrder} />
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={!isFormValid()}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  isFormValid()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFormValid() ? '🚗 Agendar Lavagem' : 'Preencha todos os campos'}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Você receberá notificações no WhatsApp sobre o andamento do seu pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pedido Criado */}
      {showModal && (
        <OrderCreatedModal
          orderCode={orderCode}
          customerName={currentOrder.customerName}
          onClose={handleCloseModal}
          onGoToTracking={handleGoToTracking}
        />
      )}
    </div>
  );
};

export default CarWashCustomerApp;