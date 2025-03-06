import { CommonModule } from "@angular/common";
import { Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PageEvent } from "@angular/material/paginator";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { EMPTY, catchError, finalize, switchMap } from "rxjs";

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
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    TruncatePipe
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly imageUploadService = inject(ImageUploadService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  
  public readonly responsiveService = inject(ResponsiveService);

  // Signals
  readonly loading = signal<boolean>(false);
  readonly categories = signal<Category[]>([]);
  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(12);
  readonly viewMode = signal<ViewMode>(
    !this.responsiveService.isMobilePortrait() && 
    !this.responsiveService.isMobileLandScape() ? 'table' : 'grid'
  );
  
  // Table columns - using readonly to prevent modifications
  readonly displayedColumns: readonly string[] = ['image', 'name', 'description', 'createdAt', 'actions'];

  // Computed properties with memoization
  readonly filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.categories();
    
    return this.categories().filter(category =>
      category.name.toLowerCase().includes(query) ||
      (category.description?.toLowerCase().includes(query) || false)
    );
  });

  readonly displayedCategories = computed(() => {
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          this.showError(`Failed to load categories: ${error.message || 'Unknown error'}`);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(categories => this.categories.set(categories));
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

    dialogRef.afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(result => {
          if (!result) return EMPTY;
          
          this.loading.set(true);
          if (category) {
            return this.categoryService.updateCategory(category._id, result)
              .pipe(
                finalize(() => this.loading.set(false)),
                catchError(error => {
                  this.showError(`Failed to update category: ${error.message || 'Unknown error'}`);
                  return EMPTY;
                })
              );
          } else {
            return this.categoryService.addCategory(result)
              .pipe(
                finalize(() => this.loading.set(false)),
                catchError(error => {
                  this.showError(`Failed to add category: ${error.message || 'Unknown error'}`);
                  return EMPTY;
                })
              );
          }
        })
      )
      .subscribe(updatedCategory => {
        if (!updatedCategory) return;
        
        if ('_id' in updatedCategory && this.categories().some(cat => cat._id === updatedCategory._id)) {
          // Update existing category
          this.categories.update(cats =>
            cats.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat)
          );
          this.showSuccess('Category updated successfully');
        } else {
          // Add new category
          this.categories.update(cats => [updatedCategory, ...cats]);
          this.showSuccess('Category added successfully');
        }
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

    dialogRef.afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(result => {
          if (!result) return EMPTY;
          
          this.loading.set(true);
          return this.categoryService.deleteCategory(category._id)
            .pipe(
              finalize(() => this.loading.set(false)),
              catchError(error => {
                this.showError(`Failed to delete category: ${error.message || 'Unknown error'}`);
                console.error(error);
                return EMPTY;
              }),
              switchMap(() => {
                // If the category has an image, delete it as well
                if (category.imageUrl) {
                  return this.imageUploadService.deleteImage(category.imageUrl);
                }
                return EMPTY;
              })
            );
        })
      )
      .subscribe(() => {
        this.categories.update(cats => cats.filter(cat => cat._id !== category._id));
        this.showSuccess('Category deleted successfully');
      });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
  }
}