export interface Message {
  id: string;
  orderId: string;
  customerPhone: string;
  message: string;
  type: 'info' | 'status_update' | 'promotion' | 'confirmation';
  sentAt: Date;
  sentBy: string;
  status: 'sent' | 'delivered' | 'failed';
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: Message['type'];
  variables: string[];
  isActive: boolean;
}
