import { Component, ViewChild } from '@angular/core';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { CompaniesService } from '../../../services/companies.service';
import { ApiResponseGetCompaniesByUserI } from '../../../interfaces/companies';
import { ToastAlertsService } from '../../../../shared/services/toast-alert.service';
import { ContractsService } from '../../../services/contracts.service';
import { ApiResponseGetContractTypesI } from '../../../interfaces/contracts';

@Component({
  selector: 'app-generate-contracts-ia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderComponent,
    NavbarComponent,
    HeaderBackComponent,
    MatStepperModule,
    NgxEditorModule,
    FontAwesomeModule
  ],
  providers: [
    CompaniesService,
    ContractsService
  ],
  templateUrl: './generate-contracts-ia.component.html',
  styleUrl: './generate-contracts-ia.component.css'
})
export class GenerateContractsIAComponent {
  //Variables
  @ViewChild('stepper') stepper!: MatStepper;
  loaderStatus: boolean = false;
  contractForm!: FormGroup;
  optionTypeContractSelected: string = "";
  optionCompanySelected: string = "";
  optionCompanyReceibedSelected: string = "";
  arrayMyCompanies: any[] = [];
  arrayTypeContracts: any[] = [];
  editor!: Editor;
  html = '';

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    private contractsService: ContractsService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit
  ngOnInit(): void {
    this.createContractForm();
    this.editor = new Editor();
    this.getMyCompanies();
    this.getTypeContracts();
  }

  //ngOnDestroy
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  //Método que crea el formulario del contrato
  createContractForm() {
    this.contractForm = this.formBuilder.group({
      contractTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      numClauses: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      paymentFrequency: ['', Validators.required],
      contractDetails: ['', Validators.required],
      contractObjects: ['', Validators.required],
      contractConfidentiality: ['', Validators.required],
      senderCompanyId: ['', Validators.required],
      receiverCompanyId: ['', Validators.required],
    });
  }

  //Método que consume el servicio para obtener las empresas del usuario que está generando el contrato
  getMyCompanies() {
    this.loaderStatus = true;
    this.companiesService.getCompaniesByUser(1, 10).subscribe(
      (data: ApiResponseGetCompaniesByUserI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200)
          this.arrayMyCompanies = data.data;
        else
          this.toastr.showToastError("Error", "No se pudo obtener el listado de compañías");
      },
      (error: any) => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener el listado de compañías");
      }
    );
  }

  //Método que consume el servicio para obtener el listado de empresas
  getTypeContracts(){
    this.loaderStatus = true;
    this.contractsService.getTypeContracts(1, 10).subscribe(
      (data: ApiResponseGetContractTypesI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200)
          this.arrayTypeContracts = data.data;
        else
          this.toastr.showToastError("Error", "No se pudo obtener los tipos de contratos");
      },
      (error: any) => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener los tipos de contratos");
      }
    );
  }

  //Método que genera el contrato
  generateContract() {
    this.stepper.next();
    //Consumir servicio para generar contrato
  }


  //Método que obtiene la opción de la empresa que EMITE el contrato
  getOptionCompanySelected(e: any) {
  }

  //Método que genera el contrato en PDF y lo guarda
  convertPDFAndSave() {
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
}
