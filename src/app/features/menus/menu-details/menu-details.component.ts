import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';
import { MenuService } from '../menu.service';

interface CompleteMenu {
  menu: {
    _id: string;
    name: string;
    description?: string;
    restaurantId: any;
    createdBy: any;
    createdAt: string;
    updatedAt: string;
  };
  categories: Array<{
    _id: string;
    name: string;
    order: number;
    description?: string;
  }>;
  products: Array<{
    _id: string;
    name: string;
    price: number;
    description?: string;
    category: string;
    isAvailable: boolean;
    addons: Array<{ 
      addon: {
        _id: string;
        name: string;
        isMultiSelect: boolean;
        subAddons: Array<{ name: string; price: number }>;
      }; 
      required: boolean 
    }>;
  }>;
  addons: Array<{
    _id: string;
    name: string;
    isMultiSelect: boolean;
    subAddons: Array<{ name: string; price: number }>;
  }>;
}

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './menu-details.component.html',
  styleUrl: './menu-details.component.scss'
})
export class MenuDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private menuService = inject(MenuService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  menuData = signal<CompleteMenu | null>(null);
  isLoading = signal(true);
  menuId = '';

  ngOnInit(): void {
    this.menuId = this.route.snapshot.params['id'];
    if (this.menuId) {
      this.loadCompleteMenu();
    } else {
      this.router.navigate(['/dashboard/menus']);
    }
  }

  loadCompleteMenu(): void {
    this.isLoading.set(true);
    this.menuService.getCompleteMenuById(this.menuId).subscribe({
      next: (response) => {
        console.log('Complete menu data:', response.data); // For debugging
        this.menuData.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading complete menu:', error);
        this.snackBar.open(error.error?.message || 'Failed to load menu', 'Close', { duration: 5000 });
        this.isLoading.set(false);
        this.router.navigate(['/dashboard/menus']);
      }
    });
  }

  getSortedCategories() {
    return this.menuData()?.categories?.sort((a, b) => a.order - b.order) || [];
  }

  getProductsForCategory(categoryId: string) {
    return this.menuData()?.products?.filter(p => p.category === categoryId) || [];
  }

  getAddonName(addonRef: any): string {
    // addonRef.addon contains the full addon object from the API response
    return addonRef.addon?.name || 'Unknown Add-on';
  }

  getAveragePrice(): number {
    const products = this.menuData()?.products || [];
    if (products.length === 0) return 0;
    
    const total = products.reduce((sum, product) => sum + product.price, 0);
    return total / products.length;
  }

  getAvailableProductsCount(): number {
    const products = this.menuData()?.products || [];
    return products.filter(p => p.isAvailable).length;
  }

  getUnavailableProductsCount(): number {
    const products = this.menuData()?.products || [];
    return products.filter(p => !p.isAvailable).length;
  }

  canManageMenu(): boolean {
    const menuData = this.menuData();
    if (!menuData) return false;
    
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    
    // Only managers can manage menus
    if (user.role !== 'manager') return false;
    
    // Manager can only manage menus of their own restaurant
    return user.restaurantId === menuData.menu?.restaurantId._id;
  }

  confirmDelete(): void {
    const menuData = this.menuData();
    if (confirm(`Are you sure you want to delete "${menuData?.menu?.name}"?`)) {
      this.deleteMenu();
    }
  }

  deleteMenu(): void {
    this.menuService.deleteMenu(this.menuId).subscribe({
      next: () => {
        this.snackBar.open('Menu deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard/menus']);
      },
      error: (error) => {
        console.error('Error deleting menu:', error);
        this.snackBar.open(error.error?.message || 'Error deleting menu', 'Close', { duration: 5000 });
      }
    });
  }
}