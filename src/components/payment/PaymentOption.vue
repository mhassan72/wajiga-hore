<template>
  <div class="payment-option">
    <div class="header">
      <div class="left">
        <strong>{{ option.provider }}</strong> <br />
        <small>{{ option.accountType.accType }}</small>
      </div>
      <div class="right">
        <button @click="dropdownMenu">
          <svg
            id="icon-more-vertical"
            fill="currentColor"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 5c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 19c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z"
            />
          </svg>
        </button>

        <div v-if="showDropdown" class="dropdown">
          <button @click="handleDelete">Delete</button>
          <button @click="showDropdown = !showDropdown">x</button>
          <!-- Add more actions here if needed -->
        </div>
      </div>
    </div>

    <h3>{{ option.accountType.key }} - {{ option.accountType.number }}</h3>
    <span>{{ option.name }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { db, auth } from "@/services/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const props = defineProps<{
  option: {
    id: string;
    provider: string;
    accountType: {
      accType: string;
      number: string;
      key?: string;
    };
    name?: string;
  };
}>();

const showDropdown = ref(false);

function dropdownMenu() {
  showDropdown.value = !showDropdown.value;
}

async function handleDelete() {
  const userId = auth.currentUser?.uid;
  if (!userId || !props.option.id) return;

  try {
    await deleteDoc(
      doc(db, `users/${userId}/paymentOptions/${props.option.id}`)
    );
    console.log("Payment option deleted.");
    showDropdown.value = false;
    // Optionally, emit an event to the parent to refresh the list
    // emit("refresh");
  } catch (err) {
    console.error("Failed to delete payment method:", err);
  }
}
</script>

<style scoped lang="scss">
.payment-option {
  border: 2px solid var(--primary-color);
  background-color: var(--faded-color);
  padding: 10px;
  border-radius: 5px;
  max-width: 200px;
  min-width: 200px;

  button {
    background: none;
    border-radius: 50px;
    padding: 4px;
    cursor: pointer;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;

    .left {
      width: 100%;
    }

    .right {
      position: relative;

      .dropdown {
        position: absolute;
        top: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        padding: 6px 12px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10;
        white-space: nowrap;

        button {
          background: none;
          border: none;
          color: black;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            color: red;
          }
        }
      }
    }
  }
}
</style>
