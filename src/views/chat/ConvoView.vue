<template>
  <div class="chat">
    <PageHeader />
    <div class="context">
      <MessageRenderer
        v-for="message in sortedChats"
        :key="message.id"
        :message="message"
      />
    </div>

    <!-- Chat Input -->
    <div class="chatBar">
      <button
        class="sendButton"
        v-if="!isRecording && !audioBlob"
        @click.stop="togglePlusOptions"
      >
        +
      </button>

      <!-- Options Menu -->
      <transition @before-enter="beforeEnter" @leave="beforeLeave">
        <div
          ref="plusOptionsRef"
          class="plusOptions animate__animated"
          v-if="showPlusOptions && !isRecording && !audioBlob"
        >
          <!-- Hidden File Input -->
          <input
            type="file"
            ref="fileInput"
            @change="uploadImage"
            accept="image/*"
            hidden
          />
          <button @click="triggerFileInput"><Image /> Sawir</button>
          <button><Money /> Lacag</button>
          <button><Check /> Aqbal</button>
        </div>
      </transition>

      <transition>
        <!-- Upload Progress & Errors (Fixed Position) -->
        <div v-if="uploading || errorMessage" class="upload-status">
          <p v-if="uploading">Uploading... {{ uploadProgress }}%</p>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </transition>

      <!-- Voice Recording & Playback -->
      <transition>
        <div
          v-if="isRecording || audioBlob"
          class="soundWave animate__animated"
        >
          <div class="recording-controls">
            <button v-if="isRecording" @click="stopRecording">⏹ Stop</button>
            <!-- Custom Playback Controls -->
            <button v-if="audioBlob && !isPlaying" @click="playAudio">
              ▶️
            </button>
            <button v-if="audioBlob && isPlaying" @click="pauseAudio">⏸</button>
            <button v-if="audioBlob" @click="stopAudio"></button>
            <button v-if="audioBlob" @click="deleteAudio">
              <svg id="icon-close" viewBox="0 0 20 20">
                <path
                  d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"
                ></path>
              </svg>
            </button>
            <button v-if="audioBlob" @click="reRecord">
              <svg id="icon-refresh" viewBox="0 0 20 20">
                <path
                  d="M10 3v2c-0.003 0-0.006 0-0.009 0-2.761 0-5 2.239-5 5 0 1.383 0.561 2.635 1.469 3.54l0 0-1.41 1.41c-1.267-1.267-2.051-3.017-2.051-4.95 0-3.866 3.134-7 7-7 0 0 0 0 0.001 0h-0zM14.95 5.050c1.267 1.267 2.051 3.017 2.051 4.95 0 3.866-3.134 7-7 7-0 0-0 0-0.001 0h0v-2c0.003 0 0.006 0 0.009 0 2.761 0 5-2.239 5-5 0-1.383-0.561-2.635-1.469-3.54l-0-0 1.41-1.41zM10 20l-4-4 4-4v8zM10 8v-8l4 4-4 4z"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Show SoundWave Component When Recording -->
          <SoundWave v-if="isRecording" />
        </div>
      </transition>

      <!-- Text Input -->
      <input
        v-if="!isRecording && !audioBlob"
        v-model="messageContent"
        type="text"
        class="chatInput"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />

      <div class="buttonChat">
        <button
          v-if="messageContent.length > 0 && !isRecording && !audioBlob"
          class="sendButton"
          @click="sendMessage"
        >
          <IconEcosystem />
        </button>

        <div class="recorder" v-else>
          <!-- Stop Recording Button -->
          <button
            v-if="isRecording && !audioBlob"
            class="sendButton"
            @click="stopRecording"
          >
            ⏹
          </button>

          <!-- Start Recording Button -->
          <button
            v-if="!isRecording && !audioBlob"
            class="sendButton"
            @click="toggleRecording"
          >
            <Mic />
          </button>

          <!-- Send Recording Button (appears after recording is done) -->
          <button v-if="audioBlob" class="sendButton" @click="sendRecording">
            ➡️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from "vue";
import { useChat } from "@/composables/useChat";
import PageHeader from "@/components/mobile/PageHeader.vue";
import MessageRenderer from "@/components/chat/MessageRenderer.vue";
import "animate.css";
import "@/assets/styles/views/chats/chat.scss";
import Image from "@/components/icons/image.vue";
import Money from "@/components/icons/money.vue";
import Check from "@/components/icons/check.vue";
import Mic from "@/components/icons/mic.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";
import SoundWave from "@/components/chat/SoundWave.vue";
import { storage, db } from "@/services/firebase";
import {
  ref as stRef,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { getDatabase, ref as dbRef, push } from "firebase/database";
import { dbRt } from "@/services/firebase";
import { useRoute } from "vue-router";
import { Message } from "@/composables/useChat";
import { profile } from "@/store/user/profile";
// Chat logic
const { sortedChats, messageContent, sendMessage, showPlusOptions } = useChat();
const plusOptionsRef = ref<HTMLElement | null>(null);
const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const audioBlob = ref<Blob | null>(null);
const audioURL = ref<string | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
let mediaStream: MediaStream | null = null;
const route = useRoute();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref("");
const currentUploadedImage = ref<string | null>(null); // Store image URL

// handler file upload  here

const triggerFileInput = () => {
  errorMessage.value = ""; // Clear previous errors
  fileInput.value?.click();
};

const uploadImage = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    uploading.value = true;
    uploadProgress.value = 0;
    errorMessage.value = "";

    // Generate a unique file path
    const imageRef = stRef(
      storage,
      `users/${route.params.chatId}/uploadedImages/${Date.now()}-${file.name}`
    );

    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate progress percentage
        uploadProgress.value = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        // Handle errors
        errorMessage.value = "Failed to upload image. Please try again.";
        uploading.value = false;
        console.error("Upload error:", error);
      },
      async () => {
        // On successful upload, get the URL
        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        currentUploadedImage.value = imageUrl; // Store URL in Vue ref

        // Step 2: Create the message with image URL
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: profile.value.id, // Replace with actual sender ID
          recipientId: "recipientUser", // Replace with actual recipient ID
          type: "image",
          content: {
            imageUrl: imageUrl,
            caption: messageContent.value,
          },
          timestamp: Date.now(),
          seen: false,
        };

        // Store image URL in Firebase Database
        const chatRef = dbRef(dbRt, `messages/${route.params.chatId}`);
        await push(chatRef, newMessage);

        console.log("Image uploaded successfully:", imageUrl);
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

// handler voice here

const sendRecording = async () => {
  if (!audioBlob.value) return;

  try {
    // Step 1: Define audio file paths for each format (MP3, MP4, WAV, OGG, and WEBM)
    const formats = ["mp3", "mp4", "wav", "ogg", "webm"];
    const audioFileUrls: Record<string, string> = {};

    // Upload the audio in different formats
    for (const format of formats) {
      const audioRef = stRef(storage, `audioMessages/${Date.now()}.${format}`);

      // Upload the audioBlob for the respective format
      await uploadBytes(audioRef, audioBlob.value);

      // Get the download URL for each format
      const audioUrl = await getDownloadURL(audioRef);
      audioFileUrls[format] = audioUrl; // Store the URL by format
    }

    // Step 2: Create the message with audio URLs for all formats
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "currentUser", // Replace with actual sender ID
      recipientId: "recipientUser", // Replace with actual recipient ID
      type: "audioFile",
      content: {
        audioFile: {
          mp3: audioFileUrls.mp3, // Audio URL for MP3 format
          mp4: audioFileUrls.mp4, // Audio URL for MP4 format
          wav: audioFileUrls.wav, // Audio URL for WAV format
          ogg: audioFileUrls.ogg, // Audio URL for OGG format
          webm: audioFileUrls.webm, // Audio URL for WEBM format
        },
      },
      timestamp: Date.now(),
      seen: false,
    };

    // Step 3: Push the message to the Firebase database
    const chatRef = dbRef(dbRt, `messages/${route.params.chatId}`);
    await push(chatRef, newMessage);
    messageContent.value = ""; // Reset message content after sending
  } catch (error) {
    console.error("Error uploading and sending message:", error);
  }
};

// Toggle Menu
const togglePlusOptions = () => {
  showPlusOptions.value = !showPlusOptions.value;
  setTimeout(() => {
    if (showPlusOptions.value) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }, 10);
};

// Start/Stop Voice Recording
const toggleRecording = async () => {
  if (!isRecording.value) {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.value = new MediaRecorder(mediaStream);

      audioChunks.value = [];

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.value.push(event.data);
      };

      mediaRecorder.value.onstop = () => {
        processAudio();
      };

      mediaRecorder.value.start();
      isRecording.value = true;
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Microphone access denied or unavailable.");
    }
  } else {
    stopRecording();
  }
};

// Stop recording gracefully and cleanup
const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    mediaRecorder.value = null; // Ensures the recorder is cleaned up
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop()); // Gracefully stop the mic stream
    mediaStream = null;
  }
  isRecording.value = false;
};

// Process Audio and Convert to Multiple Formats
const processAudio = () => {
  try {
    if (audioChunks.value.length === 0)
      throw new Error("No audio data recorded.");
    audioBlob.value = new Blob(audioChunks.value, { type: "audio/webm" });
    audioURL.value = URL.createObjectURL(audioBlob.value);

    // Generate additional audio formats (e.g., MP3) for better compatibility
    const mp3Blob = convertWebMToMP3(audioBlob.value);
    const mp3URL = URL.createObjectURL(mp3Blob);

    // Optionally, you can store this URL or make it available to the user.
    console.log("MP3 URL: ", mp3URL);

    // Update the audio element with the new audio file for playback
    if (audioElement.value) {
      audioElement.value.src = audioURL.value as string; // Update the source to the new audio
      audioElement.value.load(); // Reload to apply the new source
    }
  } catch (error) {
    console.error("Error processing audio:", error);
    reRecord();
  }
};

// Re-record Audio (Discard Current)
const reRecord = () => {
  // Clean up the previous recording
  stopRecording();
  audioChunks.value = [];
  audioBlob.value = null;
  audioURL.value = null;

  // Reset audio element source to prevent playing old audio
  if (audioElement.value) {
    audioElement.value.src = "";
    audioElement.value.load();
  }

  // Start a new recording
  toggleRecording();
};

// Convert WebM to MP3 (Simple Placeholder Example)
const convertWebMToMP3 = (webmBlob: Blob): Blob => {
  // Placeholder conversion logic, in practice, you would use a library for this
  // or handle it server-side. Here we just return the original WebM for simplicity.
  return webmBlob;
};

// Delete Audio
const deleteAudio = () => {
  audioChunks.value = [];
  audioBlob.value = null;
  audioURL.value = null;
  isRecording.value = false;

  // Clean up the media stream as well if it exists
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop()); // Gracefully stop the mic stream
    mediaStream = null;
  }

  // Reset audio element if deleted
  if (audioElement.value) {
    audioElement.value.src = "";
    audioElement.value.load();
  }
};

// Handle Click Outside Menu
const handleClickOutside = (event: MouseEvent) => {
  if (!showPlusOptions.value) return;
  if (
    plusOptionsRef.value &&
    !plusOptionsRef.value.contains(event.target as Node)
  ) {
    showPlusOptions.value = false;
    document.removeEventListener("click", handleClickOutside);
  }
};

// Play Audio
const playAudio = () => {
  if (!audioBlob.value) return;
  if (!audioElement.value) {
    audioElement.value = new Audio(audioURL.value as string);
    audioElement.value.onended = () => {
      isPlaying.value = false;
    };
  }
  audioElement.value.play();
  isPlaying.value = true;
};

// Pause Audio
const pauseAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  }
};

// Stop Audio (Reset Playback)
const stopAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value.currentTime = 0;
    isPlaying.value = false;
  }
};

// Vue Transition Hooks for Animation
const beforeEnter = (el: HTMLElement) => {
  el.classList.add("animate__zoomIn");
  el.style.animationDuration = "0.2s";
};

const beforeLeave = (el: HTMLElement) => {
  el.style.animation = "collapseFadeOut 0.2s ease-in forwards";
};

// Cleanup on Unmount
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>
