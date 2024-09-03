//Interfaz de respuesta de la API para obtener el listado de compañías del usuario logueado
export interface ApiResponseGetCompaniesByUserI {
    data: DataCompanyI[];
    message: string;
    statusCode: number;
    error?: string;
}

//Inteefaz con la información de una compañía
export interface DataCompanyI {
    companyId: string;
    companyName: string;
    ruc: string;
    phone: string;
    email: string;
    address: string;
    parishId: number;
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

//Interfaz de respuesta de la API para obtener el listado de empresas disponibles para generarles un contrato
export interface ApiResponseGetCompaniesForGenerateContractI {
    data: DataCompanyForGenerateContractI[];
    message: string;
    statusCode: number;
}

//Interfaz con la información de una empresa para generar un contrato
export interface DataCompanyForGenerateContractI {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    parishId: number;
    ruc: string;
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