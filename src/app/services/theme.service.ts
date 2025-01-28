import { Injectable } from '@angular/core';
import { navigationConfig } from '../config/navigation.config';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);
    return style;
  }

  applyTheme() {
    const style = this.createStyleElement();
    const theme = navigationConfig.theme;

    if (!theme) return;

    const css = `
      :root {
        --primary-color: ${theme.primaryColor};
        --secondary-color: ${theme.secondaryColor};
        --background-color: ${theme.backgroundColor};
      }
    `;

    style.innerHTML = css;
  }
}