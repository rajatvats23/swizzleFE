export interface NavItem {
    label: string;
    icon: string;
    route: string;
  }
  
  export interface NavigationConfig {
    items: NavItem[];
    appTitle: string;
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      backgroundColor?: string;
    };
  }
  
  export const navigationConfig: NavigationConfig = {
    appTitle: 'Dashboard',
    items: [
      { 
        label: 'Dashboard', 
        icon: 'dashboard', 
        route: '/dashboard',
      },
      { 
        label: 'Admins', 
        icon: 'shield_person', 
        route: '/admins',
      },
      { 
        label: 'Category', 
        icon: 'category', 
        route: '/category',
      },
      { 
        label: 'Settings', 
        icon: 'settings', 
        route: '/settings',
      },
      { 
        label: 'Notifications', 
        icon: 'notifications', 
        route: '/notifications',
      }
    ],
    theme: {
      primaryColor: '#1976d2',
      secondaryColor: '#424242',
      backgroundColor: 'whitesmoke'
    }
  };