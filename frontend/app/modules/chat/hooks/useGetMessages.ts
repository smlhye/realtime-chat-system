'use client';

import { useInfiniteQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import { MessagesResponseType } from "../schemas/messages-response.schema";
import { useMemo } from "react";

type Props = {
    chatId: string,
    take?: number,
    cursor?: string,
    after?: string,
    messageId?: string,
}

export const useGetMessages = ({ chatId, take, cursor, after, messageId }: Props) => {
    const initialTake = take ?? 20;
    const loadMoreTake = 5;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } = useInfiniteQuery<
        MessagesResponseType
    >({
        queryKey: ['messages-of-chat', chatId],
        queryFn: async ({ pageParam }) => {
            const res = await chatService.getMessagesOfChat({
                chatId,
                take: pageParam ? loadMoreTake : initialTake,
                cursor: pageParam as string | undefined,
                after,
                messageId,
            });
            return res.data ?? [];
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.length < loadMoreTake) return undefined;
            return lastPage.at(-1)?.createdAt;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!chatId,
        placeholderData: (prev) => prev,
    })

    const messages = useMemo(
        () => data?.pages.flat() ?? [],
        [data]
    );

    return {
        messages,
        loadMore: fetchNextPage,
        hasMore: hasNextPage,
        loadingMore: isFetchingNextPage,
        isError,
        error,
    }
}