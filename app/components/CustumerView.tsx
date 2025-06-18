import React from 'react';
import { Car, User, Phone, Plus } from 'lucide-react';

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

interface ServiceTypeSelectorProps {
  currentOrder: Order;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>;
}

interface ExtraServicesSelectorProps {
  currentOrder: Order;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>;
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

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({ currentOrder, setCurrentOrder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Lavagem *</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {serviceTypes.map((service: ServiceType) => (
          <div
            key={service.id}
            onClick={() => setCurrentOrder(prev => ({...prev, serviceType: service.id}))}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              currentOrder.serviceType === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800">{service.name}</div>
            <div className="text-sm text-gray-600">{service.price} • {service.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExtraServicesSelector: React.FC<ExtraServicesSelectorProps> = ({ currentOrder, setCurrentOrder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Serviços Adicionais</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {extraServices.map((service: ExtraService) => (
          <div
            key={service.id}
            onClick={() => {
              setCurrentOrder(prev => ({
                ...prev,
                extraServices: prev.extraServices.includes(service.id)
                  ? prev.extraServices.filter(id => id !== service.id)
                  : [...prev.extraServices, service.id]
              }));
            }}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
              currentOrder.extraServices.includes(service.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium text-gray-800">{service.name}</div>
            <div className="text-sm text-gray-600">
              {service.price}
              {service.needsApproval && <span className="text-orange-600 ml-1">(precisa aprovação)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerView: React.FC<CustomerViewProps> = ({ currentOrder, setCurrentOrder, onSubmitOrder }) => {
  const handleInputChange = (field: keyof Order) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentOrder(prev => ({
      ...prev,
      [field]: field === 'carPlate' ? e.target.value.toUpperCase() : e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Novo Pedido</h2>
            <p className="text-gray-600">Cadastre seu pedido e receba notificação quando estiver pronto!</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-950
                 mb-2">
                  <User className="inline w-4 h-4 mr-1 text-gray-950" />
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={currentOrder.customerName}
                  onChange={handleInputChange('customerName')}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu nome"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={currentOrder.phone}
                  onChange={handleInputChange('phone')}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo do Carro</label>
                <input
                  type="text"
                  value={currentOrder.carModel}
                  onChange={handleInputChange('carModel')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-950"
                  placeholder="Ex: Honda Civic"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placa</label>
                <input
                  type="text"
                  value={currentOrder.carPlate}
                  onChange={handleInputChange('carPlate')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-950"
                  placeholder="ABC-1234"
                />
              </div>
            </div>

            <ServiceTypeSelector currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />
            <ExtraServicesSelector currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />

            <button
              onClick={onSubmitOrder}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
            >
              <Plus className="inline w-5 h-5 mr-2" />
              Criar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { Order, ServiceType, ExtraService };
export default CustomerView;