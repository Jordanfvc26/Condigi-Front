import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SearchRegistersPipe } from '../pipes/search-registers.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatTooltipModule,
    SearchRegistersPipe,
    MatPaginatorModule,
    FontAwesomeModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns: string[] = []
  @Input() columnsFilter: string[] = []
  @Input() data: any[] = []
  @Input() actions: any[] = [];
  @Input() filterBy: any[] = []; //Modificar la interfaz
  @Input() searchByDescription: string = "";
  @Input() urlGoToEdit: string = "";
  @Input() urlViewMore: string = "";
  @Input() excelName: string = "";
  @Input() searchBy: string = "";
  @Input() urlGoToCreateNewRegister: string = "";
  @Input() showOptionsHeaderTable = true;
  @Input() showPaginator: boolean = true;
  @Output() deleteItem = new EventEmitter<boolean>();
  @Output() idItemToDelete = new EventEmitter<number>();
  @Output() itemToViewDetails = new EventEmitter<number>();
  dataToSearch: any[] = [];
  itemsForPage: number = environment.ITEMS_FOR_PAGE;
  initialPage: number = 0;
  finalPage: number = environment.ITEMS_FOR_PAGE;
  isMobileView: boolean = false;

  //constructor
  constructor(
    private router: Router,
    public dialog: MatDialog
  ) {
    if (window.innerWidth <= 700)
      this.isMobileView = true;
    else
      this.isMobileView = false;
  }

  //Verifica el tamaño de la pantalla para cambiar a móvil
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 700)
      this.isMobileView = true;
    else
      this.isMobileView = false;
  }


  //ngOnInit
  ngOnInit() {
  }

  //Método que exporta la información de la tabla a un archivo XLSX
  downloadXLSX() {
    const table = document.getElementById('htmlExcelTable') as HTMLElement;
    const rows: any = [];
    const tableRows = table.querySelectorAll('tr');

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      const rowData: any = [];
      cells.forEach((cell) => {
        rowData.push((cell as HTMLElement).innerText);
      });
      rows.push(rowData);
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, this.excelName);
    XLSX.writeFile(workbook, `${this.getCurrentDate()}_listado_de_${this.excelName}.xlsx`);
  }

  //Método que obtiene la fecha actual para mostrarla en los archivos Excel y PDF
  getCurrentDate(): string {
    const fechaActual = new Date();
    return `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  }

  //Método que exporta la información de la tabla a un archivo PDF
  downloadPDF() {
  }

  //Método que cambia las páginas de la tabla
  changePage(e: PageEvent) {
    this.itemsForPage = e.pageSize;
    this.initialPage = e.pageIndex * this.itemsForPage;
    this.finalPage = this.initialPage + this.itemsForPage;
    if (this.finalPage > this.data.length) {
      this.finalPage = this.data.length;
    }
  }

  //Método que redirecciona al componente de crear un nuevo registro
  goToCreateNewRegister(){
    this.router.navigateByUrl(this.urlGoToCreateNewRegister);
  }


  //Icons to use
  //Iconos de acciones dentro de la tabla
  iconViewDetails = iconos.faEye;
  iconEdit = iconos.faEdit;
  iconDelete = iconos.faTrashAlt;
  iconNext = iconos.faCircleChevronRight;

  //Iconos para exportación de documentos
  iconXlsx = iconos.faFileExcel;
  iconAdd = iconos.faCirclePlus;
}
