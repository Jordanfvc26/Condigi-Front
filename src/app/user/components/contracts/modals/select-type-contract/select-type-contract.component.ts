import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-select-type-contract',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './select-type-contract.component.html',
  styleUrl: './select-type-contract.component.css'
})
export class SelectTypeContractComponent {

  // Constructor
  constructor(
    public dialogRef: MatDialogRef<SelectTypeContractComponent>,
    private router: Router
  ) { }

  //Método que cierra el modal
  closeModal() {
    this.dialogRef.close(false);
  }

  //Método que redirige al componente de generación del contrato, pasando el tipo de contrato a generar
  goToGenerateContract(contractRelation: string): void {
    localStorage.setItem('contractRelation', contractRelation);
    this.router.navigateByUrl('/user/contracts/create-contract');
    this.dialogRef.close(false);
  }

  //Icons to use
  iconClose = iconos.faXmark;
  iconDocument = iconos.faFileLines;
}
