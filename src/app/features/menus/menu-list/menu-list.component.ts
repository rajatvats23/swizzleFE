// src/app/features/menus/menu-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MenuService, Menu } from '../menu.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './menu-list.component.html',
  styles: [`
    .menu-container {
      width: 100%;
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .menu-table {
      width: 100%;
    }
  `]
})
export class MenuListComponent implements OnInit {
  private menuService = inject(MenuService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router)

  menus: Menu[] = [];
  displayedColumns: string[] = ['name', 'description', 'restaurant', 'actions'];
  isLoading = false;

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.isLoading = true;
    this.menuService.getMenus().subscribe({
      next: (response) => {
        this.menus = response.data.menus;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading menus:', error);
        this.snackBar.open(error.error?.message || 'Failed to load menus', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  isManager(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'manager';
  }

  canManageMenu(menu: Menu): boolean {
    const user = this.authService.getCurrentUser();
    // Manager can only manage menus of their own restaurant
    return user?.restaurantId === menu.restaurantId._id;
  }

  confirmDelete(menu: Menu): void {
    if (confirm(`Are you sure you want to delete "${menu.name}"?`)) {
      this.deleteMenu(menu._id);
    }
  }

  createMenu() {
    this.router.navigateByUrl('menus/create')
  }

  deleteMenu(id: string): void {
    this.menuService.deleteMenu(id).subscribe({
      next: () => {
        this.snackBar.open('Menu deleted successfully', 'Close', { duration: 3000 });
        this.loadMenus();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error deleting menu', 'Close', { duration: 5000 });
      }
    });
  }
}
