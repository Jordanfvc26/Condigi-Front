import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header-back',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './header-back.component.html',
  styleUrl: './header-back.component.css'
})
export class HeaderBackComponent {
  @Input() titleModule: string = "";
  @Input() urlBack: string = "";
  isMobileView: boolean = false;

  //Constructor
  constructor(
    private router: Router
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

  //Método que redirige al estudiante al componente de cursos
  goToBack() {
    this.router.navigateByUrl(this.urlBack);
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
}
