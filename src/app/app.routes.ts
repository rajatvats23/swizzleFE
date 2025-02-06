import { Routes } from '@angular/router';
import { navigationConfig } from './config/navigation.config';

export const routes: Routes = [
  {
    path: '',
    redirectTo: navigationConfig.items[0].route.substring(1),
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admins',
    loadComponent: () => import('./features/admins/admins.component').then(m => m.AdminsComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./features/category/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'addons',
    loadComponent: () => import('./features/addons/addons.component').then(m => m.AddonsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'fleet-management',
    loadComponent: () => import('./features/fleet-management/fleet-management.component').then(m => m.FleetManagementComponent)
  },
  {
    path: 'promocodes',
    loadComponent: () => import('./features/promocodes/promocodes.component').then(m => m.PromocodesComponent)
  },
  {
    path: 'order-tracking',
    loadComponent: () => import('./features/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
  }
];