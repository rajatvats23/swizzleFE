// src/app/shared/interfaces/product.interface.ts
import { Category } from './category.interface';

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  thumbnailUrl?: string;
  categoryId: Category | string;
  preparationTime?: number;
  ingredients: string[];
  nutritionalInfo?: NutritionalInfo;
  variants: Variant[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Variant {
  _id?: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface ProductCreate {
  name: string;
  description: string;
  basePrice: number;
  categoryId?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  preparationTime?: number;
  ingredients?: string[];
  nutritionalInfo?: NutritionalInfo;
  variants?: Variant[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  basePrice?: number;
  categoryId?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  preparationTime?: number;
  ingredients?: string[];
  nutritionalInfo?: NutritionalInfo;
  variants?: Variant[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isActive?: boolean;
}