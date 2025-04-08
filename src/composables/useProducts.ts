import { ref } from "vue";
import { db } from "@/services/firebase";
import { collection, query, where, orderBy, startAfter, limit, getDocs, DocumentData } from "firebase/firestore";

const products = ref<Product[]>([]);
const lastVisible = ref<any | null>(null);
const pageSize = 25;
const isLoading = ref(false);

const colabFilter = {
    intrested_in_by_category: [],
    not_intrested_in: ["video games"],
};

// Define the product type
interface Product {
    id: string;
    category: string;
    name: string;
    price: number;
    status: string;
    updatedAt: string;
}

async function fetchProducts() {
    isLoading.value = true;

    try {
        let q;
        const baseQuery = collection(db, "products");

        // Firestore query conditions
        let filters = [where("status", "==", "active")];

        if (colabFilter.intrested_in_by_category.length > 0) {
            filters.push(where("category", "in", colabFilter.intrested_in_by_category));
        }

        // Pagination logic
        if (lastVisible.value) {
            q = query(baseQuery, ...filters, orderBy("updatedAt"), startAfter(lastVisible.value), limit(pageSize));
        } else {
            q = query(baseQuery, ...filters, orderBy("updatedAt"), limit(pageSize));
        }

        const documentSnapshots = await getDocs(q);

        let fetchedProducts: Product[] = documentSnapshots.docs.map((doc) => ({
            uid: doc.id, ...(doc.data() as Product), // Ensure correct typing
        }));

        // 🔥 Filter out "not interested" categories manually
        if (colabFilter.not_intrested_in.length > 0) {
            fetchedProducts = fetchedProducts.filter(
                (product) => !colabFilter.not_intrested_in.includes(product.category)
            );
        }

        // Append new products
        products.value = [...products.value, ...fetchedProducts];

        // Update lastVisible for pagination
        if (!documentSnapshots.empty) {
            lastVisible.value = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        isLoading.value = false;
    }
}

export { products, fetchProducts, isLoading };
