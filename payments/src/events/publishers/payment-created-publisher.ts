import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@mestihudson-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
