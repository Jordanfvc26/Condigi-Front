import { PaginationI } from "../../shared/interfaces/pagination"

//Interfaz de respuesta de la API para obtener los tipos de contratos
export interface ApiResponseGetContractTypesI {
    pagination: PaginationI
    data: ContractTypeI[];
    message: string;
    statusCode: number;
}

//Interfaz con la información de un tipo de contrato
export interface ContractTypeI {
    contractTypeId: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}