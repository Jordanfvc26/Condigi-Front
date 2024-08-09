import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCarouselModule,
    MatStepperModule,
    FontAwesomeModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', './../login/login.component.css']
})
export class RegisterComponent {
  //Variables
  @ViewChild('stepper') stepper!: MatStepper;
  basicInfoForm!: FormGroup;
  contactForm!: FormGroup;
  credentialsForm!: FormGroup;
  showPassword: boolean = false;
  arrayImages: string[] = ["https://cdn-icons-png.flaticon.com/512/9187/9187604.png", "https://www.iconpacks.net/icons/1/free-user-login-icon-305-thumb.png", "https://static-00.iconduck.com/assets.00/user-login-icon-487x512-xx4t1c61.png"];

  optionProvinceSelected: string = "";
  optionCantonSelected: string = "";
  optionParishSelected: string = "";

  //constructor
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ){}

  //ngOnInit
  ngOnInit(){
    this.createBasicInfoForm();
    this.createContactForm();
    this.createCredentialsForm();
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

  //Método para recuperar la contraseña
  forgotPassword() {
  }

  //Método que redirige al formulario de Login
  goToLogin() {
    this.router.navigateByUrl(`/authentication/login`);
  }

  //Método que para avanzar al siguiente paso del stepper
  nextStep() {
    this.stepper.next();
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
  iconNext = iconos.faArrowRight;
}
