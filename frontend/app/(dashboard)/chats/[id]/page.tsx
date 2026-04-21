import MessageContainer from "@/app/modules/chat/components/MessageContainer"

type Props = {
    params: Promise<{ id: string }>;
}

export default async function ChatConversation({ params }: Props) {
    const { id } = await params;
    return <MessageContainer chatId={id} />
}