<template>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  
  // Canvas reference and dimensions
  const canvas = ref<HTMLCanvasElement | null>(null);
  const width = ref(window.innerWidth);
  const height = ref(100);
  const animationFrameId = ref<number | null>(null);
  
  // Audio setup
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let microphoneStream: MediaStream | null = null;
  
  // Function to draw the waveform
  const drawWaveform = (ctx: CanvasRenderingContext2D, time: number) => {
    ctx.clearRect(0, 0, width.value, height.value);
    ctx.fillStyle = '#546de5'; // Bar color
  
    // Draw the waveform using the audio data
    analyser.getByteFrequencyData(dataArray);
  
    const barWidth = 2;
    const barSpacing = 1;
    const maxBarHeight = height.value - 10;
  
    // Loop through the audio data to visualize the waveform
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = dataArray[i] * (maxBarHeight / 255);
      const x = i * (barWidth + barSpacing);
      const y = height.value - barHeight;
  
      // Draw each bar for the waveform
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };
  
  // Animation loop
  const animate = (ctx: CanvasRenderingContext2D) => {
    const time = performance.now() * 0.002; // Smoothly incrementing time
    drawWaveform(ctx, time);
    animationFrameId.value = requestAnimationFrame(() => animate(ctx));
  };
  
  // Handle window resize
  const handleResize = () => {
    width.value = canvas.value?.parentElement?.clientWidth || window.innerWidth;
  };
  
  // Start the audio stream
  const startAudioStream = async () => {
    try {
      // Get microphone stream
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sourceNode = audioContext.createMediaStreamSource(microphoneStream);
      sourceNode.connect(analyser);
      analyser.fftSize = 256; // The size of the frequency bin array
      animate(canvas.value?.getContext('2d')!); // Start the animation loop
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    const ctx = canvas.value?.getContext('2d');
    if (ctx) {
      startAudioStream();
    }
    window.addEventListener('resize', handleResize);
    handleResize();
  });
  
  onUnmounted(() => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
    window.removeEventListener('resize', handleResize);
    // Stop the microphone stream when unmounted
    if (microphoneStream) {
      const tracks = microphoneStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  });
  
  // Watch width changes to update the canvas
  watch(width, () => {
    const ctx = canvas.value?.getContext('2d');
    if (ctx) {
      drawWaveform(ctx, performance.now() * 0.002);
    }
  });
  </script>
  
  <style scoped>
  canvas {
    display: block;
    margin: 0 auto; /* Center the canvas horizontally */
    width: 90%;
    height: 60px;
  }
  </style>
  