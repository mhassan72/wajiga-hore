import { ref } from 'vue';
import { getStorage, ref as stRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { dbRt } from "@/services/firebase";
import { ref as dbRef, push } from "firebase/database";
import { useRoute } from 'vue-router';

export function useImageUploader() {
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const errorMessage = ref("");
  const currentUploadedImage = ref<string | null>(null);
  const route = useRoute();
  const fileInput = ref<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    errorMessage.value = "";
    fileInput.value?.click();
  };

  const uploadImage = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      uploading.value = true;
      uploadProgress.value = 0;
      errorMessage.value = "";

      const imageRef = stRef(getStorage(), `users/${route.params.chatId}/uploadedImages/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          uploadProgress.value = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          errorMessage.value = "Failed to upload image. Please try again.";
          uploading.value = false;
          console.error("Upload error:", error);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          currentUploadedImage.value = imageUrl;

          const newMessage = {
            id: Date.now().toString(),
            senderId: "currentUser", // Replace with actual sender ID
            recipientId: "recipientUser", // Replace with actual recipient ID
            type: "image",
            content: { imageUrl, caption: "" },
            timestamp: Date.now(),
            seen: false,
          };

          const chatRef = dbRef(dbRt, `messages/${route.params.chatId}`);
          await push(chatRef, newMessage);

          uploading.value = false;
          uploadProgress.value = 0;
        }
      );
    } catch (error) {
      errorMessage.value = "An unexpected error occurred.";
      console.error("Unexpected error:", error);
      uploading.value = false;
    }
  };

  return {
    fileInput,
    uploading,
    uploadProgress,
    errorMessage,
    currentUploadedImage,
    triggerFileInput,
    uploadImage,
  };
}
