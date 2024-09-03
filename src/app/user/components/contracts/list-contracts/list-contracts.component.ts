import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { ApiResponseGetInfoContractI, ApiResponseGetMyContractsI } from '../../../interfaces/contracts';
import { ContractsService } from '../../../services/contracts.service';
import { ToastAlertsService } from '../../../../shared/services/toast-alert.service';

@Component({
  selector: 'app-list-contracts',
  standalone: true,
  imports: [
    LoaderComponent,
    NavbarComponent,
    HeaderBackComponent,
    TableComponent
  ],
  templateUrl: './list-contracts.component.html',
  styleUrl: './list-contracts.component.css'
})
export class ListContractsComponent {
  //Variables
  loaderStatus: boolean = false;
  columns: string[] = ["Tipo de contrato", "Emitido como", "Estado", "Fecha de generación", "Fecha de actualización"];
  columnsFilter: string[] = ["contractType", "emitBy", "status", "createdAt", "updatedAt"];
  dataContracts: any[] = [];
  actions: any[] = [
    {
      icon: "iconViewDetails",
      action: "Ver detalles"
    },
    {
      icon: "iconAddSignatories",
      action: "Agregar firmantes"
    },
    {
      icon: "iconEdit",
      action: "Editar"
    },
    {
      icon: "iconDelete",
      action: "Eliminar"
    },
  ]
  filterCompanies: any[] = [
    {
      value: "Todas",
      description: "all"
    },
    {
      value: "Activas",
      description: "active"
    },
    {
      value: "Inactivas",
      description: "inactive"
    }
  ]

  //constructor
  constructor(
    private contractService: ContractsService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.getMyContracts();
  }

  //Método que obtiene el ID del registro a eliminar
  getIDItemToDelete(companyId: number) {
  }

  //Método que elimina un contrato
  deleteCompany(status: boolean) {
  }

  //Método que obtiene el listado de contratos
  getMyContracts() {
    this.loaderStatus = true;
    this.contractService.getMyContracts(0, 100, 1).subscribe({
      next: (data: ApiResponseGetMyContractsI) => {
        this.loaderStatus = false;
        if (data.statusCode === 200) {
          // Inicializa this.dataContracts como un array vacío
          this.dataContracts = [];

          data.data.forEach(contract => {
            this.dataContracts.push({
              contractId: contract.contractId,
              contractType: contract.contractType.name,
              emitBy: this.getEmitBy(contract.contractId),
              status: contract.status === 1 ? "APROBADO" : "PENDIENTE",
              createdAt: contract.createdAt,
              updatedAt: contract.updatedAt
            });
          });
          console.log("Data final");
          console.log(this.dataContracts);
        }
        else
          this.toastr.showToastError("Error", "No se pudieron obtener los contratos");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudieron obtener los contratos");
      }
    })
  }

  //Método que obtiene el nombre de la empresa o persona que emitió el contrato
  getEmitBy(contractID: string) {
    this.loaderStatus = true;
    this.contractService.getContractByID(contractID).subscribe({
      next: (data: ApiResponseGetInfoContractI) => {
        this.loaderStatus = false;
        if (data.statusCode === 200) {
          return data.data.contractParticipants[0].role === 0 ? "Empresa" : "Persona";
        }
        else
          return "---";
      },
      error: () => {
        this.loaderStatus = false;
        return "---";
      }
    })
  }
}
