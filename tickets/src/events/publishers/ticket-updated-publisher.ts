import {
	Publisher, Subjects, TicketUpdatedEvent
} from '@mestihudson-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
