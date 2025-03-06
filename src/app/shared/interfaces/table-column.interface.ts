/**
 * Interface defining the structure of a table column for the GenericTableComponent
 * This provides strong typing for the columns configuration
 */
export interface TableColumn {
    /**
     * The property name in the data object that this column will display
     * Can use dot notation for nested properties (e.g., 'user.name')
     */
    property: string;
    
    /**
     * The display name for the column header
     */
    name: string;
    
    /**
     * Whether this column can be sorted
     * @default false
     */
    sortable?: boolean;
    
    /**
     * The width of the column (e.g., '200px', '10%')
     * @default 'auto'
     */
    width?: string;
    
    /**
     * The data type of the column, used for formatting and filtering
     * @default 'text'
     */
    type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'chip' | 'custom';
    
    /**
     * Format string for displaying the value (used with pipes)
     * For dates: 'short', 'medium', 'long', 'shortDate', etc.
     * For numbers/currency: '1.0-2', etc.
     */
    format?: string;
    
    /**
     * Whether to use the custom cell template for this column
     * @default false
     */
    useCustomTemplate?: boolean;
    
    /**
     * CSS class(es) to apply to the column cells and header
     */
    columnClass?: string | string[];
    
    /**
     * For chip type columns, the color of the chips
     */
    chipColor?: 'primary' | 'accent' | 'warn' | string;
    
    /**
     * For chip type columns, a mapping of values to CSS classes
     * Example: { 'Active': 'status-active', 'Inactive': 'status-inactive' }
     */
    chipColorMap?: Record<string, string>;
    
    /**
     * Whether this column should be included in the default filter options
     * @default false
     */
    filterable?: boolean;
    
    /**
     * Whether this column should be visible by default
     * @default true
     */
    visible?: boolean;
    
    /**
     * Whether this column can be hidden/shown by the user
     * @default true
     */
    toggleable?: boolean;
    
    /**
     * Custom filter predicate function for this column
     * @param data The data item being filtered
     * @param filterValue The filter value to check against
     * @returns boolean indicating whether the item passes the filter
     */
    filterPredicate?: (data: any, filterValue: any) => boolean;
    
    /**
     * Whether the column should stick to the left or right side of the table
     */
    sticky?: 'left' | 'right' | null;
    
    /**
     * Custom cell rendering function - alternative to template approach
     * Useful for simple formatting needs without using a custom template
     * @param value The cell value
     * @param row The entire data row
     * @returns The formatted value as a string
     */
    renderCell?: (value: any, row: any) => string;
    
    /**
     * Array of possible values for filter dropdowns 
     * (for enum/category-type columns)
     */
    filterOptions?: any[];
    
    /**
     * Whether the column should be exported when using export functionality
     * @default true
     */
    exportable?: boolean;
    
    /**
     * Custom key to be used when exporting this column
     */
    exportKey?: string;
    
    /**
     * Function to transform the data before export
     * @param value The cell value
     * @returns The formatted value for export
     */
    exportTransform?: (value: any) => any;
  }