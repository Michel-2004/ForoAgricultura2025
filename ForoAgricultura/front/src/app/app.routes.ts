import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Ruta pantalla inicio home
    { path: 'login', component: LoginComponent }, // Ruta login
    { path: 'signup', component: SignupComponent }, // Ruta registro
    { path: 'user-profile', component: UserProfileComponent }, // Ruta perfil usuario
    { path: 'admin-profile', component: AdminProfileComponent } // Ruta perfil admin
];
