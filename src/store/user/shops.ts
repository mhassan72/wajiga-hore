import { ref } from 'vue'
import { app } from '@/services/firebase'
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore"; 

// initialize Firebase DB
const db = getFirestore(app);

export const shops  = ref<Array<any>>([])


export async function fetchShops(uid: string) {

    // get all shops 
    const querySnapshot = await getDocs(collection(db, "shops"));
    querySnapshot.forEach((doc) => {
        shops.value.push({id: doc.id , data: doc.data()})
    });
}