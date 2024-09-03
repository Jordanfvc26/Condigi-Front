import { Component } from '@angular/core';
import { DocusealFormComponent } from '@docuseal/angular';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';

@Component({
  selector: 'app-sign-contract',
  standalone: true,
  imports: [
    LoaderComponent,
    NavbarComponent,
    HeaderBackComponent,
    DocusealFormComponent
  ],
  templateUrl: './sign-contract.component.html',
  styleUrl: './sign-contract.component.css'
})
export class SignContractComponent {
  //Variables
  loaderStatus: boolean = false;
}
