interface ServiceErrorInput {
    message: string;
    service: string;
}
declare class ServiceError extends Error {
    service: string;
    constructor({ message, service }: ServiceErrorInput);
}
interface POSTALCODE {
    postalcode: string;
    state: string;
    city: string;
    street: string;
    neighborhood: string;
    service: string;
}
interface InitOptions {
    timeOut: number;
}
interface Module {
    type: "Service";
    name: string;
    country: string;
    codeLength: number;
}
interface ServiceModule extends Module {
    init<T>(options?: T, postalCodeOptions?: InitOptions): this;
    get(postalCodeClean: string): Promise<POSTALCODE | ServiceError>;
}
interface INewableService {
    new (): ServiceModule;
}

interface PostalCodeError {
    message: string;
    type: string;
    country: string;
    errors: ServiceError[];
}
declare class PostalCodeError extends Error {
    constructor({ message, type, errors, country, }: {
        message: string;
        type: string;
        errors?: ServiceError[];
        country: string;
    });
}

var Promise$1 = Promise;

interface Config {
    timeout?: number;
    postalCodeSize?: number;
    country?: string;
}
declare class PostalCode {
    private config;
    private providers;
    private filteredProviders;
    constructor(config?: Config);
    private getDefaultsOptions;
    use: <T>(Service: INewableService, serviceOptions?: T | undefined) => PostalCode;
    get: (postalCode: string | number, country?: string | undefined) => Promise$1<POSTALCODE | PostalCodeError | ServiceError>;
    private checkValid;
    private cleanInvalidChar;
    private checkInputLength;
    private leftPadWithZeros;
    private getPostalCode;
    private handlePostalCodeError;
    private otherPostalCodeError;
}

export default PostalCode;
export { INewableService, InitOptions, Module, POSTALCODE, PostalCode, ServiceError, ServiceErrorInput, ServiceModule };
