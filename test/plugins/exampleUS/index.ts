import { InitOptions, POSTALCODE, ServiceModule } from "../../../src/";
import { ServiceError } from "./errors/ServiceError";
import { defaults } from "./utils";

export interface ServiceOptions {}

export interface ServiceResponse {
  postal_code: string;
  country_code: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  state_code: string;
  province: string;
  province_code: string;
}

export class Service implements ServiceModule {
  private options: ServiceOptions | undefined;
  private postalCodeOptions: InitOptions | undefined;
  name: string;
  type: "Service";
  country: string;
  codeLength: number;

  constructor(options?: ServiceOptions) {
    this.name = "ExampleUS";
    this.country = "US";
    this.type = "Service";
    this.codeLength = 5;
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
    if (postalCodeClean === "30301") {
      return Promise.resolve({
        postal_code: "30301",
        country_code: "US",
        latitude: "33.84440000",
        longitude: "-84.47410000",
        city: "Atlanta",
        state: "Georgia",
        state_code: "GA",
        province: "Fulton",
        province_code: "121",
      } as ServiceResponse).then(this.extractCepValuesFromResponse);
    } else if (postalCodeClean === "99999") {
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
      postalcode: object.postal_code,
      state: object.state_code,
      city: object.city,
      neighborhood: object.province,
      street: "",
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
