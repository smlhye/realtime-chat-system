import { Injectable } from "@nestjs/common";
import { ChatRepository } from "../repositories/chat.repository";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { AddUserToChatRequest, AddUserToChatResponse, CreateChatRequest, CreateChatResponse, SendMessageRequest } from "src/generated/type";
import { ChatUserRepository } from "../repositories/chat-user.repository";
import { MessageRepository } from "../repositories/message.repository";

@Injectable()
export class ChatService {
    private readonly context = ChatService.name;
    constructor(
        private readonly chatUserRepo: ChatUserRepository,
        private readonly chatRepo: ChatRepository,
        private readonly messageRepo: MessageRepository,
        private readonly logger: AppLoggerService,
    ) { }

    async createRoomChat(data: CreateChatRequest): Promise<CreateChatResponse> {
        const { name, users, isGroup } = data;
        const now = new Date();

        const createdChat = await this.chatRepo.create({
            name,
            isGroup: isGroup as boolean,
            createdAt: now,
        })

        Promise.all(users.map(user => {
            this.chatUserRepo.create({
                chat: {
                    connect: {
                        id: createdChat.id,
                    }
                },
                user: {
                    connect: {
                        id: user,
                    }
                },
                lastSeenAt: now
            })
        }))

        return {
            id: createdChat.id,
            name: createdChat.name ?? undefined,
            isGroup: createdChat.isGroup,
            createdAt: createdChat.createdAt.toISOString(),
        };
    }

    async addUsersToChat(data: AddUserToChatRequest): Promise<AddUserToChatResponse> {
        const { chatId, userIds } = data;
        const now = new Date();
        const createdChatUsers = await Promise.all(
            userIds.map(id => this.chatUserRepo.create({
                chat: { connect: { id: chatId as string } },
                user: { connect: { id } },
                lastSeenAt: now,
            }))
        );
        return {
            chatId: chatId as string,
            users: createdChatUsers.map(user => ({
                id: user.id,
                userId: user.userId
            }))
        }
    }

    async addManyUsersToChat(userIds: string[], chatId: string) {
        return this.chatUserRepo.createMany(userIds, chatId);
    }

    async findPrivateBetweenUsers(userA: string, userB: string) {
        return this.chatRepo.findPrivateChatBetweenUsers(userA, userB);
    }

    async findChatByIdAndUserId(chatId: string, userId: string) {
        return this.chatRepo.findByChatIdAndUserId(chatId, userId);
    }

    async findChatsOfUser({ userId, name, take, cursor }: { userId: string, name?: string, take?: number, cursor?: string })
        : Promise<CreateChatResponse[]> {
        const chats = await this.chatRepo.findChatsOfUser({ userId, name, take, cursor });
        return chats.map((chat) => {
            const otherUser = chat.users?.[0]?.user;
            return {
                id: chat.id,
                name: chat.isGroup
                    ? chat.name ?? 'Unnamed Group'
                    : otherUser?.fullName ?? 'Unknown',
                isGroup: chat.isGroup,
                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt.toISOString(),
            }
        });
    }

    async findMessageByTempId(tempId: string) {
        return this.messageRepo.findByTempId(tempId);
    }

    async findMessages(params: { chatId: string, take?: number, cursor?: string, after?: string }) {
        return this.messageRepo.findMessages(params);
    }

    async findMessageById(messageId: string) {
        return this.messageRepo.findById(messageId);
    }

    async sendMessage(data: SendMessageRequest) {
        const { chatId, senderId, content, tempId } = data;
        return this.messageRepo.create({
            sender: {
                connect: {
                    id: senderId as string
                }
            },
            chat: {
                connect: {
                    id: chatId as string
                }
            },
            content,
            tempId,
        });
    }

    async updateLastSeen(chatId: string, userId: string) {
        const now = new Date();
        const chatUser = await this.chatUserRepo.findByChatIdAndUserId(
            chatId,
            userId,
        );
        if (!chatUser) {
            throw new Error('ChatUser not found');
        }
        await this.chatUserRepo.update(chatUser.id, {
            lastSeenAt: now,
        });
        return {
            success: true,
            lastSeenAt: now,
        };
    }
}