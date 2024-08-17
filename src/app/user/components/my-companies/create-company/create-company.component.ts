import { ToastAlertsService } from './../../../../shared/services/toast-alert.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { NavbarComponent } from './../../../../shared/components/navbar/navbar.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponseGetGeographyI, InfoGeographyI } from '../../../../authentication/interfaces/geography';
import { AuthenticationService } from '../../../../authentication/services/authentication.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompaniesService } from '../../../services/companies.service';
import { ApiResponseCreateCompanyI, BodyCreateCompanyI } from '../../../interfaces/companies';

@Component({
  selector: 'app-create-company',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    LoaderComponent,
    HeaderBackComponent,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [
    AuthenticationService,
    CompaniesService
  ],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
})
export class CreateCompanyComponent {
  //Variables
  loaderStatus: boolean = false;
  companyForm!: FormGroup;
  optionProvinceSelected: string = "";
  optionCantonSelected: string = "";
  optionParishSelected: string = "";

  arrayProvinces: InfoGeographyI[] = [];
  arrayCantons: InfoGeographyI[] = [];
  arrayParishes: InfoGeographyI[] = [];

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private companiesService: CompaniesService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit
  ngOnInit(): void {
    this.createFormCompany();
    this.getProvinces();
  }

  //Método que crea el formulario para crear una empresa
  createFormCompany() {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      province: ['', Validators.required],
      cantont: ['', Validators.required],
      parish: ['', Validators.required],
      ruc: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  //Método que consume el servicio para obtener las provincias del Ecuador
  getProvinces() {
    this.loaderStatus = true;
    this.authenticationService.getProvinces().subscribe({
      next: (data: ApiResponseGetGeographyI) => {
        this.loaderStatus = false;
        this.arrayProvinces = data.data;
      },
      error: (error) => {
        this.loaderStatus = false;
        alert(error);
      }
    });
  }

  //Método que consume el servicio para obtener los cantones de una provincia
  getCantons(provinceID: number) {
    this.loaderStatus = true;
    this.authenticationService.getCantonts(provinceID).subscribe({
      next: (data: ApiResponseGetGeographyI) => {
        this.loaderStatus = false;
        this.arrayCantons = data.data;
      },
      error: (error) => {
        this.loaderStatus = false;
        alert(error);
      }
    });
  }

  //Método que consume el servicio para obtener las parroquias de un cantón
  getParishes(cantontID: number) {
    this.loaderStatus = true;
    this.authenticationService.getParishes(cantontID).subscribe({
      next: (data: ApiResponseGetGeographyI) => {
        this.loaderStatus = false;
        this.arrayParishes = data.data;
      },
      error: (error) => {
        this.loaderStatus = false;
        alert(error);
      }
    });
  }

  //Método que obtiene el valor de la provincia seleccionada
  getOptionProvinceSelected(e: any) {
    this.optionProvinceSelected = e.target.value;
    this.getCantons(e.target.value);
  }

  //Método que obtiene el valor de la provincia seleccionada
  getOptionCantontSelected(e: any) {
    this.optionCantonSelected = e.target.value;
    this.getParishes(e.target.value);
  }

  //Método que obtiene el valor de la provincia seleccionada
  getOptionParishSelected(e: any) {
    this.optionParishSelected = e.target.value;
  }

  //Método que arma el body para crear una compañía
  fillBodyCreateCompany(): BodyCreateCompanyI {
    let body: BodyCreateCompanyI = {
      name: this.companyForm.get('name')?.value,
      ruc: this.companyForm.get('ruc')?.value,
      address: this.companyForm.get('address')?.value,
      phone: this.companyForm.get('phone')?.value,
      email: this.companyForm.get('email')?.value,
      parishId: parseInt(this.optionParishSelected)
    }
    return body;
  }

  //Método que consume el servicio para registrar la empresa
  createCompany() {
    this.loaderStatus = true;
    this.companiesService.createCompany(this.fillBodyCreateCompany()).subscribe({
      next: (data: ApiResponseCreateCompanyI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200) {
          this.toastr.showToastSuccess("Empresa creada correctamente", "Éxito");
        }
      },
      error: (error) => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "Error al crear la empresa, intenta otra vez");
      }
    })
  }
}
