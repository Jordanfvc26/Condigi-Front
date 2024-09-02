import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { HeaderBackComponent } from '../../../../shared/components/header-back/header-back.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { TableComponent } from '../../../../shared/components/table/table.component';

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
  columns: string[] = ["Tipo de contrato", "Realación", "Enviado a", "Estado", "Fecha de generación"];
  columnsFilter: string[] = ["contractType", "relation", "sendTo", "status", "createdAt"];
  dataContracts: any[] = [
    {
      contractType: "Contrato de Compra-Venta",
      relation: "Persona-Persona",
      sendTo: "jverac12@uteq.edu.ec",
      status: "ACTIVO",
      createdAt: "17 de Agosto del 2024"
    },
    {
      contractType: "Contrato de Trabajo",
      relation: "Empresa-Persona",
      sendTo: "lmoreirat@uteq.edu.ec",
      status: "ACTIVO",
      createdAt: "17 de Agosto del 2024"
    },
    {
      contractType: "Contrato temporal",
      relation: "Empresa-Empresa",
      sendTo: "bimbocode@gmail.com",
      status: "ACTIVO",
      createdAt: "17 de Agosto del 2024"
    },
    {
      contractType: "Contrato a término indefinido",
      relation: "Empresa-Persona",
      sendTo: "imanzabag@uteq.edu.ec",
      status: "ACTIVO",
      createdAt: "17 de Agosto del 2024"
    }
  ];
  actions: any[] = [
    {
      icon: "iconViewDetails",
      action: "Ver detalles"
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
  constructor(){}

  //ngOnInit
  ngOnInit(){

  }

  //Método que obtiene el ID del registro a eliminar
  getIDItemToDelete(companyId: number){
  }

  //Método que elimina un contrato
  deleteCompany(status: boolean) {
  }
}
