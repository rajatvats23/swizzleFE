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
        loadComponent: () => import('./features/auth/auth.component')
          .then(m => m.LoginComponent),
        title: 'Login'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/auth.component')
          .then(m => m.ForgotPasswordComponent),
        title: 'Forgot Password'
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/auth.component')
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
        loadComponent: () => import('./features/category/category-list/category-list.component')
          .then(m => m.CategoryListComponent),
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
        children: [
          {
            path: '',
            loadComponent: () => import('./features/products/product-list/product-list.component')
              .then(m => m.ProductListComponent),
            title: 'Products'
          },
          {
            path: 'create',
            loadComponent: () => import('./features/products/product-details/product-form.component')
              .then(m => m.ProductFormComponent),
            title: 'Create Product'
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/products/product-details/product-form.component')
              .then(m => m.ProductFormComponent),
            title: 'Edit Product'
          }
        ]
      },
      // {
      //   path: 'addons',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./features/addons/addon-list/addon-list.component')
      //         .then(m => m.AddonListComponent),
      //       title: 'Add-ons'
      //     },
      //     {
      //       path: 'create',
      //       loadComponent: () => import('./features/addons/addon-form/addon-form.component')
      //         .then(m => m.AddonFormComponent),
      //       title: 'Create Add-on'
      //     },
      //     {
      //       path: 'edit/:id',
      //       loadComponent: () => import('./features/addons/addon-form/addon-form.component')
      //         .then(m => m.AddonFormComponent),
      //       title: 'Edit Add-on'
      //     }
      //   ]
      // },
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