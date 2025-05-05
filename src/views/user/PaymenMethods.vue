<template>
  <div class="page" id="payment-methods-page">
    <PageHeader title="Lacag Bixinta" :menu="true" />

    <div class="my_accounts">
      <PaymentOption
        v-for="option in paymentOptionsData"
        :key="option.id"
        :option="option"
      />
    </div>

    <button class="floater" @click="openModal">+</button>

    <transition name="slide-modal">
      <div
        v-if="isModalVisible"
        class="payment-optionsmodal"
        @click.self="closeModal"
      >
        <div class="content" :class="{ closing: isClosing }">
          <button class="close-button" @click="closeModal">×</button>

          <div class="field">
            <select class="method" v-model="newOption.provider">
              <option disabled value="">Xulo bixiyaha</option>
              <option
                v-for="option in paymentOptions"
                :key="option.id"
                :value="option.name"
              >
                {{ option.name }}
              </option>
            </select>
          </div>

          <div class="field" v-if="selectedAccounts.length">
            <select v-model="newOption.accountType">
              <option disabled value="">Xulo nooca akoonka</option>
              <option
                v-for="account in selectedAccounts"
                :key="account.accType"
                :value="account"
              >
                {{ account.accType }}
              </option>
            </select>
          </div>

          <div class="field phone_field" v-if="newOption.accountType.key">
            <label>{{ "*" + newOption.accountType.key + "*" }}</label>
            <input
              inputmode="numeric"
              pattern="[0-9]*"
              type="text"
              v-model="newOption.accountType.number"
            />
          </div>

          <div class="action">
            <button
              :disabled="!newOption.accountType.number"
              :class="{ disabled: !newOption.accountType.number }"
              @click="saveMethod"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/mobile/PageHeader.vue";
import PaymentOption from "@/components/payment/PaymentOption.vue";
import { ref, computed, onMounted } from "vue";
import { db, auth } from "@/services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useRoute } from "vue-router";

const route = useRoute();
const isModalVisible = ref(false);
const isClosing = ref(false);
const paymentOptionsData = ref<any[]>([]);

function openModal() {
  isModalVisible.value = true;
  isClosing.value = false;
}

function closeModal() {
  isClosing.value = true;
  setTimeout(() => {
    isModalVisible.value = false;
  }, 300);
}

const paymentOptions = ref([
  {
    id: 1,
    name: "EVC Plus",
    accounts: [
      { accType: "shakhsi", number: "", key: "712" },
      { accType: "ganacsi", number: "", key: "789" },
    ],
  },
  {
    id: 2,
    name: "eDahab",
    accounts: [
      { accType: "shakhsi", number: "", key: "123" },
      { accType: "ganacsi", number: "", key: "456" },
    ],
  },
  {
    id: 3,
    name: "Premier Wallet",
    accounts: [
      { accType: "boorsada", number: "" },
      { accType: "wareejin", number: "" },
    ],
  },
  {
    id: 4,
    name: "Salaama Bank",
    accounts: [{ accType: "Akoon", number: "", key: "789" }],
  },
]);

const newOption = ref({
  provider: "",
  accountType: {} as any,
});

const selectedAccounts = computed(() => {
  const provider = paymentOptions.value.find(
    (opt) => opt.name === newOption.value.provider
  );
  return provider?.accounts || [];
});

const isFormComplete = computed(() => {
  return (
    newOption.value.provider &&
    newOption.value.accountType &&
    Object.keys(newOption.value.accountType).length > 0
  );
});

async function saveMethod() {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  try {
    const docRef = await addDoc(
      collection(db, `users/${userId}/paymentOptions`),
      {
        ...newOption.value,
        createdAt: serverTimestamp(),
      }
    );

    console.log("Payment method added with ID:", docRef.id);
    closeModal();

    // Reset form
    newOption.value = {
      provider: "",
      accountType: {},
    };

    // Refresh list
    const options = await getPaymentOptions();
    paymentOptionsData.value = options;
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw error;
  }
}

const getPaymentOptions = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  const optionsRef = collection(db, `users/${userId}/paymentOptions`);

  try {
    const snapshot = await getDocs(optionsRef);
    const options = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return options;
  } catch (error) {
    console.error("Error fetching payment options:", error);
    throw error;
  }
};

onMounted(async () => {
  try {
    const options = await getPaymentOptions();
    paymentOptionsData.value = options;
  } catch (error) {
    console.error("Error fetching payment options:", error);
  }
});
</script>

<style lang="scss" scoped>
.floater {
  position: fixed;
  display: flex;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: #fff;
  font-size: 1.4rem;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
  z-index: 999;
  align-items: center;
  justify-content: center;
}

.payment-optionsmodal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  padding-bottom: 0;

  .content {
    position: relative;
    background-color: var(--background-color);
    width: 100%;
    max-width: 500px;
    border-radius: 1rem 1rem 0 0;
    padding: 1.5rem;
    box-shadow: 0 -4px 10px rgba(84, 109, 229, 0.1);
    animation: slideUp 0.3s ease-out;
    padding-top: 70px;

    &.closing {
      animation: slideDown 0.3s ease-in forwards;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      font-size: 1.8rem;
      color: inherit;
      cursor: pointer;
      z-index: 10;

      &:hover {
        color: #000;
      }
    }

    .phone_field {
      padding-left: 20px;
      padding-right: 20px;

      label {
        font-weight: bold;
        font-size: 1.2rem;
        margin-right: 0;
        padding: 0;
      }

      input {
        width: 100%;
        border: none;
        border-radius: 8px;
        background: none;
        font-size: 1.4rem;
        font-weight: 800;
        padding: 0 !important;
      }

      input {
        &:focus,
        &:hover {
          outline: none;
          background: none !important;
        }
      }
    }

    .field {
      margin-bottom: 1.2rem;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border: 2px solid var(--primary-color);
      border-radius: 5px;
      background-color: var(--faded-color);
      padding: 6px;

      select,
      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        background: none;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          background-color: #fff;
        }
      }

      label {
        display: block;
        margin-bottom: 0.4rem;
        font-weight: 500;
      }
    }

    .action {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;

      button.disabled {
        background: lightgray !important;
        color: #576574 !important;
        cursor: not-allowed;
        pointer-events: none;
      }

      button {
        flex: 1;
        padding: 0.75rem;
        background-color: var(--primary-color) !important;
        color: white !important;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;

        &:last-child {
          background-color: #ccc;
          color: #333;
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

.slide-modal-enter-active,
.slide-modal-leave-active {
  transition: opacity 0.3s ease;
}
.slide-modal-enter-from,
.slide-modal-leave-to {
  opacity: 0;
}

.my_accounts {
  display: flex;
  gap: 1rem;
  padding: 1.2rem;
}
</style>
