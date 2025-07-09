import React, { useState } from 'react';
import { Calendar, User, Clock, Phone, Car, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { ScheduledOrder, SchedulingSystemProps } from '../types/scheduling'; 
import { ServiceType } from '../types/orders';

const SchedulingSystem: React.FC<SchedulingSystemProps> = ({ onAddScheduledOrder, isClientView = false }) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.SIMPLE);

  const mockScheduledOrders: ScheduledOrder[] = [
    {
      id: 'SCH001',
      customerName: 'João Silva',
      phone: '(11) 99999-1111',
      carModel: 'Fiat Palio',
      carPlate: 'ABC1D23',
      serviceType: ServiceType.COMPLETE,
      extraServices: [],
      scheduledDate: new Date('2025-07-02'),
      scheduledTime: '10:00',
      duration: 60,
      status: 'scheduled',
      totalPrice: 35.00,
      createdAt: new Date(),
    },
    {
      id: 'SCH002',
      customerName: 'Maria Oliveira',
      phone: '(11) 99999-2222',
      carModel: 'Ford Ka',
      carPlate: 'XYZ9B87',
      serviceType: ServiceType.SIMPLE,
      extraServices: [],
      scheduledDate: new Date('2025-07-02'),
      scheduledTime: '11:30',
      duration: 45,
      status: 'confirmed',
      totalPrice: 20.00,
      createdAt: new Date(),
    },
    {
      id: 'SCH003',
      customerName: 'Carlos Santos',
      phone: '(11) 99999-3333',
      carModel: 'Honda Civic',
      carPlate: 'DEF4G56',
      serviceType: ServiceType.DETAILED,
      extraServices: [],
      scheduledDate: new Date('2025-07-02'),
      scheduledTime: '14:00',
      duration: 90,
      status: 'pending',
      totalPrice: 60.00,
      createdAt: new Date(),
    },
    {
      id: 'SCH004',
      customerName: 'Ana Costa',
      phone: '(11) 99999-4444',
      carModel: 'Volkswagen Gol',
      carPlate: 'HIJ7K89',
      serviceType: ServiceType.PREMIUM,
      extraServices: [],
      scheduledDate: new Date('2025-07-02'),
      scheduledTime: '16:30',
      duration: 120,
      status: 'scheduled',
      totalPrice: 80.00,
      createdAt: new Date(),
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !carModel || !carPlate || !scheduledDate || !scheduledTime || !serviceType) {
      alert('Por favor, preencha todos os campos do agendamento.');
      return;
    }

    const newScheduling: ScheduledOrder = {
      id: `SCH${Date.now()}`,
      customerName,
      phone,
      carModel,
      carPlate,
      serviceType: serviceType,
      extraServices: [], 
      scheduledDate: new Date(scheduledDate),
      scheduledTime: scheduledTime,
      duration: 60,
      status: 'scheduled',
      totalPrice: 0, 
      createdAt: new Date(),
    };

    onAddScheduledOrder(newScheduling);
    alert('Agendamento Criado!');
    setCustomerName('');
    setPhone('');
    setCarModel('');
    setCarPlate('');
    setScheduledDate('');
    setScheduledTime('');
    setServiceType(ServiceType.SIMPLE);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'scheduled':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'in_progress':
        return 'Em Andamento';
      case 'scheduled':
        return 'Agendado';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeText = (serviceType: ServiceType) => {
    switch (serviceType) {
      case ServiceType.SIMPLE:
        return 'Lavagem Simples';
      case ServiceType.COMPLETE:
        return 'Lavagem Completa';
      case ServiceType.DETAILED:
        return 'Lavagem Detalhada';
      case ServiceType.PREMIUM:
        return 'Lavagem Premium';
      default:
        return 'Serviço';
    }
  };

  if (isClientView) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-indigo-600">Agendar sua Lavagem</h2>
              <p className="text-gray-500">Preencha para agendar um novo serviço.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nome Completo"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>
            <div>
              <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Modelo do Carro</label>
              <input
                type="text"
                id="carModel"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Fiat Palio"
                required
              />
            </div>
            <div>
              <label htmlFor="carPlate" className="block text-sm font-medium text-gray-700">Placa do Carro</label>
              <input
                type="text"
                id="carPlate"
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: ABC1D23"
                required
              />
            </div>
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Tipo de Serviço</label>
              <select
                id="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={ServiceType.SIMPLE}>Lavagem Simples</option>
                <option value={ServiceType.COMPLETE}>Lavagem Completa</option>
                <option value={ServiceType.DETAILED}>Lavagem Detalhada</option>
                <option value={ServiceType.PREMIUM}>Lavagem Premium</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Data do Agendamento</label>
                <input
                  type="date"
                  id="scheduledDate"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">Hora do Agendamento</label>
                <input
                  type="time"
                  id="scheduledTime"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Calendar className="inline w-5 h-5 mr-2" /> Agendar Serviço
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-indigo-600">Agenda do Dia</h2>
              <p className="text-gray-500">Visualize e gerencie os agendamentos de hoje.</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
            <div className="flex items-center">
              <User className="text-blue-600 mr-2" />
              <p className="text-sm text-blue-800">
                Visualização de funcionário/administrador - Agendamentos do dia {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {mockScheduledOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Car className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Agendamento #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Criado em {order.createdAt.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Cliente</p>
                      <p className="text-sm text-gray-900">{order.customerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Telefone</p>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-900">{order.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Veículo</p>
                      <p className="text-sm text-gray-900">{order.carModel}</p>
                      <p className="text-xs text-gray-600">Placa: {order.carPlate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Serviço</p>
                      <p className="text-sm text-gray-900">{getServiceTypeText(order.serviceType)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {order.scheduledTime} - {order.duration} min
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {order.scheduledDate.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          R$ {order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockScheduledOrders.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há agendamentos para hoje.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulingSystem;