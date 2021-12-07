import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@mestihudson-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
