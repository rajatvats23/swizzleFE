export interface Category {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CategoryCreate {
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}