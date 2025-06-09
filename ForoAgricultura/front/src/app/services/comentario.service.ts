import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComentarioDto } from '../models/comentarioDto';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'https://foroagricultura.runasp.net/api/Comentary';

  constructor(private http: HttpClient) {}

  publicarComentario(comentario: ComentarioDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/newComentary`, comentario);
  }

  mostrarComentarios(): Observable<any> {
  return this.http.get(`${this.apiUrl}/all`);
  }
}