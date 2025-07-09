import { Car, User, Phone, Check, Copy, Download, CheckCircle, X } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

interface ExtraService {
  id: string;
  name: string;
  price: string;
  needsApproval: boolean;
}

interface CurrentOrder {
  customerName: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: string;
  extraServices: string[];
  orderCode?: string;
  createdAt?: Date;
}

interface CustomerViewProps {
  currentOrder: CurrentOrder;
  setCurrentOrder: Dispatch<SetStateAction<CurrentOrder>>;
  onSubmit: (currentOrderData: CurrentOrder) => void;
}

enum ServiceType {
  SIMPLE = 'simple',
  COMPLETE = 'complete',
  DETAILED = 'detailed',
  PREMIUM = 'premium'
}

const OrderConfirmationModal = ({ order, onClose }: { order: CurrentOrder; onClose: () => void }) => {
  const [copied, setCopied] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);

  const serviceTypes = [
    { id: ServiceType.SIMPLE, name: 'Lavagem Simples', price: 'R$ 20,00', duration: '30 min' },
    { id: ServiceType.COMPLETE, name: 'Lavagem Completa', price: 'R$ 45,00', duration: '45 min' },
    { id: ServiceType.DETAILED, name: 'Lavagem Detalhada', price: 'R$ 55,00', duration: '60 min' },
    { id: ServiceType.PREMIUM, name: 'Lavagem Premium', price: 'R$ 60,00', duration: '90 min' }
  ];

  const extraServices: ExtraService[] = [
    { id: 'motor', name: 'Lavagem do Motor', price: 'R$ 50,00', needsApproval: true },
    { id: 'cera', name: 'Enceramento', price: 'R$ 15,00', needsApproval: false },
    { id: 'aspiracao', name: 'Aspiração Detalhada', price: 'R$ 30,00', needsApproval: false },
    { id: 'pneus', name: 'Pretinho nos Pneus', price: 'R$ 10,00', needsApproval: false }
  ];

  const selectedService = serviceTypes.find(s => s.id === order.serviceType);
  const selectedExtras = extraServices.filter(e => order.extraServices.includes(e.id));

  const calculateTotal = () => {
    const servicePrice = parseFloat(selectedService?.price.replace('R$', '').replace(',', '.') || '0');
    const extrasPrice = selectedExtras.reduce((sum, extra) => {
      return sum + parseFloat(extra.price.replace('R$', '').replace(',', '.') || '0');
    }, 0);
    return servicePrice + extrasPrice;
  };

  const orderDetails = `
🚗 PEDIDO DE LAVAGEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CÓDIGO DO PEDIDO: ${order.orderCode}
📅 Data: ${order.createdAt?.toLocaleDateString('pt-BR')} às ${order.createdAt?.toLocaleTimeString('pt-BR')}

👤 CLIENTE
Nome: ${order.customerName}
Telefone: ${order.phone}

🚙 VEÍCULO
Modelo: ${order.carModel}
Placa: ${order.carPlate}

💧 SERVIÇO SELECIONADO
${selectedService?.name} - ${selectedService?.price}
Duração: ${selectedService?.duration}

${selectedExtras.length > 0 ? `✨ SERVIÇOS EXTRAS
${selectedExtras.map(extra => `• ${extra.name} - ${extra.price}`).join('\n')}` : ''}

💰 VALOR TOTAL: ${calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Guarde este código para acompanhar o status do seu pedido!
  `.trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([orderDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedido-lavagem-${order.orderCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pedido Confirmado!</h2>
                <p className="text-green-100">Seu agendamento foi realizado com sucesso</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-green-400 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Código do Pedido</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    downloaded 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  <span className="text-sm">{downloaded ? 'Baixado!' : 'Baixar'}</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-600">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-green-400 mb-2 tracking-wider">
                  {order.orderCode}
                </div>
                <div className="text-gray-400 text-sm">
                  Criado em {order.createdAt?.toLocaleDateString('pt-BR')} às {order.createdAt?.toLocaleTimeString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium text-gray-500">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium text-gray-500">{order.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Veículo:</span>
                  <span className="font-medium text-gray-500">{order.carModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placa:</span>
                  <span className="font-medium text-gray-500">{order.carPlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-medium text-gray-500">{selectedService?.name}</span>
                </div>
                {selectedExtras.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extras:</span>
                    <span className="font-medium text-gray-500">{selectedExtras.length} serviço(s)</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span className='text-green-600'>Total:</span>
                  <span className="text-green-600">
                    {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📱 Próximos Passos</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Guarde o código do pedido para acompanhar o status</li>
                <li>• Você receberá atualizações via WhatsApp</li>
                <li>• Chegue no horário agendado com o veículo</li>
                <li>• Apresente o código para nossa equipe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerView: React.FC<CustomerViewProps> = ({ currentOrder, setCurrentOrder, onSubmit }) => {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [confirmedOrder, setConfirmedOrder] = React.useState<CurrentOrder | null>(null);

  const serviceTypes = [
    { id: ServiceType.SIMPLE, name: 'Lavagem Simples', price: 'R$ 20,00', duration: '30 min' },
    { id: ServiceType.COMPLETE, name: 'Lavagem Completa', price: 'R$ 45,00', duration: '45 min' },
    { id: ServiceType.DETAILED, name: 'Lavagem Detalhada', price: 'R$ 55,00', duration: '60 min' },
    { id: ServiceType.PREMIUM, name: 'Lavagem Premium', price: 'R$ 60,00', duration: '90 min' }
  ];

  const extraServices: ExtraService[] = [
    { id: 'motor', name: 'Lavagem do Motor', price: 'R$ 50,00', needsApproval: true },
    { id: 'cera', name: 'Enceramento', price: 'R$ 15,00', needsApproval: false },
    { id: 'aspiracao', name: 'Aspiração Detalhada', price: 'R$ 30,00', needsApproval: false },
    { id: 'pneus', name: 'Pretinho nos Pneus', price: 'R$ 10,00', needsApproval: false }
  ];

  const generateOrderCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    for (let i = 0; i < 4; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
  };

  const calculateTotalPrice = () => {
    const servicePrice = parseFloat(serviceTypes.find(s => s.id === currentOrder.serviceType)?.price.replace('R$', '').replace(',', '.') || '0');
    const extrasPrice = currentOrder.extraServices.reduce((sum, extraId) => {
      const extra = extraServices.find(e => e.id === extraId);
      return sum + parseFloat(extra?.price.replace('R$', '').replace(',', '.') || '0');
    }, 0);
    return servicePrice + extrasPrice;
  };

  const isFormValid = () => {
    return currentOrder.customerName && currentOrder.phone && currentOrder.carModel && currentOrder.carPlate && currentOrder.serviceType;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const orderWithCode = {
        ...currentOrder,
        orderCode: generateOrderCode(),
        createdAt: new Date()
      };
      setConfirmedOrder(orderWithCode);
      setShowConfirmation(true);
      
      onSubmit(orderWithCode);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmedOrder(null);
    setCurrentOrder({
      customerName: '',
      phone: '',
      carModel: '',
      carPlate: '',
      serviceType: ServiceType.SIMPLE,
      extraServices: []
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h2 className="text-3xl font-extrabold text-indigo-600 text-center mb-6">
                Faça Seu Agendamento
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Preencha os dados abaixo para agendar a lavagem do seu veículo.
              </p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Seus Dados</h3>
                  <div className="relative border border-gray-300 rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={currentOrder.customerName}
                      onChange={(e) => setCurrentOrder(prev => ({ ...prev, customerName: e.target.value }))}
                      className="block w-full pl-12 pr-4 py-3 text-gray-700 border-0 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                      required
                    />
                  </div>
                  <div className="relative border border-gray-300 rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Telefone (WhatsApp)"
                      value={currentOrder.phone}
                      onChange={(e) => setCurrentOrder(prev => ({ ...prev, phone: e.target.value }))}
                      className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Dados do Veículo</h3>
                  <div className="relative border border-gray-300 rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      placeholder="Modelo do Carro (Ex: Fiat Palio)"
                      value={currentOrder.carModel}
                      onChange={(e) => setCurrentOrder(prev => ({ ...prev, carModel: e.target.value }))}
                      className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                      required
                    />
                  </div>
                  <div className="relative border border-gray-300 rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      placeholder="Placa do Carro (Ex: ABC1B23)"
                      value={currentOrder.carPlate}
                      onChange={(e) => setCurrentOrder(prev => ({ ...prev, carPlate: e.target.value }))}
                      className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Tipo de Lavagem</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceTypes.map((service) => (
                      <label
                        key={service.id}
                        className={`
                          flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer
                          ${currentOrder.serviceType === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                          transition-all duration-200 ease-in-out
                        `}
                      >
                        <div>
                          <input
                            type="radio"
                            name="serviceType"
                            value={service.id}
                            checked={currentOrder.serviceType === service.id}
                            onChange={() => setCurrentOrder(prev => ({ ...prev, serviceType: service.id }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-3 text-lg font-medium text-gray-900">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-lg font-semibold text-blue-600">{service.price}</span>
                          <span className="block text-sm text-gray-500">{service.duration}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Serviços Extras (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {extraServices.map((extra) => (
                      <label
                        key={extra.id}
                        className={`
                          flex items-center p-5 rounded-xl border-2 cursor-pointer
                          ${currentOrder.extraServices.includes(extra.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                          transition-all duration-200 ease-in-out
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={currentOrder.extraServices.includes(extra.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCurrentOrder(prev => ({ ...prev, extraServices: [...prev.extraServices, extra.id] }));
                            } else {
                              setCurrentOrder(prev => ({ ...prev, extraServices: prev.extraServices.filter(id => id !== extra.id) }));
                            }
                          }}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-lg font-medium text-gray-900">{extra.name}</span>
                        <span className="ml-auto text-lg font-semibold text-green-600">{extra.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl shadow-inner border border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Resumo do Pedido</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Lavagem:</span>
                      <span>{serviceTypes.find(s => s.id === currentOrder.serviceType)?.name}</span>
                    </div>
                    {currentOrder.extraServices.length > 0 && (
                      <>
                        <div className="font-semibold mt-3">Extras:</div>
                        <ul className="list-disc list-inside ml-4">
                          {currentOrder.extraServices.map(id => {
                            const extra = extraServices.find(e => e.id === id);
                            return extra ? <li key={id}>{extra.name} ({extra.price})</li> : null;
                          })}
                        </ul>
                      </>
                    )}
                    <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        {calculateTotalPrice().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className={`w-full py-4 px-6 mt-8 rounded-xl font-semibold text-lg transition-all ${
                    isFormValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isFormValid() ? '🚗 Agendar Lavagem' : 'Preencha todos os campos'}
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mt-6">
                  💡 Após criar o pedido, você receberá um código para acompanhar o status da lavagem.
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={handleCloseConfirmation}
        />
      )}
    </>

  );
};

export default CustomerView;