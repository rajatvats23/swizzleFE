import { Routes } from '@angular/router';
import { navigationConfig } from './config/navigation.config';
import { authGuard, nonAuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivateChild: [nonAuthGuard], // Changed from canActivate to canActivateChild
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password.component')
          .then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password.component')
          .then(m => m.ResetPasswordComponent)
      }
    ]
  },
  {
    path: '',
    canActivateChild: [authGuard], // Changed from canActivate to canActivateChild
    children: [
      {
        path: '',
        redirectTo: navigationConfig.items[0].route.substring(1),
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard' // Added titles for better debugging
      },
      {
        path: 'admins',
        loadComponent: () => import('./features/admins/admins.component')
          .then(m => m.AdminsComponent),
        title: 'Admins'
      },
      {
        path: 'category',
        loadComponent: () => import('./features/category/categories/categories.component')
          .then(m => m.CategoriesComponent),
        title: 'Categories'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component')
          .then(m => m.SettingsComponent),
        title: 'Settings'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component')
          .then(m => m.ProductsComponent),
        title: 'Products'
      },
      {
        path: 'addons',
        loadComponent: () => import('./features/addons/addons.component')
          .then(m => m.AddonsComponent),
        title: 'Addons'
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders.component')
          .then(m => m.OrdersComponent),
        title: 'Orders'
      },
      {
        path: 'fleet-management',
        loadComponent: () => import('./features/fleet-management/fleet-management.component')
          .then(m => m.FleetManagementComponent),
        title: 'Fleet Management'
      },
      {
        path: 'promocodes',
        loadComponent: () => import('./features/promocodes/promocodes.component')
          .then(m => m.PromocodesComponent),
        title: 'Promocodes'
      },
      {
        path: 'order-tracking',
        loadComponent: () => import('./features/order-tracking/order-tracking.component')
          .then(m => m.OrderTrackingComponent),
        title: 'Order Tracking'
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customers.component')
          .then(m => m.CustomersComponent),
        title: 'Customers'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login' // Made the redirect more specific
  }
];