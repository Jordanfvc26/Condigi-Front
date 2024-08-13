import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FontAwesomeModule,
    LoaderComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  //Variables
  dropdownOpen = false;
  userName: string = "Nombre usuario";
  emailUser: string = "usuario@gmail.com"
  loaderStatus: boolean = false;

  //constructor
  constructor(
    private router: Router
  ) { }

  //ngOnInit
  ngOnInit() {
    this.userName = sessionStorage.getItem('userName') || 'Nombre usuario';
    this.emailUser = sessionStorage.getItem('email') || 'usuario@gmail.com';
  }

  //Método que abre y cierra el submenú
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  //Método para verificar si se hizo click fuera del submenú
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.container-info-user');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  //Método que redirige a la opción del perfil de usuario
  goToViewProfile() {
    this.router.navigateByUrl('user/dashboard/my-profile');
  }

  //Método que redirige a la opción de cambiar la contraseña
  goToChangePassword() {
    this.router.navigateByUrl('user/dashboard/change-password');
  }

  //Método que cierra la sesión del usuario
  signOut() {
    this.loaderStatus = true;
    sessionStorage.clear();
    localStorage.clear();
    setTimeout(() => {
      this.loaderStatus = false;
      this.router.navigateByUrl('authentication/login');
    }, 1500);
  }

  //Icons to use
  iconViewMore = iconos.faChevronDown;
}
