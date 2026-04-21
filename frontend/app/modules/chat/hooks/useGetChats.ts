'use client';

import { useInfiniteQuery } from "@tanstack/react-query";
import { ChatsResponseType } from "../schemas/chats-response.schema";
import { chatService } from "../services/chat.service";

type Props = {
    name?: string,
    take?: number,
    cursor?: string,
}

export const useGetChats = ({ name, take, cursor }: Props) => {
    const initialTake = take ?? 20;
    const loadMoreTake = 5;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
        ChatsResponseType
    >({
        queryKey: ['chats-of-user', name, take, cursor],
        queryFn: async ({ pageParam }) => {
            const res = await chatService.getChatsOfUser({
                name,
                take: pageParam ? loadMoreTake : initialTake,
                cursor: pageParam as string | undefined,
            });
            return res.data ?? [];
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.length < loadMoreTake) return undefined;
            return lastPage.at(-1)?.updatedAt;
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev,
    })
    const chats: ChatsResponseType = data?.pages.flat() ?? [];

    return {
        chats,
        loadMore: fetchNextPage,
        hasMore: hasNextPage,
        loadingMore: isFetchingNextPage,
    }
}