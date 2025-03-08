// src/app/features/products/product-list/product-list.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";

import { 
  TableComponent, 
  PaginationConfig, 
  SortConfig 
} from "../../../shared/generics/table/table.component";
import { 
  ProductService, 
  ProductQueryParams, 
  ProductResponse 
} from "../../../services/product.service";
import { CategoryService } from "../../../services/category.service";
import { Product } from "../../../shared/interfaces/product.interface";
import { Category } from "../../../shared/interfaces/category.interface";
import { ConfirmDialogComponent, ConfirmDialogData } from "../../../shared/generics/confirm-dialog.component";

interface ProductTableItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  vegetarian: string;
  vegan: string;
  glutenFree: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
}

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  template: `
    <mat-card class="product-card">
      <mat-card-header>
        <mat-card-title>Products</mat-card-title>
        <div class="spacer"></div>

        <div class="filters">
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

          <mat-form-field appearance="outline" class="category-filter">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="selectedCategory" (selectionChange)="onCategoryChange()">
              <mat-option [value]="''">All Categories</mat-option>
              @for (category of categories(); track category._id) {
                <mat-option [value]="category._id">{{ category.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="dietary-filter">
            <mat-label>Dietary Options</mat-label>
            <mat-select [(ngModel)]="selectedDietary" (selectionChange)="onDietaryChange()">
              <mat-option [value]="''">All Options</mat-option>
              <mat-option value="vegetarian">Vegetarian</mat-option>
              <mat-option value="vegan">Vegan</mat-option>
              <mat-option value="glutenFree">Gluten Free</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <button mat-raised-button class="add" (click)="addProduct()">
          <mat-icon>add</mat-icon> Add Product
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
        } @else if (formattedProducts().length > 0) {
        <app-table
          [dataSource]="formattedProducts()"
          [displayedColumns]="displayColumns"
          [(pagination)]="paginationConfig"
          [(sorting)]="sortingConfig"
          [isLoading]="isLoading()"
          (edit)="editProduct($event)"
          (delete)="deleteProduct($event)"
          (sort)="onSortChange($event)"
          (page)="onPageChange($event)"
        >
        </app-table>
        } @else {
        <div class="empty-state">
          <mat-icon>inventory_2</mat-icon>
          <p>No products found. Add your first product to get started.</p>
        </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .product-card {
        background-color: #f9f9f9;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
      }

      mat-card-content {
        overflow: hidden;
      }

      .add {
        background-color: #009c4c !important;
        color: white !important;
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

      .filters {
        display: flex;
        gap: 16px;
        margin-right: 16px;
      }

      .search-field {
        width: 200px;
      }

      .category-filter, .dietary-filter {
        width: 180px;
      }

      .empty-state {
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

        .filters {
          flex-direction: column;
          width: 100%;
          margin-right: 0;
          margin-bottom: 16px;
          gap: 8px;
        }

        .search-field,
        .category-filter,
        .dietary-filter {
          width: 100%;
        }

        .add {
          align-self: flex-end;
        }
      }
    `,
  ],
})
export class ProductListComponent implements OnInit {
  // Dependency injection
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // State signals
  private rawProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  displayColumns: string[] = [
    "name",
    "description",
    "price",
    "category",
    "vegetarian",
    "vegan",
    "glutenFree",
    "isActive",
    "createdAt",
    "actions",
  ];
  searchTerm = "";
  selectedCategory = "";
  selectedDietary = "";

  // Search subject for debouncing
  private searchSubject = new Subject<string>();

  // Pagination configuration
  paginationConfig: PaginationConfig = {
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
  };

  // Sorting configuration
  sortingConfig: SortConfig = {
    active: "createdAt",
    direction: "desc",
  };

  // Formatted products signal
  formattedProducts = computed<ProductTableItem[]>(() => {
    return this.rawProducts().map((item) => {
      // Format category name
      let categoryName = 'None';
      if (item.categoryId) {
        if (typeof item.categoryId === 'string') {
          // Try to find category in categories list
          const foundCategory = this.categories().find(c => c._id === item.categoryId);
          categoryName = foundCategory ? foundCategory.name : 'Unknown';
        } else {
          categoryName = item.categoryId.name;
        }
      }

      // Get default price or calculate from variants
      let price: number = item.basePrice;
      if (item.variants && item.variants.length > 0) {
        const defaultVariant = item.variants.find(v => v.isDefault);
        if (defaultVariant) {
          price = defaultVariant.price;
        }
      }

      return {
        id: item._id,
        name: item.name,
        description: item.description,
        price: `$${price.toFixed(2)}`,
        category: categoryName,
        vegetarian: item.isVegetarian ? '✓' : '-',
        vegan: item.isVegan ? '✓' : '-',
        glutenFree: item.isGlutenFree ? '✓' : '-',
        isActive: item.isActive ? 'Active' : 'Inactive',
        createdAt: new Date(item.createdAt).toLocaleString(),
        updatedAt: new Date(item.updatedAt).toLocaleString(),
        actions: item._id,
      };
    });
  });

  constructor() {
    // Set up search debounce
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.paginationConfig.pageIndex = 0; // Reset to first page on search
        this.loadProducts();
      });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories({ limit: 100 }).subscribe({
      next: (response) => {
        this.categories.set(response.data as Category[]);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  }

  loadProducts() {
    this.isLoading.set(true);

    const params: ProductQueryParams = {
      page: this.paginationConfig.pageIndex + 1, // Backend uses 1-based indexing
      limit: this.paginationConfig.pageSize,
      sortBy: this.sortingConfig.active || "createdAt",
      sortDirection: this.sortingConfig.direction || "desc",
      search: this.searchTerm,
      categoryId: this.selectedCategory || undefined
    };

    // Add dietary filter if selected
    if (this.selectedDietary) {
      (params as any)[this.selectedDietary] = true;
    }

    this.productService.getProducts(params).subscribe({
      next: (response: ProductResponse) => {
        this.rawProducts.set(response.data);
        this.paginationConfig.totalItems = response.pagination.total;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading products:", err);
        this.isLoading.set(false);
        this.snackBar.open("Failed to load products. Please try again.", "Close", {
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

  onCategoryChange(): void {
    this.paginationConfig.pageIndex = 0; // Reset to first page on category change
    this.loadProducts();
  }

  onDietaryChange(): void {
    this.paginationConfig.pageIndex = 0; // Reset to first page on dietary change
    this.loadProducts();
  }

  onSortChange(event: Sort): void {
    // Already updated in the table component
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    // Already updated in the table component
    this.loadProducts();
  }

  addProduct() {
    this.router.navigate(['/products/create']);
  }

  editProduct(productItem: ProductTableItem) {
    this.router.navigate(['/products/edit', productItem.id]);
  }

  deleteProduct(productItem: ProductTableItem) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Product',
      message: `Are you sure you want to delete the product "${productItem.name}"? This action cannot be undone.`,
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

        this.productService.deleteProduct(productItem.id).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.isLoading.set(false);
            this.snackBar.open('Failed to delete product. Please try again.', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}