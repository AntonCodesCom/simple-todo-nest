import { ValidatorOptions } from 'class-validator';

/**
 * Defines the global in-app strategy of rejecting
 * requests with bodies containing unknown properties.
 */
const validatorOptions: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
};

export default validatorOptions;
