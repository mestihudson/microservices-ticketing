import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@mestihudson-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
