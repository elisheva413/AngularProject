import { ProductModel } from './Products-Model';

export interface CartItem {
  product: ProductModel;
  selectedQuantity: number;
}