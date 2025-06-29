export interface Brand {
  id: number;
  name: string;
}

export interface Logo {
  id: number;
  name: string;
  filePath: string;
}

export interface Product {
  id: number;
  name: string;
  partnerName: string;
  registrationDate: string;
  price: number;
  profitPercentage: number;
  description?: string; // Optional field
  logo: Logo;
  brand: Brand;
}