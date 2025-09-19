// path: src/types/seller.ts
export interface SellerInfo {
  id: string;
  name: string;
  type: "company" | "individual";
  rating: number;
  reviewCount?: number;
  registrationDate: string;
  totalProducts: number;
  verificationStatus: "verified" | "unverified" | string;
  location: {
    country: string;
    city: string;
    region?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  businessInfo?: {
    inn?: string;
    ogrn?: string;
    legalAddress?: string;
  };
}
