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
  timeout: number;
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

import PostalCodeError from "./utils/errors/PostalCodeError";
import { defaults } from "./utils/index";
import Promise from "./utils/Promise.any";

interface Config {
  timeout?: number;
  postalCodeSize?: number;
  country?: string;
}

interface MergedConfig {
  timeout: number;
  postalCodeSize: number;
  country: string;
}

class PostalCode {
  private config: MergedConfig;
  private providers: ServiceModule[];
  private filteredProviders: ServiceModule[];

  constructor(config: Config = {}) {
    this.config = defaults<MergedConfig>(this.getDefaultsOptions(), config);
    this.providers = []; //emply
    this.filteredProviders = []; //emply
  }

  private getDefaultsOptions = (): MergedConfig => {
    return {
      country: "*", //allProviders country.
      postalCodeSize: 8, //its not defined, get by providers.
      timeout: 20000, //20 segunds
    };
  };

  public use = <T>(
    Service: INewableService,
    serviceOptions?: T
  ): PostalCode => {
    if (!Service) {
      throw new Error(
        "You are passing an undefined plugin, Please check the plugin you are passing to postalCode.use()."
      );
    }

    const plugin = new Service();

    if (!plugin.type) {
      throw new Error(
        "You are passing an undefined plugin type, Please check the object you are passing to postalCode.use()."
      );
    }

    if (plugin.type === "Service") {
      plugin.init(serviceOptions);
      this.providers.push(plugin);
    } else {
      throw new Error("Check the type of plugin passed to postalCode.use().");
    }
    return this;
  };

  public get = (
    postalCode: string | number,
    country?: string
  ): Promise<POSTALCODE | PostalCodeError | ServiceError> => {
    if (country !== undefined && country!.length > 0) {
      this.filteredProviders = this.providers.filter(
        (service) => service.country === country
      );
    } else {
      this.filteredProviders = this.providers; //find in all providers
    }

    this.filteredProviders.length > 0 &&
      (this.config.postalCodeSize = this.filteredProviders
        .map((service) => service.codeLength)
        .reduce((previous, current) =>
          previous > current ? previous : current
        ));

    return Promise.resolve(postalCode)
      .then(this.checkValid)
      .then(this.cleanInvalidChar)
      .then(this.checkInputLength)
      .then(this.leftPadWithZeros)
      .then(this.getPostalCode)
      .catch(this.handlePostalCodeError)
      .catch(this.otherPostalCodeError);
  };

  private checkValid = (value: string | number): string => {
    if (typeof value === "number" || typeof value === "string") {
      return value.toString();
    }
    throw new Error("no valid string or number");
  };

  private cleanInvalidChar = (value: string): string => {
    return value.replace(/\D+/g, "");
  };

  private checkInputLength = (value: string): string => {
    if (value.length > 0 && value.length <= this.config.postalCodeSize) {
      return value;
    }
    throw new Error("insert valid postalcode");
  };

  private leftPadWithZeros = (value: string): string => {
    return "0".repeat(this.config.postalCodeSize - value.length) + value;
  };

  private getPostalCode = (
    postalCode: string
  ): Promise<POSTALCODE | ServiceError> => {
    if (this.filteredProviders.length > 0) {
      return Promise.any<POSTALCODE | ServiceError>(
        this.filteredProviders.map((service) => service.get(postalCode))
      );
    }

    throw new Error(
      "input one or more providers plugin, invoke postalcode.use(Provider)."
    );
  };

  private handlePostalCodeError = (
    errors: Error | ServiceError[]
  ): PostalCodeError => {
    if (Array.isArray(errors) && errors.length !== undefined) {
      throw new PostalCodeError({
        message: "All providers retunerd errors.",
        type: "ProvidersErrors",
        country: this.config.country,
        errors: errors,
      });
    }
    throw errors;
  };

  private otherPostalCodeError = (errors: PostalCodeError): PostalCodeError => {
    if (errors.errors?.length > 0) {
      throw errors;
    }

    throw new PostalCodeError({
      message: errors.message,
      type: "Error",
      country: this.config.country,
    });
  };
}
export default PostalCode;
