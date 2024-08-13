import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/components/login/login.component';
import { RegisterComponent } from './authentication/components/register/register.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'authentication', pathMatch: 'full' },
    {
        path: 'authentication',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register-user', component: RegisterComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
        ]
    },
    {
        path: 'user',
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: '', redirectTo: 'user', pathMatch: 'full' },
        ]
    },
];
