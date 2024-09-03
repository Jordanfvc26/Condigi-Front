//Interfaz de respuesta de la API para obtener el listado de personas a generarles contrato
export interface ApiResponseGetPersonsForGenerateContract{
    data: InfoPersonForSendContractI[];
    message: string;
    statusCode: number;
    error?: string;
}

//Interfaz que lista la información de las personas que están registradas en la APP para enviarles contratos
export interface InfoPersonForSendContractI {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    parishId: number;
    identification: string;
    address: string;
}

//Interfaz con el body requerido cuando es una persona sin registrar a la que se generará el contrato
export interface ReceiverPersonI {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    identification: string;
    address: string;
}