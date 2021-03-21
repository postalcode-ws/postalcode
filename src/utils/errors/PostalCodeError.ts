import { ServiceError } from "../../interface";

export interface PostalCodeError {
  message: string;
  type: string;
  country: string;
  errors: ServiceError[];
}

export class PostalCodeError extends Error {
  constructor({
    message,
    type,
    errors,
    country,
  }: {
    message: string;
    type: string;
    errors?: ServiceError[];
    country: string;
  }) {
    super();
    this.message = message;
    this.name = "PostalCodeError";
    this.type = type;
    this.country = country;
    if (errors) {
      this.errors = errors;
    }
  }
}

export default PostalCodeError;
