// // src/app/features/addons/addon-list/addon-list.component.ts
// import { CommonModule } from "@angular/common";
// import { Component, inject, OnInit, signal, computed } from "@angular/core";
// import { Router } from "@angular/router";
// import { FormsModule } from "@angular/forms";
// import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
// import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
// import { MatCardModule } from "@angular/material/card";
// import { MatButtonModule } from "@angular/material/button";
// import { MatIconModule } from "@angular/material/icon";
// import { MatInputModule } from "@angular/material/input";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatDialog } from "@angular/material/dialog";
// import { MatSnackBar } from "@angular/material/snack-bar";
// import { MatDialogModule } from "@angular/material/dialog";
// import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { Sort } from "@angular/material/sort";
// import { PageEvent } from "@angular/material/paginator";

// import { 
//   TableComponent, 
//   PaginationConfig, 
//   SortConfig 
// } from "../../../shared/generics/table/table.component";
// import { AddonService } from "../../../services/addon.service";
// import { AddOn } from "../../../shared/interfaces/product.interface";
// import { ConfirmDialogComponent, ConfirmDialogData } from "../../../shared/generics/confirm-dialog.component";

// interface AddonTableItem {
//   id: string;
//   name: string;
//   price: string;
//   description: string;
//   isActive: string;
//   actions: string;
// }

// @Component({
//   selector: "app-addon-list",
//   standalone: true,
//   imports: [
//     CommonModule,
//     TableComponent,
//     MatCardModule,
//     MatButtonModule,
//     MatIconModule,
//     MatInputModule,
//     MatFormFieldModule,
//     FormsModule,
//     MatProgressBarModule,
//     MatDialogModule,
//   ],
//   template: `
//     <mat-card class="addon-card">
//       <mat-card-header>
//         <mat-card-title>Add-ons</mat-card-title>
//         <div class="spacer"></div>

//         <mat-form-field appearance="outline" class="search-field">
//           <mat-label>Search</mat-label>
//           <input matInput [(ngModel)]="searchTerm" (input)="onSearchInput()" />
//           <mat-icon matPrefix>search</mat-icon>
//           @if (searchTerm) {
//           <button
//             matSuffix
//             mat-icon-button
//             aria-label="Clear"
//             (click)="clearSearch()"
//           >
//             <mat-icon>close</mat-icon>
//           </button>
//           }
//         </mat-form-field>

//         <button mat-raised-button class="add" (click)="addAddon()">
//           <mat-icon>add</mat-icon> Add Add-on
//         </button>
//       </mat-card-header>
//       <mat-card-content>
//         <!-- Loading Progress Bar -->
//         @if (isLoading()) {
//         <mat-progress-bar
//           mode="buffer"
//           [value]="0"
//           [bufferValue]="0"
//           class="custom-progress-bar"
//         >
//         </mat-progress-bar>
//         } @else if (formattedAddons().length > 0) {
//         <app-table
//           [dataSource]="formattedAddons()"
//           [displayedColumns]="displayColumns"
//           [(pagination)]="paginationConfig"
//           [(sorting)]="sortingConfig"
//           [isLoading]="isLoading()"
//           (edit)="editAddon($event)"
//           (delete)="deleteAddon($event)"
//           (sort)="onSortChange($event)"
//           (page)="onPageChange($event)"
//         >
//         </app-table>
//         } @else {
//         <div class="empty-state">
//           <mat-icon>add_circle</mat-icon>
//           <p>No add-ons found. Add your first add-on to get started.</p>
//         </div>
//         }
//       </mat-card-content>
//     </mat-card>
//   `,
//   styles: [
//     `
//       .addon-card {
//         background-color: #f9f9f9;
//         width: 100%;
//         overflow: hidden;
//         box-sizing: border-box;
//       }

//       mat-card-content {
//         overflow: hidden;
//       }

//       .add {
//         background-color: #009c4c;
//         color: white;
//       }

//       .spacer {
//         flex: 1 1 auto;
//       }

//       mat-card-header {
//         display: flex;
//         align-items: center;
//         margin-bottom: 16px;
//         padding: 16px 16px 0 16px;
//         flex-wrap: wrap;
//       }

//       .search-field {
//         margin-right: 16px;
//         width: 200px;
//       }

//       .empty-state {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;
//         padding: 2rem;
//         color: rgba(0, 0, 0, 0.54);
//       }

//       .empty-state mat-icon {
//         font-size: 48px;
//         width: 48px;
//         height: 48px;
//         margin-bottom: 1rem;
//       }

//       /* Responsive styles */
//       @media (max-width: 768px) {
//         mat-card-header {
//           flex-direction: column;
//           align-items: stretch;
//         }

//         .search-field {
//           width: 100%;
//           margin-right: 0;
//           margin-bottom: 16px;
//         }

//         .add {
//           align-self: flex-end;
//         }
//       }
//     `,
//   ],
// })
// export class AddonListComponent implements OnInit {
//   // Dependency injection
//   private addonService = inject(AddonService);
//   private dialog = inject(MatDialog);
//   private snackBar = inject(MatSnackBar);
//   private router = inject(Router);

//   // State signals
//   private rawAddons = signal<AddOn[]>([]);
//   isLoading = signal<boolean>(true);
//   displayColumns: string[] = [
//     "name",
//     "price",
//     "description",
//     "isActive",
//     "actions",
//   ];
//   searchTerm = "";
//   filteredAddons = signal<AddOn[]>([]);

//   // Search subject for debouncing
//   private searchSubject = new Subject<string>();

//   // Pagination configuration
//   paginationConfig: PaginationConfig = {
//     pageIndex: 0,
//     pageSize: 10,
//     totalItems: 0,
//   };

//   // Sorting configuration
//   sortingConfig: SortConfig = {
//     active: "name",
//     direction: "asc",
//   };

//   // Formatted addons signal
//   formattedAddons = computed<AddonTableItem[]>(() => {
//     // Apply pagination manually since the API doesn't support it for addons
//     const start = this.paginationConfig.pageIndex * this.paginationConfig.pageSize;
//     const end = start + this.paginationConfig.pageSize;
//     const paginatedAddons = this.filteredAddons().slice(start, end);
    
//     return paginatedAddons.map((item) => ({
//       id: item._id,
//       name: item.name,
//       price: `$${item.price.toFixed(2)}`,
//       description: item.description || '',
//       isActive: item.isActive ? 'Active' : 'Inactive',
//       actions: item._id,
//     }));
//   });

//   constructor() {
//     // Set up search debounce
//     this.searchSubject
//       .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
//       .subscribe(() => {
//         this.filterAddons();
//       });
//   }

//   ngOnInit(): void {
//     this.loadAddons();
//   }

//   loadAddons() {
//     this.isLoading.set(true);

//     this.addonService.getAddons().subscribe({
//       next: (addons) => {
//         this.rawAddons.set(addons);
//         this.filterAddons();
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         console.error("Error loading add-ons:", err);
//         this.isLoading.set(false);
//         this.snackBar.open("Failed to load add-ons. Please try again.", "Close", {
//           duration: 5000,
//         });
//       },
//     });
//   }

//   filterAddons() {
//     let filtered = this.rawAddons();
    
//     // Apply search filter
//     if (this.searchTerm) {
//       const search = this.searchTerm.toLowerCase();
//       filtered = filtered.filter(addon => 
//         addon.name.toLowerCase().includes(search) || 
//         (addon.description && addon.description.toLowerCase().includes(search))
//       );
//     }
    
//     // Apply sorting manually
//     if (this.sortingConfig.active && this.sortingConfig.direction) {
//       const direction = this.sortingConfig.direction === 'asc' ? 1 : -1;
//       const key = this.sortingConfig.active as keyof AddOn;
      
//       filtered = [...filtered].sort((a, b) => {
//         let valueA = a[key];
//         let valueB = b[key];
        
//         if (typeof valueA === 'string' && typeof valueB === 'string') {
//           return direction * valueA.localeCompare(valueB);
//         }
        
//         if (valueA === undefined) return 1 * direction;
//         if (valueB === undefined) return -1 * direction;
//         if (valueA < valueB) return -1 * direction;
//         if (valueA > valueB) return 1 * direction;
//         return 0;
//       });
//     }
    
//     // Update pagination total
//     this.paginationConfig.totalItems = filtered.length;
//     // Reset to first page if no results found
//     if (filtered.length === 0) {
//       this.paginationConfig.pageIndex = 0;
//     }
    
//     this.filteredAddons.set(filtered);
//   }

//   onSearchInput(): void {
//     this.searchSubject.next(this.searchTerm);
//   }

//   clearSearch(): void {
//     this.searchTerm = "";
//     this.searchSubject.next("");
//   }

//   onSortChange(event: Sort): void {
//     this.filterAddons();
//   }

//   onPageChange(event: PageEvent): void {
//     // No need to do anything, the paginationConfig is updated by the table component
//   }

//   addAddon() {
//     this.router.navigate(['/addons/create']);
//   }

//   editAddon(addonItem: AddonTableItem) {
//     this.router.navigate(['/addons/edit', addonItem.id]);
//   }

//   deleteAddon(addonItem: AddonTableItem) {
//     const dialogData: ConfirmDialogData = {
//       title: 'Delete Add-on',
//       message: `Are you sure you want to delete the add-on "${addonItem.name}"? This action cannot be undone. Note that add-ons used by products cannot be deleted.`,
//       confirmButtonText: 'Delete',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: 'warn'
//     };

//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       width: '400px',
//       data: dialogData
//     });

//     dialogRef.afterClosed().subscribe(confirmed => {
//       if (confirmed) {
//         this.isLoading.set(true);

//         this.addonService.deleteAddon(addonItem.id).subscribe({
//           next: () => {
//             this.snackBar.open('Add-on deleted successfully', 'Close', { duration: 3000 });
//             this.loadAddons();
//           },
//           error: (error) => {
//             console.error('Error deleting add-on:', error);
//             this.isLoading.set(false);
//             this.snackBar.open('Failed to delete add-on. It might be in use by one or more products.', 'Close', { duration: 5000 });
//           }
//         });
//       }
//     });
//   }
// }