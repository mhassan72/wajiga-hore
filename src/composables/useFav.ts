// useFav.ts
import { db, auth } from "@/services/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { ref } from "vue";
import { getAuth } from "firebase/auth";

export function useFav() {
  const user = auth.currentUser;
  const isFavorite = ref(false);

  async function checkIfFavorite(productId: string) {
    if (!user) return;
    const favoriteRef = doc(db, "users", user.uid, "favorites", productId);
    const docSnap = await getDoc(favoriteRef);
    isFavorite.value = docSnap.exists();
  }

  async function toggleFavorite(productId: string) {
    if (!user) return;
    const favoriteRef = doc(db, "users", user.uid, "favorites", productId);
    if (isFavorite.value) {
      await deleteDoc(favoriteRef);
      isFavorite.value = false;
    } else {
      await setDoc(favoriteRef, { productId });
      isFavorite.value = true;
    }
  }

  async function removeProductFromFavorite(productId: string) {
    if (!user) return;
    const favoriteRef = doc(db, "users", user.uid, "favorites", productId);
    await deleteDoc(favoriteRef);
    isFavorite.value = false;
  }

  async function getUserFavorites() {
    if (!user) return [];
    const favRef = collection(db, "users", user.uid, "favorites");
    const snapshot = await getDocs(favRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Fetch favorite product IDs for the current user
  async function getUserFavoriteIds(): Promise<string[]> {
    const user = auth.currentUser;
    if (!user) return [];

    const favRef = collection(db, "users", user.uid, "favorites");
    const snapshot = await getDocs(favRef);
    return snapshot.docs.map((doc) => doc.id);
  }

  // Fetch product details by IDs
  async function getProductsByIds(productIds: string[]) {
    if (!productIds.length) return [];

    const productsRef = collection(db, "products");
    const q = query(productsRef, where(documentId(), "in", productIds));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  return {
    isFavorite,
    checkIfFavorite,
    toggleFavorite,
    getUserFavorites,
    getUserFavoriteIds,
    getProductsByIds,
    removeProductFromFavorite,
  };
}
