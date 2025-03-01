import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { PageEvent } from "@angular/material/paginator";
import { Category } from "../../../shared/interfaces/category.interface";
import { SharedModule } from "../../../shared/shared.module";
import { CategoryDetailsComponent } from "../category-details/category-details.component";
import { finalize } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryService } from "../../../services/category.service";
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, MatInputModule, MatDialogModule, MatProgressBarModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  loading = signal<boolean>(false);
  categories = signal<Category[]>([]);
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

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (categories) => this.categories.set(categories),
        error: () => this.showError('Failed to load categories')
      });
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(0);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      data: category,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (category) {
          this.updateCategory(category.id, result);
        } else {
          this.addCategory(result);
        }
      }
    });
  }

  private addCategory(formData: FormData): void {
    this.loading.set(true);
    this.categoryService.addCategory(formData)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (newCategory) => {
          this.categories.update(cats => [...cats, newCategory]);
          this.showSuccess('Category added successfully');
        },
        error: () => this.showError('Failed to add category')
      });
  }

  private updateCategory(id: number, formData: FormData): void {
    this.loading.set(true);
    this.categoryService.updateCategory(id, formData)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (updatedCategory) => {
          this.categories.update(cats =>
            cats.map(cat => cat.id === id ? updatedCategory : cat)
          );
          this.showSuccess('Category updated successfully');
        },
        error: () => this.showError('Failed to update category')
      });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      this.loading.set(true);
      this.categoryService.deleteCategory(category.id)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.categories.update(cats =>
              cats.filter(cat => cat.id !== category.id)
            );
            this.showSuccess('Category deleted successfully');
          },
          error: () => this.showError('Failed to delete category')
        });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: 'error-snackbar' });
  }
}