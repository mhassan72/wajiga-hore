import { ref } from 'vue';
import { storage, dbRt as db} from '@/services/firebase'; // Assuming Firebase is being used for storage and realtime database
import { uploadBytes, getDownloadURL, ref as stRef } from 'firebase/storage'; // Importing Firebase methods
import { push, ref as dbRef  } from 'firebase/database'; // For adding to Realtime Database
import { Message } from '@/composables/useChat'; // Importing the Message type

export function useAudioRecorder() {
  const isRecording = ref(false);
  const audioChunks = ref<Blob[]>([]);
  const audioBlob = ref<Blob | null>(null);
  const audioURL = ref<string | null>(null);
  const audioElement = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const userMessage = ref(""); // For the text message to accompany the audio

  let mediaRecorder: MediaRecorder | null = null;
  let mediaStream: MediaStream | null = null;

  // Define the formats (MP3, MP4, WAV, OGG, WEBM)
  const formats = ['mp3', 'mp4', 'wav', 'ogg', 'webm'];
  const audioFileUrls: Record<string, string> = {};

  // Toggle recording state
  const toggleRecording = async () => {
    if (isRecording.value) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(mediaStream);

      audioChunks.value = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.value.push(event.data);
      };

      mediaRecorder.onstop = processAudio;

      mediaRecorder.start();
      isRecording.value = true;
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Microphone access denied or unavailable.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    isRecording.value = false;
  };

  // Process recorded audio
  const processAudio = async () => {
    if (audioChunks.value.length === 0) return;

    audioBlob.value = new Blob(audioChunks.value, { type: "audio/webm" });
    audioURL.value = URL.createObjectURL(audioBlob.value);

    if (audioElement.value) {
      audioElement.value.src = audioURL.value;
      audioElement.value.load();
    }

    await uploadAudioInFormats(audioBlob.value);
  };

  // Upload audio in different formats
  const uploadAudioInFormats = async (audioBlob: Blob) => {
    for (const format of formats) {
      const audioRef = stRef(storage, `audioMessages/${Date.now()}.${format}`);
      await uploadBytes(audioRef, audioBlob);
      const audioUrl = await getDownloadURL(audioRef);
      audioFileUrls[format] = audioUrl;
    }
    console.log(audioFileUrls);
  };

  // Play recorded audio
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

  // Pause recorded audio
  const pauseAudio = () => {
    if (audioElement.value) {
      audioElement.value.pause();
      isPlaying.value = false;
    }
  };

  // Stop recorded audio
  const stopAudio = () => {
    if (audioElement.value) {
      audioElement.value.pause();
      audioElement.value.currentTime = 0;
      isPlaying.value = false;
    }
  };

  // Delete the current audio and reset the state
  const deleteAudio = () => {
    audioBlob.value = null;
    audioURL.value = null;
    audioChunks.value = [];
  };

  // Re-record a new message by deleting old audio and starting new recording
  const reRecord = () => {
    deleteAudio();
    startRecording();
  };

  // Send the audio message to Realtime Database
  const sendRecording = async () => {
    if (audioBlob.value) {
      await sendAudioMessage();
    }
  };

  // Send audio message to Realtime Database using the Message interface
  const sendAudioMessage = async () => {
    const message: Message = {
        id: Date.now().toString(),
        senderId: "currentUser", // Replace with actual sender ID
        recipientId: "recipientUser", // Replace with actual recipient ID
        type: "audioFile", // Updated to "audioFile" type
        content: {
          audioFile: {
            mp3: audioFileUrls['mp3'],
            mp4: audioFileUrls['mp4'],
            wav: audioFileUrls['wav'],
            ogg: audioFileUrls['ogg'],
            webm: audioFileUrls['webm'],
          }
        },
        timestamp: Date.now(),
        seen: false,
      };
    
      // Create a reference to the 'messages' node
      const messagesRef = dbRef(db, 'messages');
    
      // Push the message object to Firebase Realtime Database
      await push(messagesRef, message);
  };

  return {
    isRecording,
    audioChunks,
    audioBlob,
    audioURL,
    audioElement,
    isPlaying,
    userMessage,
    toggleRecording,
    playAudio,
    pauseAudio,
    stopAudio,
    deleteAudio,
    reRecord,
    sendRecording,
  };
}
