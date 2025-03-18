import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import { dbRt } from "@/services/firebase";
import { ref as dbRef, get, onChildAdded, push, query, orderByChild } from "firebase/database";

// Define Message Interface
export interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    type: "text" | "payment-request" | "image" | "order-confirmation" | "audioFile" | "video" | string;
    content: Context | string;
    timestamp: number;
    seen: boolean;
}

// Context Interface
export interface Context {
    imageUrl?: string;
    caption?: string;
    audioFile?: { 
        mp3: string 
        mp4: string;
        wav: string;
        ogg: string;
        webm: string
    };
}

export function useChat() {
    const chats = ref<Message[]>([]);
    const messageContent = ref<string>("");
    const showPlusOptions = ref<boolean>(false);
    const route = useRoute();

    // Computed: Sort chats by timestamp
    const sortedChats = computed(() => [...chats.value].sort((a, b) => a.timestamp - b.timestamp));

    // Toggle Options Menu
    const toggleOptionsMenu = () => {
        showPlusOptions.value = !showPlusOptions.value;
    };

    // Before Enter and Before Leave for transition hooks
    const beforeEnter = () => {
        console.log('Options menu is about to enter');
        // Add any pre-animation logic here
    };

    const beforeLeave = () => {
        console.log('Options menu is about to leave');
        // Add any cleanup or pre-leave logic here
    };

    let chatListener: (() => void) | null = null;

    // Fetch messages from Firebase
    const fetchChats = async (): Promise<void> => {
        try {
            const chatRef = dbRef(dbRt, `messages/${route.params.chatId}`);
            const chatQuery = query(chatRef, orderByChild("timestamp"));

            const snapshot = await get(chatQuery);
            if (snapshot.exists()) {
                const chatData = snapshot.val();
                chats.value = Object.values(chatData).map(formatMessage);
            }

            // Real-time listener for new messages
            chatListener = onChildAdded(chatRef, (snapshot) => {
                const newMessage = snapshot.val() as Message;
                if (!chats.value.some((msg) => msg.id === newMessage.id)) {
                    chats.value.push(formatMessage(newMessage));
                    scrollToBottom();
                }
            });
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    // Format message
    const formatMessage = (msg: any): Message => ({
        id: msg.id,
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        type: msg.type,
        content: msg.content,
        timestamp: new Date(msg.timestamp).getTime(),
        seen: msg.seen,
    });

    // Send message to Firebase
    const sendMessage = async (): Promise<void> => {
        if (!messageContent.value.trim()) return;

        try {
            const chatRef = dbRef(dbRt, `messages/${route.params.chatId}`);

            const newMessage: Message = {
                id: Date.now().toString(),
                senderId: "currentUser",
                recipientId: "recipientUser",
                type: "text",
                content: messageContent.value,
                timestamp: Date.now(),
                seen: false,
            };

            await push(chatRef, newMessage);
            messageContent.value = "";
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Scroll to the bottom of the chat
    const scrollToBottom = (): void => {
        nextTick(() => {
            const container = document.querySelector(".context") as HTMLElement;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        });
    };

    // Cleanup event listener
    onMounted(() => {
        fetchChats().finally(() => {
            scrollToBottom()
        });
    });

    onBeforeUnmount(() => {
        if (chatListener) chatListener();
    });

    return {
        chats,
        messageContent,
        showPlusOptions,
        sortedChats,
        sendMessage,
        toggleOptionsMenu,
        beforeEnter,
        beforeLeave
    };
}
