// src/app/features/addons/addon-list/addon-list.component.ts
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
  AddonService, 
  AddonQueryParams, 
  AddonResponse 
} from "../../../services/addon.service";
import { Addon } from "../../../shared/interfaces/addon.interface";
import { ConfirmDialogComponent, ConfirmDialogData } from "../../../shared/generics/confirm-dialog.component";

interface AddonTableItem {
  id: string;
  name: string;
  description: string;
  price: string;
  selectionType: string;
  addonType: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
}

@Component({
  selector: "app-addon-list",
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
    <mat-card class="addon-card">
      <mat-card-header>
        <mat-card-title>Add-ons</mat-card-title>
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

          <mat-form-field appearance="outline" class="addon-type-filter">
            <mat-label>Addon Type</mat-label>
            <mat-select [(ngModel)]="selectedAddonType" (selectionChange)="onAddonTypeChange()">
              <mat-option [value]="''">All Types</mat-option>
              <mat-option value="topping">Topping</mat-option>
              <mat-option value="sauce">Sauce</mat-option>
              <mat-option value="extra">Extra</mat-option>
              <mat-option value="option">Option</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="selection-type-filter">
            <mat-label>Selection Type</mat-label>
            <mat-select [(ngModel)]="selectedSelectionType" (selectionChange)="onSelectionTypeChange()">
              <mat-option [value]="''">All Selection Types</mat-option>
              <mat-option value="single">Single</mat-option>
              <mat-option value="multiple">Multiple</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <button mat-raised-button class="add" (click)="addAddon()">
          <mat-icon>add</mat-icon> Add Add-on
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
        } @else if (formattedAddons().length > 0) {
        <app-table
          [dataSource]="formattedAddons()"
          [displayedColumns]="displayColumns"
          [(pagination)]="paginationConfig"
          [(sorting)]="sortingConfig"
          [isLoading]="isLoading()"
          (edit)="editAddon($event)"
          (delete)="deleteAddon($event)"
          (sort)="onSortChange($event)"
          (page)="onPageChange($event)"
        >
        </app-table>
        } @else {
        <div class="empty-state">
          <mat-icon>add_circle_outline</mat-icon>
          <p>No add-ons found. Add your first add-on to get started.</p>
        </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .addon-card {
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

      .addon-type-filter, .selection-type-filter {
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
        .addon-type-filter,
        .selection-type-filter {
          width: 100%;
        }

        .add {
          align-self: flex-end;
        }
      }
    `,
  ],
})
export class AddonListComponent implements OnInit {
  // Dependency injection
  private addonService = inject(AddonService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // State signals
  private rawAddons = signal<Addon[]>([]);
  isLoading = signal<boolean>(true);
  displayColumns: string[] = [
    "name",
    "description",
    "price",
    "addonType",
    "selectionType",
    "isActive",
    "createdAt",
    "actions",
  ];
  searchTerm = "";
  selectedAddonType = "";
  selectedSelectionType = "";

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

  // Formatted addons signal
  formattedAddons = computed<AddonTableItem[]>(() => {
    return this.rawAddons().map((item) => {
      return {
        id: item._id,
        name: item.name,
        description: item.description,
        price: `$${item.price.toFixed(2)}`,
        selectionType: item.selectionType === 'single' ? 'Single' : 'Multiple',
        addonType: this.formatAddonType(item.addonType),
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
        this.loadAddons();
      });
  }

  ngOnInit(): void {
    this.loadAddons();
  }

  loadAddons() {
    this.isLoading.set(true);

    const params: AddonQueryParams = {
      page: this.paginationConfig.pageIndex + 1, // Backend uses 1-based indexing
      limit: this.paginationConfig.pageSize,
      sortBy: this.sortingConfig.active || "createdAt",
      sortDirection: this.sortingConfig.direction || "desc",
      search: this.searchTerm,
    };

    // Add addon type filter if selected
    if (this.selectedAddonType) {
      params.addonType = this.selectedAddonType as any;
    }

    // Add selection type filter if selected
    if (this.selectedSelectionType) {
      params.selectionType = this.selectedSelectionType as any;
    }

    this.addonService.getAddons(params).subscribe({
      next: (response: AddonResponse) => {
        this.rawAddons.set(response.data);
        this.paginationConfig.totalItems = response.pagination.total;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading addons:", err);
        this.isLoading.set(false);
        this.snackBar.open("Failed to load add-ons. Please try again.", "Close", {
          duration: 5000,
        });
      },
    });
  }

  formatAddonType(type: string): string {
    switch (type) {
      case 'topping':
        return 'Topping';
      case 'sauce':
        return 'Sauce';
      case 'extra':
        return 'Extra';
      case 'option':
        return 'Option';
      default:
        return type;
    }
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.searchSubject.next("");
  }

  onAddonTypeChange(): void {
    this.paginationConfig.pageIndex = 0; // Reset to first page on type change
    this.loadAddons();
  }

  onSelectionTypeChange(): void {
    this.paginationConfig.pageIndex = 0; // Reset to first page on selection type change
    this.loadAddons();
  }

  onSortChange(event: Sort): void {
    // Already updated in the table component
    this.loadAddons();
  }

  onPageChange(event: PageEvent): void {
    // Already updated in the table component
    this.loadAddons();
  }

  addAddon() {
    this.router.navigate(['/addons/create']);
  }

  editAddon(addonItem: AddonTableItem) {
    this.router.navigate(['/addons/edit', addonItem.id]);
  }

  deleteAddon(addonItem: AddonTableItem) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Add-on',
      message: `Are you sure you want to delete the add-on "${addonItem.name}"? This action cannot be undone.`,
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

        this.addonService.deleteAddon(addonItem.id).subscribe({
          next: () => {
            this.snackBar.open('Add-on deleted successfully', 'Close', { duration: 3000 });
            this.loadAddons();
          },
          error: (error) => {
            console.error('Error deleting add-on:', error);
            this.isLoading.set(false);
            this.snackBar.open('Failed to delete add-on. Please try again.', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}