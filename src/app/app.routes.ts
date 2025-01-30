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
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/category/categories/categories.component').then(m => m.CategoriesComponent)
  },
//   {
//     path: 'settings',
//     loadComponent: () => import('./pages/category/settings.component').then(m => m.SettingsComponent)
//   },
//   {
//     path: 'notifications',
//     loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
//   }
];