import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from '../../shared/services/headers.service';
import { Observable } from 'rxjs';
import { ApiResponseGetPersonsForGenerateContract } from '../interfaces/persons';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  //Variables
  options = {}
  urlApi = environment.URL_API;

  //Constructor
  constructor(
    private http: HttpClient,
    private headersService: HeadersService
  ) { }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume la API para obtener el listado de compañías del usuario logueado
  getPersonsForGenerateContract(): Observable<ApiResponseGetPersonsForGenerateContract> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.get<ApiResponseGetPersonsForGenerateContract>(this.urlApi + `/contracts-ai/persons`, this.options);
  }
}
