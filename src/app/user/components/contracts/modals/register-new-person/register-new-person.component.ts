import { Component } from '@angular/core';
import { ReceiverPersonI } from '../../../../interfaces/persons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Validators } from 'ngx-editor';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-new-person',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderComponent
  ],
  templateUrl: './register-new-person.component.html',
  styleUrl: './register-new-person.component.css'
})
export class RegisterNewPersonComponent {
  //Variables
  static infoPerson: ReceiverPersonI = {} as ReceiverPersonI;
  infoPersonLocal: ReceiverPersonI = {} as ReceiverPersonI;
  loaderStatus: boolean = false;
  personForm!: FormGroup;

  //constructor
  constructor(
    public dialogRef: MatDialogRef<RegisterNewPersonComponent>,
    private formBuilder: FormBuilder,
  ) { }

  //ngOnInit
  ngOnInit() {
    this.createPersonForm();
    this.infoPersonLocal = RegisterNewPersonComponent.infoPerson;    
    this.fillInputsForm();
  }

  //Método que crea el formulario con la información de la persona
  createPersonForm() {
    this.personForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      identification: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  //Método que cierra el modal
  closeModal() {
    this.dialogRef.close();
  }

  //Método que cierra el modal y emite la información de la persona registrada
  addPerson() {
    this.dialogRef.close(this.personForm.value);
  }

  //Método que llena los inputs del formulario con la información de la persona que ya se registró previamente
  fillInputsForm(){
    this.personForm.controls['firstName'].setValue(this.infoPersonLocal.firstName);
    this.personForm.controls['lastName'].setValue(this.infoPersonLocal.lastName);
    this.personForm.controls['email'].setValue(this.infoPersonLocal.email);
    this.personForm.controls['phone'].setValue(this.infoPersonLocal.phone);
    this.personForm.controls['identification'].setValue(this.infoPersonLocal.identification);
    this.personForm.controls['address'].setValue(this.infoPersonLocal.address);
  }

  //Icons to use
  iconPerson = iconos.faUserAlt;
  iconClose = iconos.faXmark;
}
