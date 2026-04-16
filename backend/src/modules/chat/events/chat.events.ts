import { SendMessageResponse } from "src/generated/type";

export class MessageCreatedEvent {
    constructor(
        public readonly message: SendMessageResponse
    ) { }
}