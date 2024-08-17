import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from '../../shared/services/headers.service';
import { Observable } from 'rxjs';
import { ApiResponseGetContractTypesI } from '../interfaces/contracts';

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
}
