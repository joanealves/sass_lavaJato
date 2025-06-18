
export enum OrderStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'inProgress',
  READY = 'ready',
  COMPLETED = 'completed',
}

export interface Order {
  id: string; 
  customerName: string;
  phone: string; 
  carModel: string;
  carPlate: string;
  serviceType: string;
  extraServices: string[];
  status: OrderStatus; 
  createdAt: Date;
  readyAt: Date | null;
}

export interface Service {
  id: string;
  name: string;
  price: string;
}

export interface CurrentOrder {
  customerName: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: string;
  extraServices: string[];
}