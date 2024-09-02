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

//Interfaz con el body requerido para crear una empresa
export interface BodyCreateCompanyI {
    name: string;
    ruc: string;
    address: string;
    phone: string;
    email: string;
    parishId: number;
}

//Interfaz de respuesta de la API para cuando se crea una empresa
export interface ApiResponseCreateCompanyI {
    data: boolean;
    message: string;
    statusCode: number;
}


//Interfaz con el body requerido cuando es una empresa sin registrar a la que se envía el contrato
export interface ReceiverCompanyI {
    name: string;
    email: string;
    address: string;
    phone: string;
    parishId: string;
    ruc: string;
}