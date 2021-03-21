import { InitOptions, POSTALCODE, ServiceModule } from "../../../src/interface";
import { ServiceError } from "./errors/ServiceError";
import { defaults } from "./utils";

export interface ServiceOptions {}

export interface ServiceResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export class Service implements ServiceModule {
  private options: ServiceOptions | undefined;
  private postalCodeOptions: InitOptions | undefined;
  name: string;
  type: "Service";
  country: string;
  codeLength: number;

  constructor(options?: ServiceOptions) {
    this.name = "ExampleBR";
    this.country = "BR";
    this.type = "Service";
    this.codeLength = 8;
    this.init(options);
  }

  getDefaultsOptions(): ServiceOptions {
    return {};
  }

  init(
    options?: ServiceOptions | undefined,
    postalCodeOptions?: InitOptions | undefined
  ): this {
    this.options = defaults<ServiceOptions>(
      this.getDefaultsOptions(),
      options || {}
    );
    this.postalCodeOptions = postalCodeOptions;
    return this;
  }

  public async get(
    postalCodeClean: string //value return for cep
  ): Promise<POSTALCODE | ServiceError> {
    if (postalCodeClean === "46430000") {
      return Promise.resolve({
        cep: "46430-000",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "Guanambi",
        uf: "BA",
        ibge: "2911709",
        gia: "",
        ddd: "77",
        siafi: "3533",
      } as ServiceResponse).then(this.extractCepValuesFromResponse);
    } else if (postalCodeClean === "99999999") {
      return Promise.reject(
        new Error("Zip code not found on Example base.")
      ).catch(this.throwApplicationError);
    } else {
      return Promise.reject(
        new Error("Invalid code, check your code Example.")
      ).catch(this.throwApplicationError);
    }
  }

  private extractCepValuesFromResponse = (
    object: ServiceResponse
  ): POSTALCODE => {
    return {
      postalcode: object.cep!.replace("-", ""),
      state: object.uf,
      city: object.localidade,
      neighborhood: object.bairro,
      street: object.logradouro,
      service: this.name,
    };
  };

  private throwApplicationError = (error: Error): Promise<ServiceError> => {
    const serviceError = new ServiceError({
      message: error.message,
      service: this.name,
    });

    if (error.name === "FetchError") {
      serviceError.message = `Error connecting to ${this.name} service.`;
    }

    throw serviceError;
  };
}

export default Service;
