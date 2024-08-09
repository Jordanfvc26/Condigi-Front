import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzCarouselModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //Variables
  loginForm!: FormGroup;
  showPassword: boolean = false;
  arrayImages: string[] = ["https://cdn-icons-png.flaticon.com/512/9187/9187604.png", "https://www.iconpacks.net/icons/1/free-user-login-icon-305-thumb.png", "https://static-00.iconduck.com/assets.00/user-login-icon-487x512-xx4t1c61.png"];

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    //private authenticationService: AuthenticationService
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
    /* let body : BodyLogin = {
      username: this.loginForm.get('user')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.authenticationService.loginUser(body).subscribe({
      next: (response: ApiResponse<DataResponseLogin>) => {
        alert('Sesión iniciada correctamente');
        let token = response.data?.token ?? '';
        localStorage.setItem('token', token);
      },
      error: () => {
        alert('Error al iniciar sesión');
      }
    }) */
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
  forgotPassword(){
  }

  //Método que redirige al formulario de registro
  goToRegisterUser(){
    this.router.navigateByUrl(`/authentication/register-user`);
  }
}
