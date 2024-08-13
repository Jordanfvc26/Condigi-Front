import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponseGetGeographyI } from '../interfaces/geography';
import { environment } from '../../../environments/environment';
import { ApiResponseLoginUser, ApiResponseRegisterUserI, BodyLoginUser, BodyRegisterUserI } from '../interfaces/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //variables
  urlApi: string = environment.URL_API;

  constructor(
    private http: HttpClient
  ) { }

  //Método que consume la API que obtiene las provincias
  getProvinces(): Observable<ApiResponseGetGeographyI> {
    return this.http.get<ApiResponseGetGeographyI>(this.urlApi + `/geography/provinces`);
  }

  //Método que consume la API que obtiene los cantones por el ID de la provincia
  getCantonts(provinceID: number): Observable<ApiResponseGetGeographyI> {
    return this.http.get<ApiResponseGetGeographyI>(this.urlApi + `/geography/cantons/${provinceID}`);
  }

  //Método que consume la API que obtiene las parroquias por el ID del cantón
  getParishes(cantontID: number): Observable<ApiResponseGetGeographyI> {
    return this.http.get<ApiResponseGetGeographyI>(this.urlApi + `/geography/parishes/${cantontID}`);
  }

  //Método que consume la API para registrar un nuevo usuario
  registerUser(body: BodyRegisterUserI): Observable<ApiResponseRegisterUserI> {
    return this.http.post<ApiResponseRegisterUserI>(this.urlApi + `/auth/register`, body, {});
  }

  //Método que consume la API para iniciar sesión
  loginUser(body: BodyLoginUser): Observable<ApiResponseLoginUser> {
    return this.http.post<ApiResponseLoginUser>(this.urlApi + `/auth/login`, body, {});
  }
}
