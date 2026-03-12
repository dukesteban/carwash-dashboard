import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly KEY = 'auth_user';

  async sha256(text: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.KEY);
  }

  getUsuario(): string {
    return localStorage.getItem(this.KEY) || '';
  }

  login(usuario: string) {
    localStorage.setItem(this.KEY, usuario);
  }

  logout() {
    localStorage.removeItem(this.KEY);
  }
}
