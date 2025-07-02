import React, { useState } from 'react';
import { User, Clock, Car, CheckCircle, Phone, Trash2, MessageCircle, ChevronDown } from 'lucide-react';
import {  OrderStatus, AdminViewProps } from '../types/orders';

const AdminView: React.FC<AdminViewProps> = ({ 
  orders, 
  onUpdateOrderStatus, 
  onDeleteOrder, 
  onSendWhatsApp 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.WAITING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.IN_PROGRESS:
      case OrderStatus.PROCESSING:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendente';
      case OrderStatus.WAITING:
        return 'Aguardando';
      case OrderStatus.IN_PROGRESS:
        return 'Em Andamento';
      case OrderStatus.PROCESSING:
        return 'Processando';
      case OrderStatus.READY:
        return 'Pronto';
      case OrderStatus.COMPLETED:
        return 'Concluído';
      case OrderStatus.CANCELLED:
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return [OrderStatus.WAITING, OrderStatus.CANCELLED];
      case OrderStatus.WAITING:
        return [OrderStatus.IN_PROGRESS, OrderStatus.PROCESSING, OrderStatus.CANCELLED];
      case OrderStatus.IN_PROGRESS:
        return [OrderStatus.PROCESSING, OrderStatus.READY, OrderStatus.CANCELLED];
      case OrderStatus.PROCESSING:
        return [OrderStatus.READY, OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED];
      case OrderStatus.READY:
        return [OrderStatus.COMPLETED, OrderStatus.IN_PROGRESS];
      case OrderStatus.COMPLETED:
        return []; 
      case OrderStatus.CANCELLED:
        return [OrderStatus.PENDING]; 
      default:
        return [];
    }
  };

  const toggleDropdown = (orderId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(orderId)) {
      newOpenDropdowns.delete(orderId);
    } else {
      newOpenDropdowns.add(orderId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
    const newOpenDropdowns = new Set(openDropdowns);
    newOpenDropdowns.delete(orderId);
    setOpenDropdowns(newOpenDropdowns);
  };

  const handleSendWhatsApp = (orderId: string) => {
    if (onSendWhatsApp) {
      onSendWhatsApp(orderId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-600">Gerenciar Pedidos</h1>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
            className="rounded-md border-gray-300 shadow-sm text-gray-800 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">Todos os Status</option>
            <option value={OrderStatus.PENDING}>Pendente</option>
            <option value={OrderStatus.WAITING}>Aguardando</option>
            <option value={OrderStatus.IN_PROGRESS}>Em Andamento</option>
            <option value={OrderStatus.PROCESSING}>Processando</option>
            <option value={OrderStatus.READY}>Pronto</option>
            <option value={OrderStatus.COMPLETED}>Concluído</option>
            <option value={OrderStatus.CANCELLED}>Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              Nenhum pedido encontrado para o filtro selecionado.
            </li>
          ) : (
            filteredOrders.map((order) => (
              <li key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Car className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {order.carModel} - {order.carPlate}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {order.createdAt.toLocaleDateString('pt-BR')} às {order.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {order.extraServices.length > 0 && (
                        <div className="mt-1 text-sm text-gray-500">
                          Extras: {order.extraServices.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium text-gray-900">
                        R$ {order.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.serviceType}
                      </p>
                    </div>
                    
                    {getAvailableStatuses(order.status).length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(order.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          title="Alterar Status"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        
                        {openDropdowns.has(order.id) && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                Alterar para:
                              </div>
                              {getAvailableStatuses(order.status).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(order.id, status)}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${getStatusColor(status)}`}>
                                    {getStatusText(status)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleSendWhatsApp(order.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      title="Enviar WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    
                    <a
                      href={`tel:${order.phone}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Ligar para cliente"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      title="Deletar pedido"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {openDropdowns.size > 0 && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setOpenDropdowns(new Set())}
        />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pedidos Pendentes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {orders.filter(order => 
                      order.status === OrderStatus.PENDING || 
                      order.status === OrderStatus.WAITING
                    ).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Em Andamento
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {orders.filter(order => 
                      order.status === OrderStatus.IN_PROGRESS || 
                      order.status === OrderStatus.PROCESSING
                    ).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Concluídos Hoje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {orders.filter(order => 
                      order.status === OrderStatus.COMPLETED &&
                      order.completedAt &&
                      new Date(order.completedAt).toDateString() === new Date().toDateString()
                    ).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;