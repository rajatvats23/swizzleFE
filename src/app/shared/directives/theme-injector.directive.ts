import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

/**
 * Directive to dynamically inject theme CSS variables onto an element
 * This allows for dynamic theming of components in Angular 19
 * 
 * Usage:
 * <div [appThemeInjector]="{
 *   primaryColor: '#673ab7',
 *   accentColor: '#2196f3',
 *   elevation: 3
 * }">Themed content</div>
 */
@Directive({
  selector: '[appThemeInjector]',
  standalone: true
})
export class ThemeInjectorDirective implements OnInit, OnChanges {
  @Input() appThemeInjector: {
    primaryColor?: string;
    primaryColorLight?: string;
    primaryColorDark?: string;
    accentColor?: string;
    accentColorLight?: string;
    accentColorDark?: string;
    elevation?: number;
    borderRadius?: number | string;
    [key: string]: any;
  } = {};

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.updateThemeVariables();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appThemeInjector']) {
      this.updateThemeVariables();
    }
  }

  private updateThemeVariables(): void {
    const theme = this.appThemeInjector;
    const element = this.el.nativeElement;

    // Clear previous variables
    const style = element.style;
    
    // Apply new variables if provided
    if (theme.primaryColor) {
      style.setProperty('--primary-color', theme.primaryColor);
      style.setProperty('--primary-color-rgb', this.hexToRgb(theme.primaryColor));
    }
    
    if (theme.primaryColorLight) {
      style.setProperty('--primary-color-light', theme.primaryColorLight);
    }
    
    if (theme.primaryColorDark) {
      style.setProperty('--primary-color-dark', theme.primaryColorDark);
    }
    
    if (theme.accentColor) {
      style.setProperty('--accent-color', theme.accentColor);
      style.setProperty('--accent-color-rgb', this.hexToRgb(theme.accentColor));
    }
    
    if (theme.accentColorLight) {
      style.setProperty('--accent-color-light', theme.accentColorLight);
    }
    
    if (theme.accentColorDark) {
      style.setProperty('--accent-color-dark', theme.accentColorDark);
    }
    
    if (theme.elevation !== undefined) {
      style.setProperty('--elevation', `${theme.elevation}px`);
    }
    
    if (theme.borderRadius !== undefined) {
      const value = typeof theme.borderRadius === 'number' 
        ? `${theme.borderRadius}px` 
        : theme.borderRadius;
      style.setProperty('--border-radius', value);
    }
    
    // Apply any other custom variables
    Object.entries(theme).forEach(([key, value]) => {
      if (!['primaryColor', 'primaryColorLight', 'primaryColorDark', 
            'accentColor', 'accentColorLight', 'accentColorDark',
            'elevation', 'borderRadius'].includes(key)) {
        style.setProperty(`--${this.camelToKebab(key)}`, value);
      }
    });
  }
  
  /**
   * Convert hex color to RGB format
   */
  private hexToRgb(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert shorthand hex to full form
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }
  
  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}