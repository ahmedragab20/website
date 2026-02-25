import { createSignal } from "solid-js";
import { Textarea } from "../../atoms/Textarea";
import { Button } from "../../atoms/Button";
import { Send } from "../../icons/Send";

export interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
}

export function ChatInput(props: ChatInputProps) {
    const [message, setMessage] = createSignal("");

    const handleSend = () => {
        const content = message().trim();
        if (content && !props.isLoading) {
            props.onSend(content);
            setMessage("");
        }
    };

    const handleInput = (val: string) => {
        setMessage(val);
    };

    return (
        <div class="relative max-w-4xl mx-auto w-full flex items-end gap-x-3">
            <Textarea
                value={message()}
                onInput={handleInput}
                placeholder="Ask Ahmed anything..."
                resize="none"
                disabled={props.isLoading}
            />
            <div>
                <Button
                    variant="solid"
                    disabled={!message().trim() || props.isLoading}
                    onClick={handleSend}
                    aria-label="Send message"
                >
                    <Send class="size-5" />
                </Button>
            </div>
        </div>
    );
}
