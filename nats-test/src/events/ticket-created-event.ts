import { BaseEvent } from './base-event';
import { Subjects } from './subjects';

export interface TicketCreatedEvent extends BaseEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  }
}
