import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { ApiResponseGetGeographyI, InfoGeographyI } from '../../interfaces/geography';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ApiResponseRegisterUserI, BodyRegisterUserI } from '../../interfaces/authentication';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCarouselModule,
    MatStepperModule,
    FontAwesomeModule,
    LoaderComponent
  ],
  providers: [
    AuthenticationService
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', './../login/login.component.css']
})
export class RegisterComponent {
  //Variables
  @ViewChild('stepper') stepper!: MatStepper;
  loaderStatus: boolean = false;
  basicInfoForm!: FormGroup;
  contactForm!: FormGroup;
  credentialsForm!: FormGroup;
  showPassword: boolean = false;
  arrayImages: string[] = ["../../../../assets/images/IMG_Contract.svg", "../../../../assets/images/IMG_Send_mail.svg", "../../../../assets/images/IMG_Security.svg", "../../../../assets/images/IMG_Organize.svg", "../../../../assets/images/IMG_All_devices.svg"];
  messages: string[] = ["Genera contratos con IA", "Envía tus contratos por email", "Encripta tus contratos", "Gestiona y organiza", "Accede desde cualquier dispositivo"];

  optionProvinceSelected: string = "";
  optionCantonSelected: string = "";
  optionParishSelected: string = "";

  arrayProvinces: InfoGeographyI[] = [];
  arrayCantons: InfoGeographyI[] = [];
  arrayParishes: InfoGeographyI[] = [];

  //constructor
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.createBasicInfoForm();
    this.createContactForm();
    this.createCredentialsForm();
    this.getProvinces();
  }

  //Método que crea el formulario del información básica
  createBasicInfoForm() {
    this.basicInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identification: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  //Método que crea el formulario de direcciones y contacto
  createContactForm() {
    this.contactForm = this.formBuilder.group({
      province: ['', Validators.required],
      cantont: ['', Validators.required],
      parish: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  //Método que crea el formulario de credenciales
  createCredentialsForm() {
    this.credentialsForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  //Método para obtener el tipo de entrada de contraseña según la visibilidad
  getPasswordInputType() {
    return this.showPassword ? 'text' : 'password';
  }

  //Método que verifica el ícono del password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  //Método que redirige al formulario de Login
  goToLogin() {
    this.router.navigateByUrl(`/authentication/login`);
  }

  //Método que para avanzar al siguiente paso del stepper
  nextStep() {
    this.stepper.next();
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


  //Método que arma el body para registrar al usuario
  fillBodyToRegisterUser() {
    let body: BodyRegisterUserI = {
      person: {
        firstName: this.basicInfoForm.get('firstName')?.value,
        lastName: this.basicInfoForm.get('lastName')?.value,
        identification: this.basicInfoForm.get('identification')?.value,
        phone: this.basicInfoForm.get('phone')?.value,
        parishId: Number(this.optionParishSelected),
        address: this.contactForm.get('address')?.value,
      },
      user: {
        username: this.credentialsForm.get('username')?.value,
        email: this.credentialsForm.get('email')?.value,
        password: this.credentialsForm.get('password')?.value,
        userType: 0
      }
    };
    return body
  }

  //Método que registra al usuario
  registerUser() {
    this.loaderStatus = true;
    this.authenticationService.registerUser(this.fillBodyToRegisterUser()).subscribe({
      next: (data: ApiResponseRegisterUserI) => {
        this.loaderStatus = false;
        if(data.statusCode === 201)
          this.router.navigateByUrl(`/authentication/login`);
        else
          alert("Error al registrar el usuario");
      },
      error: (error) => {
        this.loaderStatus = false;
        alert("Error al registrar el usuario 2");
      }
    })
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
  iconNext = iconos.faArrowRight;
}
