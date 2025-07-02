
import React, { useState } from 'react';
import { Calendar, User} from 'lucide-react';
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

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar className="text-purple-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-indigo-600">
              {isClientView ? 'Agendar sua Lavagem' : 'Gerenciar Agendamentos'}
            </h2>
            <p className="text-gray-500">
              {isClientView ? 'Preencha para agendar um novo serviço.' : 'Crie ou visualize os agendamentos existentes.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isClientView && ( 
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex items-center">
                <User className="text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Você está na visão de funcionário/administrador.
                </p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

        {!isClientView && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Agendamentos Recentes (Exemplo)</h3>
            <ul className="space-y-3">
              <li className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold">Agendamento #12345</p>
                  <p className="text-sm text-gray-600">Cliente: João S. - Fiat Palio (ABC1D23)</p>
                  <p className="text-xs text-gray-500">2025-07-01 às 10:00 - Lavagem Completa</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Confirmado</span>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold">Agendamento #12346</p>
                  <p className="text-sm text-gray-600">Cliente: Maria L. - Ford Ka (XYZ9B87)</p>
                  <p className="text-xs text-gray-500">2025-07-01 às 11:30 - Lavagem Simples</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Agendado</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingSystem;