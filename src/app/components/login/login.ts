import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  usuario = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private auth: AuthService,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async login() {
    if (!this.usuario.trim() || !this.password.trim()) {
      this.error = 'Completá usuario y contraseña.';
      return;
    }

    this.cargando = true;
    this.error = '';

    try {
      const hash = await this.auth.sha256(this.password);
      const ok = await this.supabase.verificarUsuario(this.usuario.trim(), hash);
      if (ok) {
        this.auth.login(this.usuario.trim());
        this.router.navigate(['/']);
      } else {
        this.error = 'Usuario o contraseña incorrectos.';
      }
    } catch (e) {
      this.error = 'Error al iniciar sesión. Intentá de nuevo.';
    }

    this.cargando = false;
  }
}
