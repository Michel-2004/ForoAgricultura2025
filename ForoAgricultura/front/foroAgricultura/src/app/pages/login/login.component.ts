import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  readonly PARAM_KEY: string = 'redirectTo';
  private redirectTo: string | null = null;

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  jwt: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirige a la página principal
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Obtiene la URL a la que el usuario quería acceder
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    if (queryParams.has(this.PARAM_KEY)) {
      this.redirectTo = queryParams.get(this.PARAM_KEY);
    }
  }

  async submit() {
    const authData = { email: this.email, password: this.password };
    const result = await this.authService.login(authData, this.rememberMe);

    if (result.success && result.data) {
      // Se obtiene el token de acceso y el nombre del usuario desde el resultado
      this.jwt = result.data.accessToken;
      const name = result.data.user.name;  // Suponiendo que 'user' contiene el nombre del usuario
      console.log('Inicio de sesión exitoso', result);

      // Si se ha marcado "recordarme", guarda el token en localStorage
      if (this.rememberMe) {
        localStorage.setItem('jwtToken', this.jwt);
      }

      // Muestra el cuadro de diálogo de éxito
      Swal.fire({
        title: "Inicio de sesión con éxito",
        text: `¡Hola, ${name}!`,  // Muestra el nombre del usuario en el saludo
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => this.redirect()  // Redirige al usuario después de 3 segundos
      });

    } else {
      // Si el login no fue exitoso, muestra un error
      Swal.fire({
        title: "Usuario o contraseña incorrectos",
        icon: "error",
        confirmButtonText: "Vale"
      });
    }
  }

  // Redirige al usuario a la URL guardada en 'redirectTo' o a la página principal
  redirect() {
    if (this.redirectTo != null) {
      this.router.navigateByUrl(this.redirectTo);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Redirige al usuario a la página de registro
  redirectToSignup() {
    this.router.navigate(['/signup'], { queryParams: { redirectTo: this.redirectTo } });
  }
}
