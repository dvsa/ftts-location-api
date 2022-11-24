import { ValidationErrors } from '../enums';

class ValidationError extends Error {
  constructor(public validationErrors: ValidationErrors[]) {
    super('Validation Error');
  }
}

export { ValidationError };
