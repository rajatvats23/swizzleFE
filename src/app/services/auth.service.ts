import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isAuthenticated = signal(false);

    get isAuthenticated(): boolean {
        return this._isAuthenticated();
    }

    login() {
        this._isAuthenticated.set(true);
    }

    logout() {
        this._isAuthenticated.set(false);
    }
}