import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../services/auth.service';
import { ComentarioDto } from '../../models/comentarioDto';
import { Result } from '../../models/result';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  name: string | null = null;
  userId: number | null = null;
  comentario: string = '';
  date: Date | null = null

  constructor(
    public authService: AuthService,
    private router: Router,
    private comentarioService: ComentarioService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.name = user ? user.name : null;
    this.userId = user ? user.userId : null;

    this.mostrarComentarios();
  }

  authClick() {
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        title: "Has cerrado sesión con éxito",
        text: `¡Hasta pronto ${this.name}!`,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToProfile(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin-profile']);
    } else {
      this.router.navigate(['/user-profile']);
    }
  }

  comentarios: any[] = [];

mostrarComentarios(): void {
  this.comentarioService.mostrarComentarios().subscribe({
    next: (res) => {
      this.comentarios = res;
    },
    error: (err) => {
      console.error('Error al cargar los comentarios:', err);
    }
  });
}

  async publicarComentario(): Promise<void> {
    const comentarioData: ComentarioDto = {
      text: this.comentario,
      userId: this.userId!,
      userName: this.name!,
      date: this.date!
    };

    try {
      await this.comentarioService.publicarComentario(comentarioData).toPromise();
      console.log('Comentario publicado');
      this.comentario = '';
    } catch (error) {
      console.error('Error al publicar el comentario', error);
    }
  }

}
