import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ApiResponseLoginUser, BodyLoginUser } from '../../interfaces/authentication';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzCarouselModule,
    LoaderComponent
  ],
  providers: [
    AuthenticationService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //Variables
  loginForm!: FormGroup;
  loaderStatus: boolean = false;
  showPassword: boolean = false;
  arrayImages: string[] = ["../../../../assets/images/IMG_Contract.svg", "../../../../assets/images/IMG_Send_mail.svg", "../../../../assets/images/IMG_Security.svg", "../../../../assets/images/IMG_Organize.svg", "../../../../assets/images/IMG_All_devices.svg"];
  messages: string[] = ["Genera contratos con IA", "Envía tus contratos por email", "Encripta tus contratos", "Gestiona y organiza", "Accede desde cualquier dispositivo"];

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.crateLoginForm();
  }

  //Método que crea el formulario del login
  crateLoginForm() {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  //Método que inicia la sesión del usuario
  loginUser() {
    this.loaderStatus = true;
    let body: BodyLoginUser = {
      username: this.loginForm.get('user')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.authenticationService.loginUser(body).subscribe({
      next: (data: ApiResponseLoginUser) => {
        this.loaderStatus = false;
        if (data.statusCode == 200) {
          alert('Sesión iniciada correctamente');
          sessionStorage.setItem('token', data.data.token);
          sessionStorage.setItem('typeUser', data.data.user.role);
        }
      },
      error: () => {
        this.loaderStatus = false;
        alert('Error al iniciar sesión');
      }
    })
  }

  //Método para obtener el tipo de entrada de contraseña según la visibilidad
  getPasswordInputType() {
    return this.showPassword ? 'text' : 'password';
  }

  //Método que verifica el ícono del password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  //Método para recuperar la contraseña
  forgotPassword() {
  }

  //Método que redirige al formulario de registro
  goToRegisterUser() {
    this.router.navigateByUrl(`/authentication/register-user`);
  }
}
