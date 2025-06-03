import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { Result } from '../models/result';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'jwtToken';

  constructor(private api: ApiService) {
    const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.api.jwt = token;
    }
  }

  async signup(formData: any): Promise<Result<any>> { // Registro
    return this.api.post<any>('Auth/Signup', formData);
  }

  async login(authData: AuthRequest, rememberMe: boolean): Promise<Result<AuthResponse>> { // Iniciar sesión
    const result = await this.api.post<AuthResponse>('Auth/login', authData);

    if (result.success && result.data) { // Verificar que result.data no es null
      const { accessToken, user } = result.data; // guardo info de la respuesta AuthResponse
      this.api.jwt = accessToken;

      if (rememberMe) { // Si se pulsó el botón recuérdame
        // En el localStorage guardo el token y el usuario (UserDto)
        localStorage.setItem(this.TOKEN_KEY, accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, accessToken);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    }

    return result;
  }

  // Comprobar si el usuario está logeado
  isAuthenticated(): boolean { 
    const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    return !!token; // Devuelve true si hay token, de lo contrario false
  }

  logout(): void { // Cerrar sesión
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null; // Devuelve el usuario o null si no se encuentra
  }

  // Comprobación de permisos de administrador
  isAdmin(): boolean {
    const user = this.getUser();
    
    if (user && user.role === 'Admin') { // Asegurarse de que user no es null
      console.log("Tu rol es: Admin");
      return true;
    } else {
      console.log("No eres administrador");
      return false;
    }
  }
}
