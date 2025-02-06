// navigation.config.ts
export interface NavItem {
  label: string;
  icon: string;
  route: string;
  disabled?: boolean;
}

export interface NavigationConfig {
  items: NavItem[];
  appTitle: string;
}

export const navigationConfig: NavigationConfig = {
  appTitle: 'Dashboard',
  items: [
    { label: 'Category', icon: 'category', route: '/category' },
    { label: 'Product', icon: 'inventory_2', route: '/products' },
    { label: 'Add-ons', icon: 'add_circle', route: '/addons' },
    { label: 'Orders', icon: 'shopping_cart', route: '/orders' },
    // { label: 'Branches', icon: 'store', route: '/branches' },
    { label: 'Promocodes', icon: 'local_offer', route: '/promocodes' },
    { label: 'Fleet Management', icon: 'local_shipping', route: '/fleet-management' },
    { label: 'Order Tracking', icon: 'location_on', route: '/order-tracking' },
    { label: 'Customers', icon: 'people', route: '/customers' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ]
};