export type ProductStatus = "active" | "sold" | "archived" | "pending";

export interface ProductMetadata {
    views: number;
    clicks: number;
    favorites: number;
}

export interface SellerInfo {
    rating: number; // Average seller rating
    location?: string; // City, Country (if applicable)
    returnPolicy?: string; // Return terms if applicable
}

export interface Attribute {
    key: string;
    type: string;
    value: number | string | null;
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    currency: string;
    stock: number;
    images: string[];
    sellerId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    status: ProductStatus;
    attributes: Attribute[]; // Now correctly an array
    metadata?: ProductMetadata;
    sellerInfo?: SellerInfo;
}
