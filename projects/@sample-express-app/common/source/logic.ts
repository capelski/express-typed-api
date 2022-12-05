import { Validation } from './types';

const minimumCharacters = 3;

export const validateCityName = (cityName: string | undefined): Validation => {
  return !cityName
    ? { valid: false, message: 'Missing city name' }
    : cityName.length < minimumCharacters
    ? { valid: false, message: `City name must have at least ${minimumCharacters} characters` }
    : { valid: true };
};
