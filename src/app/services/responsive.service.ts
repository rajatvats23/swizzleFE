import { Injectable, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  // Device type signals
  isMobilePortrait = signal(false);
  isMobileLandScape = signal(false);
  isTablet = signal(false);
  isDesktop = signal(false);
  
  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.TabletPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.Web
      ])
      .subscribe(result => {
        // Reset all signals
        this.isMobilePortrait.set(false);
        this.isMobileLandScape.set(false);
        this.isTablet.set(false);
        this.isDesktop.set(false);
        
        // Set the appropriate signal based on current breakpoint match
        if (result.breakpoints[Breakpoints.HandsetPortrait]) {
          this.isMobilePortrait.set(true);
        } else if (result.breakpoints[Breakpoints.HandsetLandscape]) {
          this.isMobileLandScape.set(true);
        } else if (result.breakpoints[Breakpoints.TabletPortrait] || 
                  result.breakpoints[Breakpoints.TabletLandscape]) {
          this.isTablet.set(true);
        } else {
          this.isDesktop.set(true);
        }
      });
  }

  /**
   * Check if the current device is mobile (either portrait or landscape)
   */
  get isMobile(): boolean {
    return this.isMobilePortrait() || this.isMobileLandScape();
  }

  /**
   * Check if the current device is small (mobile or tablet)
   */
  get isSmallDevice(): boolean {
    return this.isMobilePortrait() || this.isMobileLandScape() || this.isTablet();
  }
}