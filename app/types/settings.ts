import { ServiceTypeInterface, ExtraService } from './orders';
import { MessageTemplate } from './messages';

export interface BusinessSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  services: ServiceTypeInterface[];
  extraServices: ExtraService[];
  messageTemplates: MessageTemplate[];
}
