import { Product } from "./product.model";

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
}

export interface CartProduct extends Product {
  quantity: number;
}