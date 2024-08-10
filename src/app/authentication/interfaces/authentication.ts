//Interfaz con el body requerido para registrar un nuevo usuario
export interface BodyRegisterUserI {
    person: {
        firstName: string;
        lastName: string;
        identification: string;
        phone: string;
        parishId: number;
        address: string;
    },
    user: {
        username: string;
        password: string;
        email: string;
        userType: number;
    }
}

//Interfaz de respuesta de la API para cuando se registra un nuevo usuario
export interface ApiResponseRegisterUserI {
    data: boolean;
    message: string;
    statusCode: number;
}

//Interfaz con el body requerido para inciar sesión
export interface BodyLoginUser {
    username: string;
    password: string;
}

//Interfaz de respuesta de la API para cuando se inicia sesión
export interface ApiResponseLoginUser {
    data: {
        token: string;
        user: {
            name: string;
            email: string;
            role: string;
        }
    },
    message: string;
    statusCode: number;
}