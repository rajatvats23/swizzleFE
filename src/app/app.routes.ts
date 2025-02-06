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
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admins',
    loadComponent: () => import('./pages/admins/admins.component').then(m => m.AdminsComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/category/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'addons',
    loadComponent: () => import('./pages/addons/addons.component').then(m => m.AddonsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'fleet-management',
    loadComponent: () => import('./pages/fleet-management/fleet-management.component').then(m => m.FleetManagementComponent)
  },
  {
    path: 'promocodes',
    loadComponent: () => import('./pages/promocodes/promocodes.component').then(m => m.PromocodesComponent)
  },
  {
    path: 'order-tracking',
    loadComponent: () => import('./pages/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
  }
];