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
import { PageEvent } from "@angular/material/paginator";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface Category {
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

  // State signals
  private rawCategories = signal<any[]>([]);
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
  formattedCategories = computed(() => {
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
        this.rawCategories.set(response.data);
        this.paginationConfig.totalItems = response.pagination.total;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading categories:", err);
        this.isLoading.set(false);
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
    
  }

  editCategory(category: Category) {
    console.log("Edit category:", category);
    // Navigate or open dialog with category data
  }

  deleteCategory(category: Category) {
    console.log("Delete category:", category);

    this.service.deleteCategory(category.id).subscribe({
      next: () => {
        // Reload the current page to refresh data
        this.loadCategories();
      },
      error: (err) => {
        console.error("Error deleting category:", err);
      },
    });
  }
}
