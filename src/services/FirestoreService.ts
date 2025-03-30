import { db } from "./firebase";
import { 
    collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, DocumentData 
} from "firebase/firestore";  

export default class FirestoreService<T extends DocumentData> {  
    private collectionName: string;  

    constructor(collectionName: string) {  
        this.collectionName = collectionName;  
    }  

    private getCollectionRef() {  
        return collection(db, this.collectionName);  
    }  

    private getDocRef(id: string) {  
        return doc(db, this.collectionName, id);  
    }  

    /**  
     * Create or update a document (with merge enabled to prevent data loss)  
     */  
    async set(id: string, data: T): Promise<void> {  
        await setDoc(this.getDocRef(id), data as DocumentData, { merge: true });  
    }  

    /**  
     * Retrieve a document  
     */  
    async get(id: string): Promise<T | null> {  
        const snapshot = await getDoc(this.getDocRef(id));  
        return snapshot.exists() ? (snapshot.data() as T) : null;  
    }  

    /**  
     * Update a document  
     */  
    async update(id: string, data: Partial<T>): Promise<void> {  
        await updateDoc(this.getDocRef(id), data as DocumentData);  
    }  

    /**  
     * Delete a document  
     */  
    async delete(id: string): Promise<void> {  
        await deleteDoc(this.getDocRef(id));  
    }  

    /**  
     * Retrieve all documents from the collection (including document IDs)  
     */  
    async getAll(): Promise<(T & { id: string })[]> {  
        const snapshot = await getDocs(this.getCollectionRef());  
        return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));  
    }  
}
