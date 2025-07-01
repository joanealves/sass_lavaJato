import React from 'react';
export enum OrderStatus {
  PENDING = 'PENDING',
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ServiceType {
  SIMPLE = 'SIMPLE',
  COMPLETE = 'COMPLETE',
  PREMIUM = 'PREMIUM',
  DETAILED = 'DETAILED'
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: ServiceType | string; 
  extraServices: string[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
  readyAt?: Date | null;
  completedAt?: Date;
}

export interface CurrentOrder {
  customerName: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: ServiceType | string; 
  extraServices: string[];
}

export interface ServiceTypeInterface {
  id: string;
  name: string;
  price: string;
  duration: number;
}

export interface ExtraService {
  id: string;
  name: string;
  price: string;
  needsApproval: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: string;
}

export interface TrackingViewProps {
  orders: Order[];
}

export interface AdminViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onSendWhatsApp?: (orderId: string) => void;
  isClientView?: boolean; 
}

export interface CustomerViewProps {
  currentOrder: CurrentOrder;
  setCurrentOrder: React.Dispatch<React.SetStateAction<CurrentOrder>>;
  onAddOrder: (order: Order) => void;
  onSubmitOrder?: () => void;
}

export interface DashboardViewProps {
  orders: Order[];
  userRole?: string;
}