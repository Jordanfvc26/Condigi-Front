import { PaginationI } from "../../shared/interfaces/pagination"
import { ReceiverCompanyI } from "./companies";
import { ReceiverPersonI } from "./persons";

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

//Interfaz con el body requerido para generar un contrato con IA
export interface BodyForGenerateContractWithIAI {
    contractTypeId: string;
    startDate: string;
    endDate: string;
    numClauses: number;
    paymentAmount: number;
    paymentFrequency: number;
    status: number;
    contractDetails: string;
    contractObjects: string;
    contractConfidentiality: string;
    senderId?: string;
    senderType: number;
    receiverType: number; //0 para empresa y 1 para persona
    receiverId?: string;
    receiverCompany?: ReceiverCompanyI;
    receiverPerson?: ReceiverPersonI;
}

//Interfaz de respuesta de la API para cuando se genera un contrato con IA
export interface ApiResponseGenerateContractWithIAI {
    data: string; //ID del contrato generado
    message: string;
    statusCode: number;
}



//Interfaz de respuesta de la API para obtener la información de un contrato por su ID
export interface ApiResponseGetInfoContractI {
    data: {
        contractId: string;
        content: string; //Aquí se almcenará la información del contrato
        contractTypeId: string;
        startDate: string;
        endDate: string;
        numClauses: number;
        paymentAmount: number;
        paymentFrequency: number;
        status: number;
        createdAt: string;
        createdBy: string;
        updatedAt: string;
        updatedBy: string;
        contractParticipants: ContractParticipantI[];
    },
    message: string;
    statusCode: number;
    error?: string;
}

//Interfaz con la información de un participante de un contrato
export interface ContractParticipantI {
    contractParticipantId: string;
    contractId: string;
    userId: string;
    status: boolean
    role: number;
    signed: boolean;
}



//Interfaz con el body requerido para actualizar la información de un contrato
export interface BodyForUpdateInfoContractI {
    contractTypeId: string;
    startDate: string;
    endDate: string;
    numClauses: number;
    paymentAmount: number;
    paymentFrequency: number;
    status: number;
    companyId?: string | null;
    content: string;
}

//Interfaz de respuesta de la API para cuando se actualiza la información de un contrato
export interface ApiResponseUpdateContractI {
    data: boolean;
    message: string;
    statusCode: number;
    error?: string;
}


//Interfaz de respuesta de la API para obtener los contratos de un usuario
export interface ApiResponseGetMyContractsI {
    pagination: PaginationI;
    data: ContractI[];
    message: string;
    statusCode: number;
    error?: string;
}

//Interfaz con la información de un contrato
export interface ContractI {
    contractId: string;
    content: string;
    contractType: ContractTypeI;
    startDate: string;
    endDate: string;
    numClauses: number;
    paymentAmount: number;
    paymentFrequency: number;
    status: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    contractParticipants: ContractParticipantI;
}


//Interfaz con el body requerido para agregar un firmante (persona o empresa) al contrato
export interface BodyForAddSignatoryI {
    contractId: string;
    userId: string;
}

//Interfaz de respuesta de la API para cuando se agrega un firmante al documento
export interface ApiResponseAddSignatoryI {
    data: boolean;
    message: string;
    statusCode: number;
    error?: string;
}