import { OrderStatus, ServiceType, Order } from './orders';

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  averageServiceTime: number;
  customerSatisfaction: number;
}

export interface OrdersByStatus {
  [OrderStatus.WAITING]: number;
  [OrderStatus.PROCESSING]: number;
  [OrderStatus.READY]: number;
  [OrderStatus.COMPLETED]: number;
  [OrderStatus.CANCELLED]: number;
}

export interface RevenueByService {
  serviceType: ServiceType;
  count: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  ordersByStatus: OrdersByStatus;
  revenueByService: RevenueByService[];
  recentOrders: Order[];
  monthlyRevenue: { month: string; revenue: number }[];
}
