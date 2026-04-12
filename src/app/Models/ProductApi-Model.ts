import { ProductModel } from './Products-Model';

export type ProductsResponse = {
  items: ProductModel[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export interface ProductFilters {
  categoryId?: number | number[];
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  material?: string;
  inStock?: boolean;
  isActive?: boolean;
  sort?: string;
  skip?: number;
  position?: number;
}

