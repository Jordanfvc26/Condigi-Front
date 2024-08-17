import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/components/login/login.component';
import { RegisterComponent } from './authentication/components/register/register.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { ListCompaniesComponent } from './user/components/my-companies/list-companies/list-companies.component';
import { CreateCompanyComponent } from './user/components/my-companies/create-company/create-company.component';
import { ListContractsComponent } from './user/components/contracts/list-contracts/list-contracts.component';
import { GenerateContractsIAComponent } from './user/components/contracts/generate-contracts-ia/generate-contracts-ia.component';


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
            { path: 'my-companies/list-companies', component: ListCompaniesComponent },
            { path: 'my-companies/new-company', component: CreateCompanyComponent },
            { path: 'contracts/list-contracts', component: ListContractsComponent },
            { path: 'contracts/create-contract', component: GenerateContractsIAComponent },
            { path: '', redirectTo: 'user', pathMatch: 'full' },
        ]
    },
];
