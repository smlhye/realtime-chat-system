import { EventsHandler } from "@nestjs/cqrs";
import { ChatGateway } from "../../ws/chat.gateway";
import { MessageCreatedEvent } from "../chat.events";

@EventsHandler(MessageCreatedEvent)
export class ChatEventListener {
    constructor(
        private readonly gateway: ChatGateway,
    ) { }

    handle(event: MessageCreatedEvent) {
        if (event.message.chatId)
            this.gateway.server
                .to(event.message.chatId)
                .emit('message_received', event.message);
    }
}