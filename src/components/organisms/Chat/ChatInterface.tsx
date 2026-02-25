import { createSignal, For, onMount, onCleanup, Show } from "solid-js";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const INITIAL_MESSAGE: ChatMessageProps = {
    role: "assistant",
    content:
        "Hi, I'm Ahmed! I'm a software engineer focused on creating robust, performant web applications and design systems that scale. How can I help you today?",
};

export function ChatInterface() {
    const [messages, setMessages] = createSignal<ChatMessageProps[]>([
        INITIAL_MESSAGE,
    ]);
    const [isLoading, setIsLoading] = createSignal(false);
    let chatContainerRef!: HTMLDivElement;
    let autoScroll = true;

    const mockResponse = (userMessage: string) => {
        setIsLoading(true);
        // Simple mock response logic for now
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `You asked: "${userMessage}". I'm still learning how to answer that, but I'm currently working on some exciting new projects! Check back soon for updates.`,
                },
            ]);
            setIsLoading(false);
            scrollToBottom();
        }, 1000);
    };

    const handleSendMessage = (content: string) => {
        setMessages((prev) => [...prev, { role: "user", content }]);
        scrollToBottom();
        mockResponse(content);
    };

    const scrollToBottom = () => {
        if (chatContainerRef && autoScroll) {
            setTimeout(() => {
                chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
            }, 50);
        }
    };

    const handleScroll = () => {
        if (!chatContainerRef) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        autoScroll = isAtBottom;
    };

    onMount(() => {
        scrollToBottom();
        chatContainerRef?.addEventListener("scroll", handleScroll, {
            passive: true,
        });
    });

    onCleanup(() => {
        chatContainerRef?.removeEventListener("scroll", handleScroll);
    });

    return (
        <div class="flex flex-col h-full bg-primary relative">
            <div
                class="flex-1 overflow-y-auto pb-32 pt-4 px-4 md:px-0 scroll-smooth"
                ref={chatContainerRef}
            >
                <div class="max-w-4xl mx-auto w-full flex flex-col gap-4">
                    <For each={messages()}>
                        {(msg) => <ChatMessage {...msg} />}
                    </For>
                    <Show when={isLoading()}>
                        <div class="flex gap-4 p-6 bg-secondary max-w-4xl mx-auto w-full rounded-2xl shadow-sm animate-pulse my-2">
                            <div class="w-10 h-10 rounded-full bg-ui-border shrink-0" />
                            <div class="flex-1 space-y-3 py-1 my-auto">
                                <div class="h-4 bg-ui-border rounded w-3/4" />
                                <div class="h-4 bg-ui-border rounded w-1/2" />
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-primary via-primary pb-6 pt-10 px-4 md:px-6">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading()} />
            </div>
        </div>
    );
}
