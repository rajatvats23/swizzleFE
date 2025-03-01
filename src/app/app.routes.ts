import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, nonAuthGuard } from './guard/auth.guard';
import { AuthLandingComponent } from './features/auth/auth-landing.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLandingComponent,
    canActivate: [nonAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component')
          .then(m => m.LoginComponent),
        title: 'Login'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password.component')
          .then(m => m.ForgotPasswordComponent),
        title: 'Forgot Password'
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password.component')
          .then(m => m.ResetPasswordComponent),
        title: 'Reset Password'
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard'
      },
      // Other routes remain the same
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
    redirectTo: 'auth/login'
  }
];