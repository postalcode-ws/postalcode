export interface ServiceErrorInput {
  message: string;
  service: string;
}

export declare class ServiceError extends Error {
  service: string;
  constructor({ message, service }: ServiceErrorInput);
}

export interface POSTALCODE {
  postalcode: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  service: string;
}

export interface InitOptions {
  timeOut: number;
}

export interface Module {
  type: "Service";
  name: string;
  country: string;
  codeLength: number;
}

export interface ServiceModule extends Module {
  init<T>(options?: T, postalCodeOptions?: InitOptions): this;
  get(postalCodeClean: string): Promise<POSTALCODE | ServiceError>;
}

export interface INewableService {
  new (): ServiceModule;
}
