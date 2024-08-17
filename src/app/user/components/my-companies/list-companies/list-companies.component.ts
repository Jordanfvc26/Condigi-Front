import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';
import { CompaniesService } from '../../../services/companies.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ApiResponseGetCompaniesByUserI } from '../../../interfaces/companies';
import { ToastAlertsService } from '../../../../shared/services/toast-alert.service';

@Component({
  selector: 'app-list-companies',
  standalone: true,
  imports: [
    NavbarComponent,
    TableComponent,
    HeaderBackComponent,
    LoaderComponent
  ],
  providers: [
    CompaniesService
  ],
  templateUrl: './list-companies.component.html',
  styleUrl: './list-companies.component.css'
})
export class ListCompaniesComponent {
  //Variables
  loaderStatus: boolean = false;
  compnayID: number = 0;
  columns: string[] = ["Nombre", "RUC", "Teléfono", "Correo", "Estado", "Fecha de registro"];
  columnsFilter: string[] = ["companyName", "ruc", "phone", "email", "status", "createdAt"];
  dataCompanies: any[] = [];
  actions: any[] = [
    {
      icon: "iconViewDetails",
      action: "Ver asistentes"
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
    private companiesService: CompaniesService,
    private toastr: ToastAlertsService
  ){}

  //ngOnInit
  ngOnInit(){
    this.getCompaniesByUser(1, 10);
  }

  //Método que llama al servicio para obtener el listado de compañías del usuario logueado
  getCompaniesByUser(currentPage: number, pageSize: number){
    this.loaderStatus = true;
    this.companiesService.getCompaniesByUser(currentPage, pageSize).subscribe({
      next: (response: ApiResponseGetCompaniesByUserI) => {
        this.loaderStatus = false;
        if(response.statusCode == 200)
          this.dataCompanies = response.data;
        else
        this.toastr.showToastError("Error", "No se pudo obtener el listado de compañías");
      },
      error: () => {
        this.loaderStatus = false;
        this.toastr.showToastError("Error", "No se pudo obtener el listado de compañías");
      }
    })
  }

  //Método que obtiene el id de la compañía a eliminar
  getIDItemToDelete(companyId: number) {
    this.compnayID = companyId;
  }

  //Método que elimina una compañía
  deleteCompany(status: boolean) {

  }
}
