// export interface StartShop {
//     name: string;
//     owner: string;
//     description: string;
//     category: string;
//     metadata: {
//         tags: string[];
//         createdAt: Date;
//         updatedAt: Date;
//     };
// }

export interface Shop {
    name: string; // Shop name
    owner: string; // User ID of the shop owner
    description: string; // Shop bio/description
    category: string; // Type of shop (e.g., electronics, fashion, food)

    media?: {
        logo: string; // URL of shop logo
        banner: string; // URL of shop banner
        gallery: string[]; // Array of additional image URLs
        video?: string; // Optional shop introduction video URL
    };

    contact?: {
        email: string; // Contact email
        phone: string; // Contact phone number
        website?: string; // Optional website URL
        social: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            tiktok?: string;
            youtube?: string;
            whatsapp?: string; // WhatsApp contact link
            telegram?: string; // Telegram group link
        };
    };

    address?: {
        city: string;
        state: string;
        country: string;
        location: {
            latitude: number;
            longitude: number;
        };
    };

    status?: {
        visibility: 'public' | 'private' | 'hidden'; // Enum: public, private, hidden
        operational: 'active' | 'suspended' | 'closed'; // Enum: active, suspended, closed
        verified: boolean; // Whether the shop is verified
        featured: boolean; // Whether the shop is featured
    };

    settings?: {
        allowReviews: boolean; // Whether customers can leave reviews
        allowFollow: boolean; // Whether users can follow the shop
        currency: string; // Default shop currency (e.g., 'USD')
        language: string; // Default shop language (e.g., 'en')
        paymentMethods: string[]; // Accepted payments (e.g., ['paypal', 'stripe'])
        shippingOptions: string[]; // Shipping options (e.g., ['local', 'international'])
        autoReply: {
            enabled: boolean;
            message: string;
        };
    };

    analytics?: {
        rating: number; // Aggregate rating from reviews
        reviewsCount: number; // Number of reviews
        productsCount: number; // Number of products listed
        followersCount: number; // Number of users following the shop
        totalSales: number; // Number of completed orders
        revenue: number; // Total revenue generated
        lastOrderAt: Date | null; // Timestamp of the last order
        traffic: {
            dailyViews: number; // Daily views of the shop
            weeklyViews: number; // Weekly views of the shop
            monthlyViews: number; // Monthly views of the shop
            peakTrafficTimes: { // Traffic during different times of day
                morning: number;
                afternoon: number;
                evening: number;
            };
            referralSources: { // Traffic sources
                direct: number;
                socialMedia: number;
                searchEngines: number;
                externalLinks: number;
            };
        };
        engagement: {
            comments: number; // Number of comments on shop posts
            likes: number; // Number of likes on the shop profile
            shares: number; // Number of shares of the shop profile
        };
        conversionRate: number; // Percentage of visitors who complete a purchase
        cartAbandonmentRate: number; // Percentage of visitors who add items to cart but don't buy
    };

    metadata: {
        tags: string[]; // Searchable tags (e.g., ["handmade", "vintage", "tech"])
        createdAt: Date | string; // Timestamp of shop creation
        updatedAt: Date | string; // Timestamp of last update
    };

    social?: {
        followers: string[]; // Array of user IDs following this shop
        posts: string[]; // Array of post IDs related to the shop (for social feed)
    };

    embeddings?: {
        shopEmbedding: string; // Embedding vector for the shop's profile (e.g., for semantic search)
        productEmbeddings: string[]; // Array of product embeddings related to the shop
    };
};


