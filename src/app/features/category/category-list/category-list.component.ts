import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { TableComponent } from "../../../shared/generics/table/table.component";
import { CategoryService } from "../../../services/category.service";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
}

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        TableComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
        <mat-card class="category-card">
            <mat-card-header>
                <mat-card-title>Categories</mat-card-title>
                <div class="spacer"></div>
                <button mat-raised-button class="add" (click)="addCategory()">
                    <mat-icon>add</mat-icon> Add Category
                </button>
            </mat-card-header>
            <mat-card-content>
                @if (isLoading()) {
                    <div class="loading-state">
                        <p>Loading categories...</p>
                    </div>
                } @else if (formattedCategories().length > 0) {
                    <app-table
                        [dataSource]="formattedCategories()"
                        [displayedColumns]="displayColumns"
                        (edit)="editCategory($event)"
                        (delete)="deleteCategory($event)">
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
    styles: [`
        .category-card {
            background-color: #f9f9f9;
            width: 100%;
            overflow: hidden; /* Prevent content from spilling outside */
            box-sizing: border-box;
        }
        
        mat-card-content {
            // padding: 0; /* Remove default padding to allow table to use full width */
            overflow: hidden;
        }

        .add {
            background-color: #009C4C;
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
        }
        
        .empty-state, .loading-state {
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
        @media (max-width: 600px) {
            mat-card-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            mat-card-header button {
                margin-top: 16px;
                align-self: flex-end;
            }
        }
    `]
})
export class CategoryListComponent implements OnInit {
    // State signals
    private rawCategories = signal<any[]>([]);
    isLoading = signal<boolean>(true);
    displayColumns: string[] = ['name', 'description', 'createdAt', 'updatedAt', 'actions'];
    
    // Formatted categories signal
    formattedCategories = signal<Category[]>([]);
    
    // Dependency injection using inject function
    service = inject(CategoryService);

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories() {
        this.isLoading.set(true);
        this.service.getCategories().subscribe({
            next: (data: any[]) => {
                this.rawCategories.set(data);
                this.updateFormattedCategories();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading categories:', err);
                this.isLoading.set(false);
            }
        });     
    }
    
    updateFormattedCategories() {
        const formatted = this.rawCategories().map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            createdAt: new Date(item.createdAt).toLocaleString(),
            updatedAt: new Date(item.updatedAt).toLocaleString(),
            actions: item._id
        }));
        
        this.formattedCategories.set(formatted);
    }
    
    addCategory() {
        console.log('Add category');
        // Navigate or open dialog
    }
    
    editCategory(category: Category) {
        console.log('Edit category:', category);
        // Navigate or open dialog with category data
    }
    
    deleteCategory(category: Category) {
        console.log('Delete category:', category);
        
        // In a real app, you would call the service and then update the signal
        // this.service.deleteCategory(category.id).subscribe({
        //     next: () => {
        //         // Update signal by filtering out the deleted category
        //         this.rawCategories.update(cats => 
        //             cats.filter(c => c._id !== category.id)
        //         );
        //         this.updateFormattedCategories();
        //     }
        // });
    }
}