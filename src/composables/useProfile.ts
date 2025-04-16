import { ref } from "vue";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export function useProfile(uid: string) {
  const profile = ref<any>(null);
  const favorites = ref<any[]>([]);
  const userProducts = ref<any[]>([]);

  async function fetchUserProfile() {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) throw new Error("User not found");

      profile.value = { id: uid, ...userSnap.data() };

      await Promise.all([fetchFavorites(uid), fetchUserProducts(uid)]);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }

  async function fetchFavorites(uid: string) {
    const favRef = collection(db, "users", uid, "favorites");
    const favSnap = await getDocs(favRef);
    favorites.value = favSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async function fetchUserProducts(uid: string) {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("userId", "==", uid));
    const prodSnap = await getDocs(q);
    userProducts.value = prodSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Auto fetch when called
  fetchUserProfile();

  return {
    profile,
    favorites,
    userProducts,
  };
}
