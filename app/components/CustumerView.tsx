import { Car, User, Phone, Check } from 'lucide-react';
import { CurrentOrder, CustomerViewProps } from '../types/types';

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

const ServiceTypeSelector: React.FC<{
  currentOrder: CurrentOrder;
  setCurrentOrder: React.Dispatch<React.SetStateAction<CurrentOrder>>;
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
  currentOrder: CurrentOrder;
  setCurrentOrder: React.Dispatch<React.SetStateAction<CurrentOrder>>;
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
  currentOrder: CurrentOrder;
  setCurrentOrder: React.Dispatch<React.SetStateAction<CurrentOrder>>;
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
          className="w-full px-4 py-3 border text-gray-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite seu nome completo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2 " />
          WhatsApp *
        </label>
        <input
          type="tel"
          value={currentOrder.phone}
          onChange={(e) => setCurrentOrder(prev => ({...prev, phone: e.target.value}))}
          className="w-full px-4 py-3 border  text-gray-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full px-4 py-3 border  text-gray-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full px-4 py-3 border  text-gray-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="ABC1234"
          maxLength={7}
        />
      </div>
    </div>
  );
};

const OrderSummary: React.FC<{
  currentOrder: CurrentOrder;
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
          <span className="text-gray-800">Cliente:</span>
          <span className="font-medium  text-gray-700">{currentOrder.customerName || '-'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Veículo:</span>
          <span className="font-medium  text-gray-700">
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

const CustomerView: React.FC<CustomerViewProps> = ({ 
  currentOrder, 
  setCurrentOrder, 
  onSubmitOrder 
}) => {
  const isFormValid = () => {
    return currentOrder.customerName.trim() !== '' &&
           currentOrder.phone.trim() !== '' &&
           currentOrder.carModel.trim() !== '' &&
           currentOrder.carPlate.trim() !== '' &&
           currentOrder.serviceType !== '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <OrderSummary currentOrder={currentOrder} />
              </div>

              <button
                onClick={onSubmitOrder}
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
                  💡 Após criar o pedido, você receberá um código para acompanhar o status da lavagem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;