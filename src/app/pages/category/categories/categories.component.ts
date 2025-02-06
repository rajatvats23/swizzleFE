import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { PageEvent } from "@angular/material/paginator";
import { Category } from "../../../shared/interfaces/category.interface";
import { SharedModule } from "../../../shared/shared.module";
import { CategoryDetailsComponent } from "../category-details/category-details.component";

@Component({
  selector: 'app-category',
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, MatInputModule, MatDialogModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  pancake: string = 'assets/images/pancake.webp';
  CATEGORIES: Category[] = [
    { id: 1, name: 'Pizzas', description: 'Italian hand-tossed pizzas', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Desserts', description: 'Sweet treats and confections', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: 'Beverages', description: 'Refreshing drinks', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: 'Snacks', description: 'Quick bites and appetizers', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: 'Main Course', description: 'Hearty main dishes', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: 'Salads', description: 'Fresh and healthy salads', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: 'Pasta', description: 'Italian pasta dishes', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: 'Soups', description: 'Warm and comforting soups', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 9, name: 'Sandwiches', description: 'Fresh sandwiches', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 10, name: 'Breakfast', description: 'Morning favorites', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 11, name: 'Asian', description: 'Asian cuisine', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() },
    { id: 12, name: 'Mexican', description: 'Mexican specialties', imageUrl: this.pancake, thumbnailUrl: this.pancake, createdAt: new Date(), updatedAt: new Date() }
  ];
  readonly dialog = inject(MatDialog);

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
    this.dialog.open(CategoryDetailsComponent, {
      // width: '250px'
    })
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