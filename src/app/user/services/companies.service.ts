import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from '../../shared/services/headers.service';
import { Observable } from 'rxjs';
import { ApiResponseCreateCompanyI, ApiResponseGetCompaniesByUserI, ApiResponseGetCompaniesForGenerateContractI, BodyCreateCompanyI } from '../interfaces/companies';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
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

  //Método que consume la API para obtener el listado de empresas del usuario logueado
  getCompaniesByUser(): Observable<ApiResponseGetCompaniesByUserI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.get<ApiResponseGetCompaniesByUserI>(this.urlApi + `/users/companies`, this.options);
  }

  //Método que consume la API para obtener el listado de empresas disponibles para generarles un contrato
  getCompaniesForGenerateContract(): Observable<ApiResponseGetCompaniesForGenerateContractI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.get<ApiResponseGetCompaniesForGenerateContractI>(this.urlApi + `/contracts-ai/companies`, this.options);
  }

  //Método que consume la API para crear una nueva empresa
  createCompany(body: BodyCreateCompanyI): Observable<ApiResponseCreateCompanyI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.post<ApiResponseCreateCompanyI>(this.urlApi + `/users/create-company`, body, this.options);
  }
}
