// src/app/shared/interfaces/addon.interface.ts

export interface Addon {
    _id: string;
    name: string;
    description: string;
    price: number;
    selectionType: 'single' | 'multiple';
    addonType: 'topping' | 'sauce' | 'extra' | 'option';
    imageUrl?: string;
    applicableProducts: string[];
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AddonCreate {
    name: string;
    description: string;
    price: number;
    selectionType: 'single' | 'multiple';
    addonType: 'topping' | 'sauce' | 'extra' | 'option';
    imageUrl?: string;
    applicableProducts: string[];
  }
  
  export interface AddonUpdate {
    name?: string;
    description?: string;
    price?: number;
    selectionType?: 'single' | 'multiple';
    addonType?: 'topping' | 'sauce' | 'extra' | 'option';
    imageUrl?: string;
    applicableProducts?: string[];
    isActive?: boolean;
  }