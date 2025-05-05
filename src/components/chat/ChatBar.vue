<template>
  <div class="chatBar">
    <!-- Options Menu -->
    <transition name="plusOptionsTransition">
      <div ref="plusOptionsRef" class="plusOptions" v-show="state.optionsMenu">
        <input
          type="file"
          ref="fileInput"
          @change="uploadImages"
          accept="image/*"
          hidden
          multiple
        />
        <button @click="openImageSelector"><Image /> Sawir</button>
        <button @click="openPaymentModal"><Money /> Dir Lacag</button>
        <button><Check /> Aqbal</button>
      </div>
    </transition>

    <teleport to="body">
      <div v-if="showPaymentModal" class="modal-overlay">
        <div class="modal">
          <h3>Dir Lacag</h3>
          <p>Hubsiin baal hal lasiistaa!</p>
          <p>
            Fadlan ha dirin lacag ilaa aad alaabtaada gacanta ku hayso. Xitaa ha
            u dirin lacag bixinta keenista (delivery), tani waa si looga hortago
            khiyaanooyinka.
          </p>

          <div class="paymentOptions">
            <label for="paymentMethod">Habka Lacag-bixinta:</label>
            <select
              name="paymentMethod"
              id="paymentMethod"
              v-model="selectedPaymentMethod"
            >
              <option disabled selected>Fadlan Dooro aalada</option>
              <option
                :value="option"
                v-for="(option, index) in paymentOptionsData"
                :key="index"
              >
                {{ option.provider }} - {{ option?.accountType?.accType }}
              </option>
            </select>
          </div>

          <div class="payTo" v-if="selectedPaymentMethod">
            <button @click="copyToClipboard">
              <svg
                id="icon-edit-copy"
                fill="currentColor"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <path
                  d="M6 6v-4c0-1.1 0.9-2 2-2h10c1.105 0 2 0.895 2 2v0 10c0 1.105-0.895 2-2 2v0h-4v4c0 1.105-0.895 2-2 2v0h-10c-1.105 0-2-0.895-2-2v0-10c0-1.1 0.9-2 2-2h4zM8 6h4c1.105 0 2 0.895 2 2v0 4h4v-10h-10v4zM2 8v10h10v-10h-10z"
                ></path>
              </svg>
            </button>
            <input
              ref="ussdInput"
              type="phone"
              :value="`*${selectedPaymentMethod?.accountType?.key}*${selectedPaymentMethod?.accountType?.number}*${props.amount}#`"
              disabled
            />
            <a
              :href="`tel:*${selectedPaymentMethod?.accountType?.key}*${selectedPaymentMethod?.accountType?.number}*${props.amount}#`"
            >
              <button>
                <IconSend />
              </button>
            </a>
          </div>

          <br /><br /><br />

          <div class="modal-actions">
            <button @click="confirmPaymentRequest" v-if="selectedPaymentMethod">
              Waan Diray
            </button>
            <button @click="showPaymentModal = false">Xir</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Toggle Options -->
    <button
      ref="plusButtonRef"
      class="sendButton"
      @click.stop="state.optionsMenu = !state.optionsMenu"
    >
      +
    </button>

    <!-- Chat Input -->
    <input
      v-model="msg.text"
      type="text"
      class="chatInput"
      placeholder="Type a message..."
      @keyup.enter="sendMessage"
    />

    <!-- Send / Mic Button -->
    <div class="buttonChat">
      <button
        v-if="msg.text.length >= 1"
        class="sendButton"
        @click="sendMessage"
      >
        <IconSend />
      </button>
      <button v-else class="sendButton" @click="onIconClick">
        <IconMic />
      </button>
    </div>

    <!-- Audio Preview -->
    <div v-if="audioPreviewUrl" class="audioPreview">
      <button @click="cancelRecordingUpload" class="cancelButton">
        <IconClose />
      </button>
      <audio :src="audioPreviewUrl" controls></audio>
      <button @click="uploadAudioToFirebase" class="uploadButton">
        <IconSend />
      </button>
    </div>

    <!-- Upload progress bar -->
    <div
      v-if="uploadProgress > 0 && uploadProgress < 100"
      class="uploadProgress"
    >
      Uploading... {{ uploadProgress }}%
      <div class="progressBar">
        <div
          class="progressFill"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import IconSend from "@/components/icons/send.vue";
import IconClose from "@/components/icons/close.vue";
import IconMic from "@/components/icons/mic.vue";
import Image from "@/components/icons/image.vue";
import Money from "@/components/icons/money.vue";
import Check from "@/components/icons/check.vue";
import { db, auth, storage } from "@/services/firebase";
import { ref as stRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useRoute } from "vue-router";

const props = defineProps<{
  isRecording?: boolean;
  msg_count?: number;
  senderId?: string;
  chatId?: string;
  sellerId?: string;
  amount?: number;
  currency?: string;
}>();

const emit = defineEmits<{
  (e: "send", message: any): void;
}>();
const route = useRoute();

const paymentOptionsData = ref<any[]>([]);
const plusOptionsRef = ref<HTMLElement | null>(null);
const plusButtonRef = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedPaymentMethod = ref<object | null>(paymentOptionsData.value[0]);

const state = reactive({
  isRecording: false,
  audioBlob: null as Blob | null,
  audioStream: null as MediaStream | null,
  optionsMenu: false,
  images: [] as File[],
});

const uploadProgress = ref(0);
const audioPreviewUrl = ref<string | null>(null);

const showPaymentModal = ref(false);

const confirmPaymentRequest = () => {
  const newMessage = {
    ...msg.value,
    type: "payment-request",
    text: "",
    content: {
      status: "Pending", // You can customize this later
      phone_number: "",
      amount: props.amount,
      currency: props.currency,
      payment_method: selectedPaymentMethod.value,
    },
  };

  emit("send", newMessage);
  msg.value = reset();
  showPaymentModal.value = false;
};

const cancelRecordingUpload = () => {
  if (audioPreviewUrl.value) URL.revokeObjectURL(audioPreviewUrl.value);
  audioPreviewUrl.value = null;
  state.audioBlob = null;
};

const messageId = ref(props.msg_count || 0);
const msg = ref({
  id: messageId.value,
  senderId: props.senderId || auth.currentUser?.uid || "anonymous",
  status: "Pending",
  text: "",
  timestamp: new Date().getTime(),
  type: "text",
});

const reset = () => ({
  id: ++messageId.value,
  senderId: props.senderId || auth.currentUser?.uid || "anonymous",
  status: "Pending",
  text: "",
  timestamp: new Date().getTime(),
  type: "text",
});

const sendMessage = () => {
  if (msg.value.text.trim()) {
    emit("send", msg.value);
    msg.value = reset();
  }
};

const openImageSelector = () => {
  fileInput.value?.click();
};

const uploadImages = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    state.images = Array.from(files);
    await uploadImagesToFirebase(state.images);
  }
};

const uploadImagesToFirebase = async (images: File[]) => {
  const uploadedUrls: string[] = [];
  let completed = 0;

  for (const file of images) {
    const imageRef = stRef(
      storage,
      `users/${route.params.chatId}/uploadedImages/${Date.now()}-${file.name}`
    );
    await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(imageRef);
    uploadedUrls.push(downloadUrl);
    completed++;
    uploadProgress.value = Math.round((completed / images.length) * 100);
  }

  const newMessage = {
    ...msg.value,
    type: "images",
    content: { imageUrls: uploadedUrls },
    text: "",
  };

  emit("send", newMessage);
  msg.value = reset();
  uploadProgress.value = 0;
};

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

const onIconClick = async () => {
  state.isRecording ? await stopRecording() : await startRecording();
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.audioStream = stream;

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      state.audioBlob = audioBlob;
      audioPreviewUrl.value = URL.createObjectURL(audioBlob);
      stopStream(); // 🔇 Ensure browser indicator stops
      audioChunks = [];
    };

    mediaRecorder.start();
    state.isRecording = true;
  } catch (error) {
    alert(
      "Microphone access denied or unavailable. Please check your browser settings."
    );
    console.error("Recording failed:", error);
  }
};

const stopRecording = async () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    state.isRecording = false;
  }
};

const stopStream = () => {
  if (state.audioStream) {
    state.audioStream.getTracks().forEach((track) => track.stop());
    state.audioStream = null;
  }
};

const convertAudioToFormats = async (audioBlob: Blob) => {
  const formats = ["mp3", "mp4", "wav", "ogg", "webm"];
  const audioFileUrls: Record<string, string> = {};

  const simulateConversion = (blob: Blob, format: string) =>
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(blob)), 500);
    });

  for (const format of formats) {
    audioFileUrls[format] = await simulateConversion(audioBlob, format);
  }

  return audioFileUrls;
};

const uploadAudioToFirebase = async () => {
  if (!state.audioBlob) return;

  const audioFileUrls = await convertAudioToFormats(state.audioBlob);
  const uploadedUrls: Record<string, string> = {};
  const formats = Object.keys(audioFileUrls);
  let completed = 0;

  for (const format of formats) {
    const fileBlob = await fetch(audioFileUrls[format]).then((res) =>
      res.blob()
    );
    const path = `audioMessages/${route.params.chatId}/${
      auth.currentUser?.uid || "anonymous"
    }/${Date.now()}.${format}`;
    const fileRef = stRef(storage, path);

    await uploadBytes(fileRef, fileBlob);
    const downloadUrl = await getDownloadURL(fileRef);
    uploadedUrls[format] = downloadUrl;
    completed++;
    uploadProgress.value = Math.round((completed / formats.length) * 100);
  }

  const newMessage = {
    ...msg.value,
    type: "audioFile",
    content: { audioFile: uploadedUrls },
    text: "",
  };

  emit("send", newMessage);
  msg.value = reset();
  state.audioBlob = null;
  audioPreviewUrl.value = null;
  uploadProgress.value = 0;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const clickedInsideOptions = plusOptionsRef.value?.contains(target) || false;
  const clickedPlusButton = plusButtonRef.value?.contains(target) || false;

  if (state.optionsMenu && !clickedInsideOptions && !clickedPlusButton) {
    state.optionsMenu = false;
  }
};

const getPaymentOptions = async () => {
  if (!auth.currentUser?.uid) throw new Error("User not authenticated");

  const optionsRef = collection(db, `users/${props.sellerId}/paymentOptions`);

  try {
    const snapshot = await getDocs(optionsRef);
    const options = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    paymentOptionsData.value = options;
    console.log(paymentOptionsData.value);
  } catch (error) {
    console.error("Error fetching payment options:", error);
    throw error;
  }
};

const openPaymentModal = async () => {
  showPaymentModal.value = true;
  await getPaymentOptions();
};

const ussdInput = ref<HTMLInputElement | null>(null);

const copyToClipboard = () => {
  if (ussdInput.value) {
    const input = ussdInput.value;
    navigator.clipboard
      .writeText(input.value)
      .then(() => {
        console.log("Copied:", input.value);
      })
      .catch((err) => {
        console.warn("❌ Copy failed:", err);
      });
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  setTimeout(async () => {
    await getPaymentOptions();
  }, 6000);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  stopStream(); // 🔒 cleanup audio stream on component unmount
});
</script>

<style lang="scss" scoped>
.payTo {
  display: flex;
  border-radius: 34px;
  border: 2px solid var(--primary-color);
  padding: 6px;
  margin-top: 16px;
  color: inherit;

  button,
  input {
    background: none;
    border: none;
    text-align: center;
    color: inherit;
  }

  input {
    font-weight: bold;
    text-align: center;
  }
}

.paymentOptions {
  select {
    border-radius: 34px;
    border: 2px solid var(--primary-color);
    padding: 12px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 16px;
    width: 100%;
  }
}

.audioPreview {
  background-color: #f0f0f0;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploadProgress {
  background-color: #f0f0f0;
  position: fixed;
  bottom: 100px;
  right: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  min-height: 50px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
