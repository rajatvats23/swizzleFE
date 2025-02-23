import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-auth-landing',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="auth-container min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
             [style.background-image]="'url(/assets/images/auth-bg.jpg)'">
            <div class="absolute inset-0 bg-black/50"></div>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            height: 100vh;
        }
        .auth-container {
            position: relative;
            min-height: 100vh;
        }
    `]
})
export class AuthLandingComponent {}
