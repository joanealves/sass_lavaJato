import { ServiceType } from './orders';
export interface TimeSlot {
  time: string;
  available: boolean;
  maxCapacity: number;
  currentBookings: number;
}

export interface ScheduleDay {
  date: Date;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

export type ScheduledOrderStatus = 'pending' | 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface ScheduledOrder {
  id: string;
  orderId?: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  carModel: string;
  carPlate: string;
  serviceType: ServiceType;
  extraServices: string[];
  scheduledDate: Date; 
  scheduledTime: string; 
  duration: number;
  status: ScheduledOrderStatus; 
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
  notes?: string;
  assignedEmployee?: string;
}

export interface SchedulingSystemProps {
  onAddScheduledOrder: (order: ScheduledOrder) => void;
  isClientView?: boolean;
}