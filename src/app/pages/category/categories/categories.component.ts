import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { PageEvent } from "@angular/material/paginator";
import { Category } from "../../../shared/interfaces/category.interface";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-category',
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  CATEGORIES: Category[] = [
    { id: 1, name: 'Pizzas', description: 'Italian hand-tossed pizzas', imageUrl: 'assets/images/pizza.jpg', thumbnailUrl: 'assets/images/pizza-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Desserts', description: 'Sweet treats and confections', imageUrl: 'assets/images/desserts.jpg', thumbnailUrl: 'assets/images/desserts-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: 'Beverages', description: 'Refreshing drinks', imageUrl: 'assets/images/beverages.jpg', thumbnailUrl: 'assets/images/beverages-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: 'Snacks', description: 'Quick bites and appetizers', imageUrl: 'assets/images/snacks.jpg', thumbnailUrl: 'assets/images/snacks-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: 'Main Course', description: 'Hearty main dishes', imageUrl: 'assets/images/main.jpg', thumbnailUrl: 'assets/images/main-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: 'Salads', description: 'Fresh and healthy salads', imageUrl: 'assets/images/salads.jpg', thumbnailUrl: 'assets/images/salads-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: 'Pasta', description: 'Italian pasta dishes', imageUrl: 'assets/images/pasta.jpg', thumbnailUrl: 'assets/images/pasta-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: 'Soups', description: 'Warm and comforting soups', imageUrl: 'assets/images/soups.jpg', thumbnailUrl: 'assets/images/soups-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 9, name: 'Sandwiches', description: 'Fresh sandwiches', imageUrl: 'assets/images/sandwiches.jpg', thumbnailUrl: 'assets/images/sandwiches-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 10, name: 'Breakfast', description: 'Morning favorites', imageUrl: 'assets/images/breakfast.jpg', thumbnailUrl: 'assets/images/breakfast-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 11, name: 'Asian', description: 'Asian cuisine', imageUrl: 'assets/images/asian.jpg', thumbnailUrl: 'assets/images/asian-thumb.jpg', createdAt: new Date(), updatedAt: new Date() },
    { id: 12, name: 'Mexican', description: 'Mexican specialties', imageUrl: 'assets/images/mexican.jpg', thumbnailUrl: 'assets/images/mexican-thumb.jpg', createdAt: new Date(), updatedAt: new Date() }
  ];
  private dialog = inject(MatDialog);

  categories = signal<Category[]>(this.CATEGORIES);
  searchQuery = signal<string>('');
  currentPage = signal<number>(0);
  pageSize = signal<number>(12);

  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.categories().filter(category =>
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });

  displayedCategories = computed(() => {
    const filtered = this.filteredCategories();
    const start = this.currentPage() * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  });

  updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(0); // Reset to first page on search
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openDialog(): void {
    // Implement dialog opening logic
  }

  viewCategory(category: Category): void {
    // Implement view logic
  }

  editCategory(category: Category): void {
    // Implement edit logic
  }

  deleteCategory(category: Category): void {
    // Implement delete logic
  }
}