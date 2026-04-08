import { Injectable } from "@nestjs/common";
import { ChatRepository } from "../repositories/chat.repository";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

@Injectable()
export class ChatService {
    private readonly context = ChatService.name;
    constructor(
        private readonly chatRepo: ChatRepository,
        private readonly logger: AppLoggerService,
    ) { }

    async createRoomChat() {
        
    }
}