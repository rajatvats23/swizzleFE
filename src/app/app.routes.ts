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
//   {
//     path: 'profile',
//     loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
//   },
//   {
//     path: 'settings',
//     loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
//   },
//   {
//     path: 'notifications',
//     loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
//   }
];