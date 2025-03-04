import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { finalize } from "rxjs";

import { SharedModule } from "../../../shared/shared.module";
import { CategoryDetailsComponent } from "../category-details/category-details.component";
import { CategoryService } from "../../../services/category.service";
import { ImageUploadService } from "../../../services/image-upload.service";
import { ResponsiveService } from "../../../services/responsive.service";
import { Category } from "../../../shared/interfaces/category.interface";
import { ConfirmDialogComponent } from "../../../shared/generics/confirm-dialog.component";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";

type ViewMode = 'grid' | 'table';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule,
    TruncatePipe
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private imageUploadService = inject(ImageUploadService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public responsiveService = inject(ResponsiveService);

  // Signals
  loading = signal<boolean>(false);
  categories = signal<Category[]>([]);
  searchQuery = signal<string>('');
  currentPage = signal<number>(0);
  pageSize = signal<number>(12);
  viewMode = signal<ViewMode>('grid');
  
  // Table columns
  displayedColumns: string[] = ['image', 'name', 'description', 'createdAt', 'actions'];

  // Computed properties
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
    
    // Set initial view mode based on device
    if (!this.responsiveService.isMobilePortrait() && !this.responsiveService.isMobileLandScape()) {
      this.viewMode.set('table');
    }
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (categories) => this.categories.set(categories),
        error: (error) => this.showError(`Failed to load categories: ${error.message || 'Unknown error'}`)
      });
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(0); // Reset to first page when searching
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  openDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      data: category,
      width: this.responsiveService.isMobilePortrait() ? '95%' : '500px',
      maxWidth: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (category) {
          this.updateCategory(category._id, result);
        } else {
          this.addCategory(result);
        }
      }
    });
  }

  private addCategory(categoryData: any): void {
    this.loading.set(true);
    this.categoryService.addCategory(categoryData)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (newCategory) => {
          this.categories.update(cats => [newCategory, ...cats]);
          this.showSuccess('Category added successfully');
        },
        error: (error) => this.showError(`Failed to add category: ${error.message || 'Unknown error'}`)
      });
  }

  private updateCategory(id: string, categoryData: any): void {
    this.loading.set(true);
    this.categoryService.updateCategory(id, categoryData)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (updatedCategory) => {
          this.categories.update(cats =>
            cats.map(cat => cat._id === id ? updatedCategory : cat)
          );
          this.showSuccess('Category updated successfully');
        },
        error: (error) => this.showError(`Failed to update category: ${error.message || 'Unknown error'}`)
      });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.responsiveService.isMobilePortrait() ? '95%' : '350px',
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to delete "${category.name}"?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading.set(true);
        this.categoryService.deleteCategory(category._id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              // If the category has an image, delete it as well
              if (category.imageUrl) {
                this.imageUploadService.deleteImage(category.imageUrl).subscribe();
              }
              
              this.categories.update(cats =>
                cats.filter(cat => cat._id !== category._id)
              );
              this.showSuccess('Category deleted successfully');
            },
            error: (error) => this.showError(`Failed to delete category: ${error.message || 'Unknown error'}`)
          });
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
  }
}