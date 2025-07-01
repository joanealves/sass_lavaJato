import { Car, User, Phone, Check } from 'lucide-react';
import React from 'react';
import { ExtraService, CurrentOrder, ServiceType } from '../types/orders'; 
interface CustomerViewProps {
  currentOrder: CurrentOrder;
  setCurrentOrder: React.Dispatch<React.SetStateAction<CurrentOrder>>;
  onSubmit: (order: CurrentOrder) => void;
}

const serviceTypes = [
  { id: ServiceType.SIMPLE, name: 'Lavagem Simples', price: 'R$ 15,00', duration: '30 min' },
  { id: ServiceType.COMPLETE, name: 'Lavagem Completa', price: 'R$ 25,00', duration: '45 min' },
  { id: ServiceType.DETAILED, name: 'Lavagem Detalhada', price: 'R$ 40,00', duration: '60 min' },
  { id: ServiceType.PREMIUM, name: 'Lavagem Premium', price: 'R$ 60,00', duration: '90 min' }
];

const extraServices: ExtraService[] = [
  { id: 'motor', name: 'Lavagem do Motor', price: 'R$ 20,00', needsApproval: true },
  { id: 'cera', name: 'Enceramento', price: 'R$ 15,00', needsApproval: false },
  { id: 'aspiracao', name: 'Aspiração Detalhada', price: 'R$ 10,00', needsApproval: false },
  { id: 'pneus', name: 'Pretinho nos Pneus', price: 'R$ 8,00', needsApproval: false }
];

const CustomerView: React.FC<CustomerViewProps> = ({ currentOrder, setCurrentOrder, onSubmit }) => {
  const [selectedService, setSelectedService] = React.useState<ServiceType | string>(serviceTypes[0].id);
  const [selectedExtraServices, setSelectedExtraServices] = React.useState<string[]>([]);

  React.useEffect(() => {
    setCurrentOrder(prev => ({
      ...prev,
      serviceType: selectedService,
      extraServices: selectedExtraServices
    }));
  }, [selectedService, selectedExtraServices, setCurrentOrder]);

  const calculateTotalPrice = () => {
    const servicePrice = parseFloat(serviceTypes.find(s => s.id === selectedService)?.price.replace('R$', '').replace(',', '.') || '0');
    const extrasPrice = selectedExtraServices.reduce((sum, extraId) => {
      const extra = extraServices.find(e => e.id === extraId);
      return sum + parseFloat(extra?.price.replace('R$', '').replace(',', '.') || '0');
    }, 0);
    return servicePrice + extrasPrice;
  };

  const isFormValid = () => {
    return currentOrder.customerName && currentOrder.phone && currentOrder.carModel && currentOrder.carPlate && currentOrder.serviceType;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({ ...currentOrder, serviceType: selectedService, extraServices: selectedExtraServices });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios!');
    }
  };

  const generateWhatsAppLink = (phone: string, message: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    return `https://wa.me/55${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
              Faça Seu Agendamento
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Preencha os dados abaixo para agendar a lavagem do seu veículo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                        ${selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                        transition-all duration-200 ease-in-out
                      `}
                    >
                      <div>
                        <input
                          type="radio"
                          name="serviceType"
                          value={service.id}
                          checked={selectedService === service.id}
                          onChange={() => setSelectedService(service.id)}
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
                        ${selectedExtraServices.includes(extra.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                        transition-all duration-200 ease-in-out
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={selectedExtraServices.includes(extra.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtraServices(prev => [...prev, extra.id]);
                          } else {
                            setSelectedExtraServices(prev => prev.filter(id => id !== extra.id));
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
                    <span>{serviceTypes.find(s => s.id === selectedService)?.name}</span>
                  </div>
                  {selectedExtraServices.length > 0 && (
                    <>
                      <div className="font-semibold mt-3">Extras:</div>
                      <ul className="list-disc list-inside ml-4">
                        {selectedExtraServices.map(id => {
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
                type="submit"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;