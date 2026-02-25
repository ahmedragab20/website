import { Card } from "../../atoms";
import { Avatar } from "../../atoms/Avatar";
import { Text } from "../../atoms/Text";

export interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
}

export function ChatMessage(props: ChatMessageProps) {
    const isUser = () => props.role === "user";

    return (
        <Card class={!isUser() ? "" : "bg-fg-muted"}>
            <Avatar
                initials={isUser() ? "U" : "AR"}
                variant={isUser() ? "default" : "accent"}
            />
            <div class="flex-1 space-y-2 my-auto">
                <Text
                    as="p"
                    size="base"
                    color="main"
                    class="leading-relaxed whitespace-pre-wrap"
                >
                    {props.content}
                </Text>
            </div>
        </Card>
    );
}
