import React from 'react';

export enum OrderStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS', 
  READY = 'READY',
  COMPLETED = 'COMPLETED'
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  serviceType: string;
  carModel: string;
  carPlate: string;
  extraServices: string[];
  status: OrderStatus;
  createdAt: Date;
  readyAt?: Date | null;
}

export interface CurrentOrder {
  customerName: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: string;
  extraServices: string[];
}

export interface ServiceType {
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

export type UserType = 'user' | 'admin' | null;
export type ViewType = 'customer' | 'admin' | 'dashboard' | 'tracking';

export interface TrackingViewProps {
  orders: Order[]; 
}

export interface AdminViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export interface CustomerViewProps {
  currentOrder: CurrentOrder;
  setCurrentOrder: React.Dispatch<React.SetStateAction<CurrentOrder>>;
  onSubmitOrder: () => void;
}

export interface DashboardViewProps {
  orders: Order[];
}

export interface HeaderProps {
  userType: UserType;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

export interface LoginViewProps {
  onLogin: (type: UserType) => void;
}

export interface Service {
  id: string;
  name: string;
  price: string;
}

