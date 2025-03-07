import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import {
  TableComponent,
  PaginationConfig,
  SortConfig,
} from "../../../shared/generics/table/table.component";
import {
  CategoryService,
  CategoryQueryParams,
  CategoryResponse,
} from "../../../services/category.service";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Sort } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryDetailsComponent } from "../category-details/category-details.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Category, CategoryCreate, CategoryUpdate } from "../../../shared/interfaces/category.interface";
import { ConfirmDialogComponent, ConfirmDialogData } from "../../../shared/generics/confirm-dialog.component";

interface CategoryTableItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
}

@Component({
  selector: "app-category-list",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  template: `
    <mat-card class="category-card">
      <mat-card-header>
        <mat-card-title>Categories</mat-card-title>
        <div class="spacer"></div>

        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearchInput()" />
          <mat-icon matPrefix>search</mat-icon>
          @if (searchTerm) {
          <button
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="clearSearch()"
          >
            <mat-icon>close</mat-icon>
          </button>
          }
        </mat-form-field>

        <button mat-raised-button class="add" (click)="addCategory()">
          <mat-icon>add</mat-icon> Add Category
        </button>
      </mat-card-header>
      <mat-card-content>
        <!-- Loading Progress Bar -->
        @if (isLoading()) {
        <mat-progress-bar
          mode="buffer"
          [value]="0"
          [bufferValue]="0"
          class="custom-progress-bar"
        >
        </mat-progress-bar>
        } @else if (formattedCategories().length > 0) {
        <app-table
          [dataSource]="formattedCategories()"
          [displayedColumns]="displayColumns"
          [(pagination)]="paginationConfig"
          [(sorting)]="sortingConfig"
          [isLoading]="isLoading()"
          (edit)="editCategory($event)"
          (delete)="deleteCategory($event)"
          (sort)="onSortChange($event)"
          (page)="onPageChange($event)"
        >
        </app-table>
        } @else {
        <div class="empty-state">
          <mat-icon>category</mat-icon>
          <p>No categories found. Add your first category to get started.</p>
        </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .category-card {
        background-color: #f9f9f9;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
      }

      mat-card-content {
        overflow: hidden;
      }

      .add {
        background-color: #009c4c;
        color: white;
      }

      .spacer {
        flex: 1 1 auto;
      }

      mat-card-header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        padding: 16px 16px 0 16px;
        flex-wrap: wrap;
      }

      .search-field {
        margin-right: 16px;
        width: 200px;
      }

      .empty-state,
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: rgba(0, 0, 0, 0.54);
      }

      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
      }

      /* Responsive styles */
      @media (max-width: 768px) {
        mat-card-header {
          flex-direction: column;
          align-items: stretch;
        }

        .search-field {
          width: 100%;
          margin-right: 0;
          margin-bottom: 16px;
        }

        .add {
          align-self: flex-end;
        }
      }
    `,
  ],
})
export class CategoryListComponent implements OnInit {
  // Dependency injection using inject function
  private service = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // State signals
  private rawCategories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  displayColumns: string[] = [
    "name",
    "description",
    "createdAt",
    "updatedAt",
    "actions",
  ];
  searchTerm = "";

  // Search subject for debouncing
  private searchSubject = new Subject<string>();

  // Pagination configuration with signal
  paginationConfig: PaginationConfig = {
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
  };

  // Sorting configuration with signal
  sortingConfig: SortConfig = {
    active: "createdAt",
    direction: "desc",
  };

  // Formatted categories signal
  formattedCategories = computed<CategoryTableItem[]>(() => {
    return this.rawCategories().map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      createdAt: new Date(item.createdAt).toLocaleString(),
      updatedAt: new Date(item.updatedAt).toLocaleString(),
      actions: item._id,
    }));
  });

  constructor() {
    // Set up search debounce
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        this.paginationConfig.pageIndex = 0; // Reset to first page on search
        this.loadCategories();
      });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);

    const params: CategoryQueryParams = {
      page: this.paginationConfig.pageIndex + 1, // Backend uses 1-based indexing
      limit: this.paginationConfig.pageSize,
      sortBy: this.sortingConfig.active || "createdAt",
      sortDirection: this.sortingConfig.direction || "desc",
      search: this.searchTerm,
    };

    this.service.getCategories(params).subscribe({
      next: (response: CategoryResponse) => {
        this.rawCategories.set(response.data as Category[]);
        this.paginationConfig.totalItems = response.pagination.total;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading categories:", err);
        this.isLoading.set(false);
        this.snackBar.open("Failed to load categories. Please try again.", "Close", {
          duration: 5000,
        });
      },
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.searchSubject.next("");
  }

  onSortChange(event: Sort): void {
    // Already updated in the table component
    this.loadCategories();
  }

  onPageChange(event: PageEvent): void {
    // Already updated in the table component
    this.loadCategories();
  }

  addCategory() {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: '600px',
      data: null // Passing null indicates we're adding a new category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading.set(true);
        
        const newCategory: CategoryCreate = {
          name: result.name,
          description: result.description,
          imageUrl: result.imageUrl
        };

        this.service.createCategory(newCategory).subscribe({
          next: () => {
            this.snackBar.open('Category created successfully', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error creating category:', error);
            this.isLoading.set(false);
            this.snackBar.open('Failed to create category. Please try again.', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  editCategory(categoryItem: CategoryTableItem) {
    this.isLoading.set(true);
    
    // First, get the full category details
    this.service.getCategoryById(categoryItem.id).subscribe({
      next: (categoryData: Category) => {
        this.isLoading.set(false);
        
        const dialogRef = this.dialog.open(CategoryDetailsComponent, {
          width: '600px',
          data: categoryData // Pass the full category data
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.isLoading.set(true);
            
            const updatedCategory: CategoryUpdate = {
              name: result.name,
              description: result.description
            };
            
            // Only include imageUrl if it was changed
            if (result.imageUrl !== categoryData.imageUrl) {
              updatedCategory.imageUrl = result.imageUrl;
            }

            this.service.updateCategory(categoryItem.id, updatedCategory).subscribe({
              next: () => {
                this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
                this.loadCategories();
              },
              error: (error) => {
                console.error('Error updating category:', error);
                this.isLoading.set(false);
                this.snackBar.open('Failed to update category. Please try again.', 'Close', { duration: 5000 });
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching category details:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to fetch category details. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  deleteCategory(categoryItem: CategoryTableItem) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${categoryItem.name}"? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading.set(true);

        this.service.deleteCategory(categoryItem.id).subscribe({
          next: () => {
            this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.isLoading.set(false);
            this.snackBar.open('Failed to delete category. Please try again.', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}