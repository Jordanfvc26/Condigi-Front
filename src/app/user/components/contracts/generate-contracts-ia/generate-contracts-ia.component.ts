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
import { ApiResponseGetCompaniesByUserI, ReceiverCompanyI } from '../../../interfaces/companies';
import { ToastAlertsService } from '../../../../shared/services/toast-alert.service';
import { ContractsService } from '../../../services/contracts.service';
import { ApiResponseGetContractTypesI, ApiResponseGetInfoContractI, BodyForGenerateContractWithIAI } from '../../../interfaces/contracts';
import { MarkdownService } from '../../../services/marked.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterNewCompanyComponent } from '../modals/register-new-company/register-new-company.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as iconos from '@fortawesome/free-solid-svg-icons';

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
  optionCompanySenderSelected: string = "";
  optionCompanyReceiverSelected: string = "";

  arrayMyCompanies: any[] = [];
  arrayTypeContracts: any[] = [];

  editor!: Editor;
  infoContractInMarkdown: any = "";
  infoContractInHTML: any = 'Redacta tu contrato aquí...';
  contractIDCreated: string = "";
  isGenerated: boolean = false;

  infoNewCompanyReceiver: ReceiverCompanyI = {} as ReceiverCompanyI;
  newCompanyReceiver: boolean = false;

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    private contractsService: ContractsService,
    private toastr: ToastAlertsService,
    private markdownService: MarkdownService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  //ngOnInit
  ngOnInit(): void {
    this.createContractForm();
    this.editor = new Editor();
    this.getMyCompanies();
    this.getTypeContracts();
    this.infoContractInHTML = this.convertMarkdownToHtml(this.infoContractInMarkdown);
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

  //Método que llena el body con la información del formulario, para generar el contrato
  fillBodyForGenerateContract() {
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


  //Método que genera el contrato y guarda la información generada
  generateContract() {
    if (!this.isGenerated) {
      this.loaderStatus = true;
      this.contractsService.generateContract(this.fillBodyForGenerateContract()).subscribe({
        next: (data: any) => {
          this.loaderStatus = false;
          if (data.statusCode == 201) {
            this.contractIDCreated = data.data;
            this.getContractInfo();
            this.isGenerated = true;
            this.stepper.next();
            this.infoContractInMarkdown = data.data;
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
    this.loaderStatus = false;
    this.contractsService.updateContractByID(this.contractIDCreated, this.fillBodyForUpdateContract()).subscribe({
      next: (data: ApiResponseUpdateContractI) => {
        this.loaderStatus = false;
        if (data.statusCode == 200) {
          this.toastr.showToastSuccess("Éxito", "Contrato guardado correctamente");
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
      contractTypeId: this.contractIDCreated,
      startDate: this.contractForm.get('startDate')?.value,
      endDate: this.contractForm.get('endDate')?.value,
      numClauses: Number(this.contractForm.get('numClauses')?.value),
      paymentAmount: Number(this.contractForm.get('paymentAmount')?.value),
      paymentFrequency: Number(this.contractForm.get('paymentFrequency')?.value),
      status: 0,
      companyId: null,
      content: this.infoContractInMarkdown
    }
    return body;
  }

  //Método que abre el modal para registrar información de una nueva empresa
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

  getOptionCompanyReceiver(e: any) {
    if (e.target.value == "otra") {
      this.newCompanyReceiver = true;
      this.openModalRegisterNewCompany();
    }
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
}
