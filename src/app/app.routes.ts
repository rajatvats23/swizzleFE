import { Routes } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { AnalyticsComponent } from './pages/analytics/analytics.component';
// import { ProfileComponent } from './pages/profile/profile.component';
// import { SettingsComponent } from './pages/settings/settings.component';
// import { NotificationsComponent } from './pages/notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'analytics', component: AnalyticsComponent },
//   { path: 'profile', component: ProfileComponent },
//   { path: 'settings', component: SettingsComponent },
//   { path: 'notifications', component: NotificationsComponent }
];