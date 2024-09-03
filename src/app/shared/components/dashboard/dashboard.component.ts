import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectTypeContractComponent } from '../../../user/components/contracts/modals/select-type-contract/select-type-contract.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  //constructor
  constructor(
    private dialog: MatDialog,
  ){}

  //Método que abre el modal para seleccionar el tipo de relación de contrato a generar
  openModalSelectTypeRelation(){
    this.dialog.open(SelectTypeContractComponent, {
      width: '500px',
      enterAnimationDuration: '250ms',
    });
  }
}
