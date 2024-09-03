import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from '../../shared/services/headers.service';
import { Observable } from 'rxjs';
import { ApiResponseAddSignatoryI, ApiResponseGenerateContractWithIAI, ApiResponseGetContractTypesI, ApiResponseGetInfoContractI, ApiResponseGetMyContractsI, ApiResponseUpdateContractI, BodyForAddSignatoryI, BodyForGenerateContractWithIAI, BodyForUpdateInfoContractI } from '../interfaces/contracts';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
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

  //Método que consume la API para obtener el listado de los tipos de contratos
  getTypeContracts(currentPage: number, pageSize: number): Observable<ApiResponseGetContractTypesI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.get<ApiResponseGetContractTypesI>(this.urlApi + `/contract-types/list?currentPage=${currentPage}&pageSize=${pageSize}`, this.options);
  }

  //Método que consume la API para generar un contrato con IA
  generateContract(body: BodyForGenerateContractWithIAI): Observable<ApiResponseGenerateContractWithIAI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.post<ApiResponseGenerateContractWithIAI>(this.urlApi + `/contracts-ai/create`, body, this.options);
  }

  //Método que consume la API para obtener la información del contrato generado por IA
  getContractByID(contractId: string): Observable<ApiResponseGetInfoContractI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.get<ApiResponseGetInfoContractI>(this.urlApi + `/contracts/${contractId}`, this.options);
  }

  //Método que consume la API para actualizar la información de un contrato
  updateContractByID(contractId: string, body: BodyForUpdateInfoContractI): Observable<ApiResponseUpdateContractI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.put<ApiResponseUpdateContractI>(this.urlApi + `/contracts/${contractId}`, body, this.options);
  }

  //Método que consume la API para obtener el listado de contratos del usuario autenticado
  getMyContracts(status: number, pageSize: number, currentPage: number, ): Observable<ApiResponseGetMyContractsI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.get<ApiResponseGetMyContractsI>(this.urlApi + `/contracts/list?status=${status}&pageSize=${pageSize}&currentPage=${currentPage}`, this.options);
  }

  //Método que consume la API para agregar un firmante al contrato
  addSignatoryToContract(body: BodyForAddSignatoryI): Observable<ApiResponseAddSignatoryI> {
    this.options = this.headersService.getHeaders(this.getHeaders());
    return this.http.post<ApiResponseAddSignatoryI>(this.urlApi + `/contract-participants/add-user`, body, this.options);
  }
}
