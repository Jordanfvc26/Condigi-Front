//Interfaz de respuesta de la API para cuando se obtienen las Provincias, Cantones y Parroquias
export interface ApiResponseGetGeographyI {
    data: InfoGeographyI[];
    message: string;
    statusCode: number;
}

//Interfaz que contiene la información de las Provincias, Cantones y Parroquias
export interface InfoGeographyI {
    id: number;
    name: string;
}
