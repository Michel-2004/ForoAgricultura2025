import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  userForm: FormGroup;

  user: any | null = null; //datos del usuario
  isEditing = false; //modo edición

  public readonly IMG_URL = environment.apiImg;

  constructor(private formBuild: FormBuilder, private authService: AuthService, 
    private router: Router, private apiService : ApiService) {
    // formulario cambio datos
    this.userForm = this.formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      password: ['']
    });
  }

 async ngOnInit() {
  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/']);
  }

  this.user = this.authService.getUser();

  if (this.user) {
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      address: this.user.address,
      password: ''
    });
  }
}

 edit() {
  this.isEditing = !this.isEditing;
  if (!this.isEditing && this.user) {
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      address: this.user.address,
      password: ''
    });
  }
}

  onSubmit(): void {
  if (this.userForm.valid && this.user) {
    const formData = {
      UserId: this.user.id,
      Name: this.userForm.value.name,
      Email: this.userForm.value.email,
      Address: this.userForm.value.address || '',  
      Password: this.userForm.value.password || '',
      Role: this.user.role || ''         
    };

    console.log('Enviando al backend:', formData);

    this.apiService.updateUser(formData).subscribe(
      () => {
        alert('Perfil actualizado correctamente.');
        this.isEditing = false;
      },
      (error) => {
        console.error('Error al actualizar el perfil.', error);
      }
    );
  }
}

}
