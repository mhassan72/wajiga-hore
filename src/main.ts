import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')


// Function to update the theme-color meta tag
function updateThemeColor() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeColor = isDarkMode ? '#121212' : '#ffffff'; // Match your CSS variables
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }
  
  // Initial call to set the theme color
  updateThemeColor();
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);