import { ref } from 'vue'
import { db } from '@/services/firebase'
import { doc, getDoc } from "firebase/firestore";
import  type { Profile } from '@/types/user/profile'

const profile = ref<Record<string, Profile| any>>({})

async function fetchProfile(uid: string) {
    // Check if profile is already cached
    if (profile.value[uid]) {
        return profile.value[uid]; // Return cached data
    }

    // Fetch from Firestore
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        profile.value.data = docSnap.data(); // Cache the data
        console.log(profile.value.data)
        return profile.value.data;
    } else {
        return null; // Handle case where profile does not exist
    }
}

export {
    profile,
    fetchProfile
}