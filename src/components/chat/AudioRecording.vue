<template>
  <!-- Audio Recording -->
  <div v-if="message.type === 'audioFile'" class="audio">
    <audio controls>
      <source
        :src="(message.content as Context).audioFile?.mp3"
        type="audio/mpeg"
      />
      <source
        :src="(message.content as Context).audioFile?.ogg"
        type="audio/ogg"
      />
      <source
        :src="(message.content as Context).audioFile?.webm"
        type="audio/webm"
      />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>
<script lang="ts" setup>
import type { Message, Context } from "@/composables/useChat";

defineProps<{
  message: any;
}>();
</script>
