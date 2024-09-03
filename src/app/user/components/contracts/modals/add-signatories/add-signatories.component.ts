import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Validators } from 'ngx-editor';
import { ApiResponseGetPersonsForGenerateContract, InfoPersonForSendContractI } from '../../../../interfaces/persons';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { PersonsService } from '../../../../services/persons.service';
import { ToastAlertsService } from '../../../../../shared/services/toast-alert.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { ContractsService } from '../../../../services/contracts.service';
import { ApiResponseAddSignatoryI, BodyForAddSignatoryI } from '../../../../interfaces/contracts';

@Component({
  selector: 'app-add-signatories',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderComponent
  ],
  providers: [
    PersonsService,
    ContractsService
  ],
  templateUrl: './add-signatories.component.html',
  styleUrl: './add-signatories.component.css'
})
export class AddSignatoriesComponent {
  //Variables
  static contractID: string = "";
  contractIDLocal: string = "";
  personForm!: FormGroup;
  arrayPersons: InfoPersonForSendContractI[] = [];
  loaderStatus: boolean = false;
  optionSigantorSelected: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private personsService: PersonsService,
    private toastr: ToastAlertsService,
    private dialogRef: MatDialogRef<AddSignatoriesComponent>,
    private contractService: ContractsService
  ) { }

  //ngOnInit
  ngOnInit(): void {
    this.createPersonForm();
    this.getPersonsForGenerateContract();
    this.contractIDLocal = AddSignatoriesComponent.contractID;
  }

  //Método que crea el formulario con el input para seleccionar el usuario
  createPersonForm() {
    this.personForm = this.formBuilder.group({
      personID: ['', Validators.required],
    });
  }

  //Método que cierra el modal
  closeModal() {
    this.dialogRef.close();
  }

  //Método que obtiene el listado de personas disponibles para generarles contrato
  getPersonsForGenerateContract() {
    this.loaderStatus = true;
    this.personsService.getPersonsForGenerateContract().subscribe({
      next: (data: ApiResponseGetPersonsForGenerateContract) => {
        this.loaderStatus = false;
        if (data.statusCode == 200)
          this.arrayPersons = data.data;
        else
          this.toastr.showToastError("Error", "No se pudo obtener el listado de personas");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener el listado de personas");
      }
    });
  }

  //Método que agrega
  addSignatory() {
    this.loaderStatus = true;
    this.contractService.addSignatoryToContract(this.fillBodyAddSignatory()).subscribe({
      next: (data: ApiResponseAddSignatoryI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200) {
          this.toastr.showToastSuccess("Se ha agregado el firmante al contrato", "Éxito");
          this.closeModal();
        }
        else
          this.toastr.showToastError("Error", "No se pudo agregar el firmante al contrato");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo agregar el firmante al contrato");
      }
    });
  }

  //Método que llena el body requerido para agregar un firmante al contrato
  fillBodyAddSignatory() {
    let body: BodyForAddSignatoryI = {
      contractId: this.contractIDLocal,
      userId: this.personForm.get("personID")?.value
    }
    console.log("Esto se envia")
    console.log(body)
    return body;
  }

  //Icons to use
  iconUser = iconos.faUserAlt;
  iconClose = iconos.faXmark;
}
