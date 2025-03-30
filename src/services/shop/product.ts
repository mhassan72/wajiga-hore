import { ref } from "vue";
import FirestoreService from "../FirestoreService";
import type { DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { collection, doc, onSnapshot, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";

// Assuming Product is a defined type
import type { Product } from "@/types/product";

// Defining the product ref with the proper type
export const product = ref<Product>({
  name: "",
  description: "",
  category: "Uncategorized",
  subcategory: "",
  price: 0,
  currency: "USD",
  stock: 0,
  images: [],
  sellerId: "",
  userId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "active",
  attributes: [],
  metadata: {
    views: 0,
    clicks: 0,
    favorites: 0,
  },
  sellerInfo: {
    rating: 0,
    location: "",
    returnPolicy: "NONE",
  },
});

export default class ProductService {
  private database: FirestoreService<Product>;

  constructor() {
    // Initialize the Firestore service with the type Product
    this.database = new FirestoreService<Product>("products");
  }

  /**  
   * Generate a new Firestore document ID  
   */
  async generateNewId(): Promise<string> {
    return doc(collection(db, "products")).id;
  }

  /**  
   * Create a new product  
   */
  async create(): Promise<void> {
    try {
      const newId = await this.generateNewId();
      const newProduct: Product = {
        ...product.value,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Set the new product to Firestore
      await this.database.set(newId, newProduct);
      console.log("Product created successfully:", newId);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  /**  
   * Get a product by ID  
   */
  async getProduct(id: string): Promise<Product | null> {
    return await this.database.get(id);
  }

  /**  
   * Update a product  
   */
  async update(id: string, data: Partial<Product>): Promise<void> {
    data.updatedAt = new Date(); // Ensure timestamp updates
    await this.database.update(id, data);
  }

  /**  
   * Delete a product  
   */
  async delete(id: string): Promise<void> {
    await this.database.delete(id);
  }

  /**  
   * Retrieve all products with pagination  
   */
  async getAllPaginated(lastDoc: DocumentData | null, pageSize: number = 10) {
    let productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(pageSize));

    if (lastDoc) {
      productsQuery = query(productsQuery, startAfter(lastDoc));
    }

    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Product) }));
  }

  /**  
   * Listen to real-time product changes  
   */
  listenToProductChanges(callback: (products: Product[]) => void) {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Product) }));
      callback(products);
    });
  }
}
