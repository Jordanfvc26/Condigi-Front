import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Validators } from 'ngx-editor';
import { AuthenticationService } from '../../../../../authentication/services/authentication.service';
import { ApiResponseGetGeographyI, InfoGeographyI } from '../../../../../authentication/interfaces/geography';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { ReceiverCompanyI } from '../../../../interfaces/companies';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-register-new-company',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderComponent
  ],
  templateUrl: './register-new-company.component.html',
  styleUrl: './register-new-company.component.css'
})
export class RegisterNewCompanyComponent {
  //Variables
  static infoCompany: ReceiverCompanyI = {} as ReceiverCompanyI;
  infoCompanyLocal: ReceiverCompanyI = {} as ReceiverCompanyI;
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
    public dialogRef: MatDialogRef<RegisterNewCompanyComponent>,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.getProvinces();
    this.createCompanyForm();
    this.infoCompanyLocal = RegisterNewCompanyComponent.infoCompany;    
    if(localStorage.getItem('parishID')){
      this.getCantons(Number(localStorage.getItem('provinceID')));
      this.getParishes(Number(localStorage.getItem('cantontID')));
    }
    this.fillInputsForm();
  }

  //Método que crea el formulario con la información de la empresa
  createCompanyForm() {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      province: ['', Validators.required],
      cantont: ['', Validators.required],
      parish: ['', Validators.required],
      ruc: ['', Validators.required],
    });
  }

  //Método que cierra el modal
  closeModal() {
    this.dialogRef.close();
  }

  //Método que cierra el modal y emite la información de la empresa registrada
  addCompany() {
    this.dialogRef.close(this.companyForm.value);
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
      }
    });
  }

  //Método que obtiene el valor de la provincia seleccionada
  getOptionProvinceSelected(e: any) {
    this.optionProvinceSelected = e.target.value;
    localStorage.setItem('provinceID', e.target.value);
    this.getCantons(e.target.value);
  }

  //Método que obtiene el valor de la provincia seleccionada
  getOptionCantontSelected(e: any) {
    this.optionCantonSelected = e.target.value;
    localStorage.setItem('cantontID', e.target.value);
    this.getParishes(e.target.value);
  }

  //Método que obtiene el valor de la provincia seleccionada
  getOptionParishSelected(e: any) {
    this.optionParishSelected = e.target.value;
    localStorage.setItem('parishID', e.target.value);
  }

  //Método que rellena los inputs del formulario con la información de una empres que ya se registró
  fillInputsForm() {
    this.companyForm.controls['name'].setValue(this.infoCompanyLocal.name);
    this.companyForm.controls['email'].setValue(this.infoCompanyLocal.email);
    this.companyForm.controls['address'].setValue(this.infoCompanyLocal.address);
    this.companyForm.controls['phone'].setValue(this.infoCompanyLocal.phone);
    this.companyForm.controls['ruc'].setValue(this.infoCompanyLocal.ruc);
    this.optionProvinceSelected = localStorage.getItem('provinceID') || "";
    this.optionCantonSelected = localStorage.getItem('cantontID') || "";
    this.optionParishSelected = localStorage.getItem('parishID') || "";
  }

  //Icons to use
  iconCompany = iconos.faBuilding;
  iconClose = iconos.faXmark;
}
