import { ApiResponseUpdateContractI, BodyForUpdateInfoContractI } from './../../../interfaces/contracts';
import { Component, ViewChild } from '@angular/core';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompaniesService } from '../../../services/companies.service';
import { ApiResponseGetCompaniesByUserI, ApiResponseGetCompaniesForGenerateContractI, DataCompanyForGenerateContractI, ReceiverCompanyI } from '../../../interfaces/companies';
import { ToastAlertsService } from '../../../../shared/services/toast-alert.service';
import { ContractsService } from '../../../services/contracts.service';
import { ApiResponseGetContractTypesI, ApiResponseGetInfoContractI, BodyForGenerateContractWithIAI } from '../../../interfaces/contracts';
import { MarkdownService } from '../../../services/marked.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterNewCompanyComponent } from '../modals/register-new-company/register-new-company.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterNewPersonComponent } from '../modals/register-new-person/register-new-person.component';
import { ApiResponseGetPersonsForGenerateContract, InfoPersonForSendContractI, ReceiverPersonI } from '../../../interfaces/persons';
import { PersonsService } from '../../../services/persons.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { faLastfm } from '@fortawesome/free-brands-svg-icons';

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
    FontAwesomeModule,
    MatTooltipModule
  ],
  providers: [
    CompaniesService,
    ContractsService,
    PersonsService
  ],
  templateUrl: './generate-contracts-ia.component.html',
  styleUrl: './generate-contracts-ia.component.css'
})
export class GenerateContractsIAComponent {
  //Variables
  @ViewChild('stepper') stepper!: MatStepper;
  loaderStatus: boolean = false;
  fullNameUser: string = "USUARIO DE PRUEBA";
  contractForm!: FormGroup;
  optionTypeContractSelected: string = "";
  optionCompanySenderSelected: string = "";
  optionCompanyReceiverSelected: string = "";

  arrayMyCompanies: any[] = [];
  arrayTypeContracts: any[] = [];

  arrayCompaniesForGenerateContract: DataCompanyForGenerateContractI[] = [];

  editor!: Editor;
  infoContractInMarkdown: any = "";
  infoContractInHTML: any = 'Redacta tu contrato aquí...';
  contractIDCreated: string = "";
  isGenerated: boolean = false;

  infoNewCompanyReceiver: ReceiverCompanyI = {} as ReceiverCompanyI;
  infoNewPersonReceiver: ReceiverPersonI = {} as ReceiverPersonI;
  newCompanyReceiver: boolean = false;
  newPersonReceiver: boolean = false;

  typeRelationContract: string = "";
  arrayPersons: InfoPersonForSendContractI[] = [];

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    private contractsService: ContractsService,
    private toastr: ToastAlertsService,
    private markdownService: MarkdownService,
    private router: Router,
    public dialog: MatDialog,
    private personsService: PersonsService
  ) { }

  //ngOnInit
  ngOnInit(): void {
    this.fullNameUser = sessionStorage.getItem('userName')?.toUpperCase() || "";
    this.typeRelationContract = localStorage.getItem('contractRelation') || "";
    this.getMyCompanies();
    if (this.typeRelationContract == "company-to-company") {
      this.getCompaniesForGenerateContract();
      this.createContractFormCTC();
    }
    else if(this.typeRelationContract == "company-to-person") {
      this.getPersonsForGenerateContract();
      this.createContractFormCTP();
    }
    else{
      this.getPersonsForGenerateContract();
      this.createContractFormPTP();
    }
    this.editor = new Editor();
    this.getTypeContracts();
    this.infoContractInHTML = this.convertMarkdownToHtml(this.infoContractInMarkdown);
  }

  //ngOnDestroy
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  //Método que crea el formulario del contrato para el tipo de relación EMPRESA-EMPRESA
  createContractFormCTC(): void {
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
      textContract: ['']
    });
  }

  //Método que crea el formulario del contrato para el tipo de relación EMPRESA-PERSONA
  createContractFormCTP(): void {
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
      receiverPersonId: ['', Validators.required],
      textContract: ['']
    });
  }

  //Método que crea el formulario del contrato para el tipo de relación PERSONA-PERSONA
  createContractFormPTP(): void {
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
      receiverPersonId: ['', Validators.required],
      textContract: ['']
    });
  }

  //Método que consume el servicio para obtener las empresas del usuario que está generando el contrato
  getMyCompanies(): void {
    this.loaderStatus = true;
    this.companiesService.getCompaniesByUser().subscribe({
      next: (data: ApiResponseGetCompaniesByUserI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200)
          this.arrayMyCompanies = data.data;
        else
          this.toastr.showToastError("Error", "No se pudo obtener el listado de compañías");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener el listado de compañías");
      }
    });
  }

  //Método que consume el servicio para obtener las empresas disponibles para generarles un contrato
  getCompaniesForGenerateContract(): void {
    this.loaderStatus = true;
    this.companiesService.getCompaniesForGenerateContract().subscribe({
      next: (data: ApiResponseGetCompaniesForGenerateContractI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200)
          this.arrayCompaniesForGenerateContract = data.data;
        else
          this.toastr.showToastError("Error", "No se pudo obtener el listado de empresas");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener el listado de empresas");
      }
    });
  }

  //Método que consume el servicio para obtener el listado de empresas
  getTypeContracts() {
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



  //Método que llena el body con la información del formulario, para generar el contrato de tipo EMPRESA-EMPRESA
  fillBodyForGenerateContractCTC() {
    let body: BodyForGenerateContractWithIAI = {} as BodyForGenerateContractWithIAI;
    //Si la empresa receptora es nueva y no está registrada, se manda la información completa
    if (this.newCompanyReceiver) {
      body = {
        contractTypeId: this.contractForm.get('contractTypeId')?.value,
        startDate: this.contractForm.get('startDate')?.value,
        endDate: this.contractForm.get('endDate')?.value,
        numClauses: Number(this.contractForm.get('numClauses')?.value),
        paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
        paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
        status: 0,
        contractDetails: this.contractForm.get('contractDetails')?.value,
        contractObjects: this.contractForm.get('contractObjects')?.value,
        contractConfidentiality: this.contractForm.get('contractConfidentiality')?.value,
        senderId: this.contractForm.get('senderCompanyId')?.value,
        senderType: 0,
        receiverType: 0,
        receiverCompany: this.fillBodyReceiverNewCompany()
      };
    }
    else { //Si la empresa receptora es ya está registrada, se manda solo el ID de la empresa receptora
      body = {
        contractTypeId: this.contractForm.get('contractTypeId')?.value,
        startDate: this.contractForm.get('startDate')?.value,
        endDate: this.contractForm.get('endDate')?.value,
        numClauses: Number(this.contractForm.get('numClauses')?.value),
        paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
        paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
        status: 0,
        contractDetails: this.contractForm.get('contractDetails')?.value,
        contractObjects: this.contractForm.get('contractObjects')?.value,
        contractConfidentiality: this.contractForm.get('contractConfidentiality')?.value,
        senderId: this.contractForm.get('senderCompanyId')?.value,
        senderType: 0,
        receiverType: 0,
        receiverId: this.contractForm.get('receiverCompanyId')?.value
      };
    }
    return body;
  }

  //Método que llena el body para que una nueva compañía (que no está registrada) reciba el contrato
  fillBodyReceiverNewCompany(): ReceiverCompanyI {
    let body: ReceiverCompanyI = {
      name: this.infoNewCompanyReceiver.name,
      ruc: this.infoNewCompanyReceiver.ruc,
      address: this.infoNewCompanyReceiver.address,
      parishId: this.infoNewCompanyReceiver.parishId,
      phone: this.infoNewCompanyReceiver.phone,
      email: this.infoNewCompanyReceiver.email,
    };
    return body;
  }



  //Método que llena el body con la información del formulario para generar el contrato de tipo EMPRESA-PERSONA
  fillBodyForGenerateContractCTP() {
    let body: BodyForGenerateContractWithIAI = {} as BodyForGenerateContractWithIAI;
    //Si la persona receptora es nueva y no está registrada, se manda la información completa
    if (this.newPersonReceiver) {
      body = {
        contractTypeId: this.contractForm.get('contractTypeId')?.value,
        startDate: this.contractForm.get('startDate')?.value,
        endDate: this.contractForm.get('endDate')?.value,
        numClauses: Number(this.contractForm.get('numClauses')?.value),
        paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
        paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
        status: 0,
        contractDetails: this.contractForm.get('contractDetails')?.value,
        contractObjects: this.contractForm.get('contractObjects')?.value,
        contractConfidentiality: this.contractForm.get('contractConfidentiality')?.value,
        senderId: this.contractForm.get('senderCompanyId')?.value,
        senderType: 0,
        receiverType: 1,
        receiverPerson: this.fillBodyReceiverNewPerson()
      };
    }
    else { //Si la persona receptora es ya está registrada, se manda solo el ID de la persona receptora
      body = {
        contractTypeId: this.contractForm.get('contractTypeId')?.value,
        startDate: this.contractForm.get('startDate')?.value,
        endDate: this.contractForm.get('endDate')?.value,
        numClauses: Number(this.contractForm.get('numClauses')?.value),
        paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
        paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
        status: 0,
        contractDetails: this.contractForm.get('contractDetails')?.value,
        contractObjects: this.contractForm.get('contractObjects')?.value,
        contractConfidentiality: this.contractForm.get('contractConfidentiality')?.value,
        senderId: this.contractForm.get('senderCompanyId')?.value,
        senderType: 0,
        receiverType: 1,
        receiverId: this.contractForm.get('receiverPersonId')?.value
      };
    }
    return body;
  }

  //Método que llena el body con la nueva persona que no está registrada, a la que se le generará el contrato
  fillBodyReceiverNewPerson(): ReceiverPersonI {
    let body: ReceiverPersonI = {
      firstName: this.infoNewPersonReceiver.firstName,
      lastName: this.infoNewPersonReceiver.lastName,
      email: this.infoNewPersonReceiver.email,
      phone: this.infoNewPersonReceiver.phone,
      identification: this.infoNewPersonReceiver.identification,
      address: this.infoNewPersonReceiver.address
    };
    return body;
  }


  //Método que llena el body con la información del formulario para generar el contrato de tipo PERSONA-PERSONA
  fillBodyForGenerateContractPTP(){
    let body: BodyForGenerateContractWithIAI = {} as BodyForGenerateContractWithIAI;
    //Si la persona receptora es nueva y no está registrada, se manda la información completa
    if (this.newCompanyReceiver) {
      body = {
        contractTypeId: this.contractForm.get('contractTypeId')?.value,
        startDate: this.contractForm.get('startDate')?.value,
        endDate: this.contractForm.get('endDate')?.value,
        numClauses: Number(this.contractForm.get('numClauses')?.value),
        paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
        paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
        status: 0,
        contractDetails: this.contractForm.get('contractDetails')?.value,
        contractObjects: this.contractForm.get('contractObjects')?.value,
        contractConfidentiality: this.contractForm.get('contractConfidentiality')?.value,
        senderType: 1,
        receiverType: 1,
        receiverPerson: this.fillBodyReceiverNewPerson()
      };
    }
    else { //Si la persona receptora es ya está registrada, se manda solo el ID de la persona receptora
      body = {
        contractTypeId: this.contractForm.get('contractTypeId')?.value,
        startDate: this.contractForm.get('startDate')?.value,
        endDate: this.contractForm.get('endDate')?.value,
        numClauses: Number(this.contractForm.get('numClauses')?.value),
        paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
        paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
        status: 0,
        contractDetails: this.contractForm.get('contractDetails')?.value,
        contractObjects: this.contractForm.get('contractObjects')?.value,
        contractConfidentiality: this.contractForm.get('contractConfidentiality')?.value,
        senderType: 1,
        receiverType: 1,
        receiverId: this.contractForm.get('receiverPersonId')?.value
      };
    }
    return body;
  }


  //Método que genera el contrato y guarda la información generada
  generateContract() {
    if (!this.isGenerated) {
      this.loaderStatus = true;
      this.contractsService.generateContract(this.typeRelationContract == "company-to-company" ? this.fillBodyForGenerateContractCTC() : this.typeRelationContract == "company-to-person" ? this.fillBodyForGenerateContractCTP() : this.fillBodyForGenerateContractPTP()).subscribe({
        next: (data: any) => {
          this.loaderStatus = false;
          if (data.statusCode == 201) {
            this.contractIDCreated = data.data;
            this.getContractInfo();
            this.isGenerated = true;
          } else {
            this.toastr.showToastError("Error", "No se pudo generar el contrato");
          }
        },
        error: () => {
          this.loaderStatus = false;
          this.toastr.showToastError("Error", "No se pudo generar el contrato");
        }
      });
    }
    else
      this.stepper.next();
  }



  //Método que consume el servicio para obtener información del contrato generado
  getContractInfo() {
    this.loaderStatus = true;
    this.contractsService.getContractByID(this.contractIDCreated).subscribe({
      next: (data: ApiResponseGetInfoContractI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200) {
          this.infoContractInMarkdown = data.data.content;
          this.infoContractInHTML = this.convertMarkdownToHtml(this.infoContractInMarkdown);
          this.stepper.next();
          this.contractForm.get('textContract')?.setValue(this.infoContractInHTML);
        }
        else
          this.toastr.showToastError("Error", "No se pudo obtener la información del contrato");

      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener la información del contrato");
      }
    });
  }

  //Método que transforma el markdown a HTML
  convertMarkdownToHtml(markdown: string) {
    return this.markdownService.convert(markdown);
  }

  //Método que actualiza la información del contrato y la guarda
  saveContract() {
    this.loaderStatus = true;
    this.contractsService.updateContractByID(this.contractIDCreated, this.fillBodyForUpdateContract()).subscribe({
      next: (data: ApiResponseUpdateContractI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200) {
          this.toastr.showToastSuccess("Contrato guardado correctamente", "Éxito");
          this.router.navigateByUrl('/user/contracts/list-contracts');
        }
        else
          this.toastr.showToastError("Error", "No se pudo guardar el contrato");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo guardar el contrato");
      }
    });
  }

  //Método que rellena el body con la informacion necesaria para actualizar el contrato
  fillBodyForUpdateContract(): BodyForUpdateInfoContractI {
    let body: BodyForUpdateInfoContractI = {
      contractTypeId: this.contractForm.get('contractTypeId')?.value,
      startDate: this.contractForm.get('startDate')?.value,
      endDate: this.contractForm.get('endDate')?.value,
      numClauses: Number(this.contractForm.get('numClauses')?.value),
      paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
      paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
      status: 0,
      companyId: null,
      content: this.contractForm.get('textContract')?.value,
    }
    return body;
  }

  //Método que abre el modal para registrar información de una nueva EMPRESA
  openModalRegisterNewCompany() {
    if (this.infoNewCompanyReceiver.name)
      RegisterNewCompanyComponent.infoCompany = this.infoNewCompanyReceiver;
    let dialogRef = this.dialog.open(RegisterNewCompanyComponent, {
      width: '750px',
      enterAnimationDuration: '250ms',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.infoNewCompanyReceiver = result;
    });
  }

  //Método que obtiene la opción seleccionada en el select de EMPRESA RECEPTORA
  getOptionCompanyReceiver(e: any) {
    if (e.target.value == "other-company") {
      this.newCompanyReceiver = true;
      this.openModalRegisterNewCompany();
    }
    else if (e.target.value == "other-person"){
      this.newPersonReceiver = true;
      this.openModalRegisterNewPerson();
    }
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

  //Método que abre el modal para registrar información de una nueva PERSONA
  openModalRegisterNewPerson() {
    if (this.infoNewPersonReceiver.firstName)
      RegisterNewPersonComponent.infoPerson = this.infoNewPersonReceiver;
    let dialogRef = this.dialog.open(RegisterNewPersonComponent, {
      width: '750px',
      enterAnimationDuration: '250ms',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.infoNewPersonReceiver = result;
    });
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
}
