// import { reactive } from 'vue';

// export const chat = reactive({
//   messages: [
//     {
//       messageId: "msg_001",
//       senderId: "user_123",
//       type: "text", // text | image | payment_request | order_update | receipt | system | order | order_update
//       text: "Hi, is this still available?",
//       timestamp: "2025-04-16T15:30:00.000Z",
//       status: "delivered"
//     }
//   ],
//   context: {
//     productId: "prod_567",
//     sellerId: "user_456", // could also be buyerId if you want both
//     order: {
//       orderId: "order_987654",
//       status: "pending" // pending | approved | rejected | shipped | delivered
//     }
//   },
//   participants: ["user_123", "user_456"], // optional but helpful
//   createdAt: "2025-04-16T15:00:00.000Z",
//   updatedAt: "2025-04-16T15:30:00.000Z"
// });

// // Function to start a new chat
// const startChat = async () => {
//   if (!auth.currentUser) {
//     alert('You must be logged in to start a chat!');
//     return;
//   }

//   try {
//     // Step 1: Create a new chat reference in Firebase Realtime Database
//     const newChatRef = push(dbRef(db, 'chats'));

//     // Step 2: Set initial data for the chat (you can extend this structure)
//     await set(newChatRef, {
//       participants: {
//         [buyerId]: true, // Buyer is a participant
//         [sellerId]: true // Seller is a participant
//       },
//       context: {
//         productId,
//         orderId,
//       },
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     });

//     // Step 3: Update the chat ID to reference the newly created chat
//     chatId.value = newChatRef.key || '';

//     // Optional: Navigate to the chat screen (e.g., to view the conversation)
//     router.push(`/chat/${chatId.value}`);

//     alert('Chat started successfully!');
//   } catch (error) {
//     console.error('Error starting chat:', error);
//     alert('There was an error starting the chat. Please try again.');
//   }
// };
