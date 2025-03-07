// src/app/shared/interfaces/table.interface.ts

export interface TableColumn<T> {
    name: string;
    header: string;
    cell: (element: T) => string | any; // Allow for custom cell rendering
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  }
  
  export interface TableAction<T> {
    icon: string;
    tooltip: string;
    color?: string;
    action: (item: T) => void;
    isVisible?: (item: T) => boolean;
  }
  
  export interface FilterOption {
    value: string;
    label: string;
  }
  
  export interface FilterConfig {
    name?: boolean;
    status?: FilterOption[];
    categories?: FilterOption[];
    priority?: FilterOption[];
    dateRange?: boolean;
    amountRange?: boolean;
  }
  
  export type ViewMode = 'grid' | 'table';