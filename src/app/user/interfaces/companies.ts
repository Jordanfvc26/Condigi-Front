import { PaginationI } from "../../shared/interfaces/pagination"

//Interfaz de respuesta de la API para obtener el listado de compañías del usuario logueado
export interface ApiResponseGetCompaniesByUserI {
    pagination: PaginationI;
    data: DataCompanyI[];
    message: string;
    statusCode: number;
}

//Inteefaz con la información de una compañía
export interface DataCompanyI {
    companyId: string;
    companyName: string;
    description: string;
    status: boolean;
}