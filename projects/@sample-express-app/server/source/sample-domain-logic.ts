import { EndpointResponse } from '@express-typed-api/common';
import { WeatherIcons, Weather, validateCityName } from '@sample-express-app/common';

export const getRandomWeather = (): Weather => ({
  icon: randomWeatherIcon(),
  maxTemperature: randomFloat(20, 40),
  minTemperature: randomFloat(0, 20),
  temperature: randomFloat(10, 30),
  windSpeed: randomFloat(0, 10),
});

const randomFloat = (min: number, max: number, decimals = 2) => {
  const randomNumber = Math.random() * (max - min + 1) + min;
  const roundFactor = Math.pow(10, decimals);
  return Math.round(randomNumber * roundFactor) / roundFactor;
};

const randomWeatherIcon = () => {
  const icons = Object.values(WeatherIcons) as WeatherIcons[];
  return icons[Math.floor(Math.random() * icons.length)];
};

export const weatherLogic = (cityName: string | undefined) => {
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    return new EndpointResponse({ errorMessage: cityNameValidation.message }, 400);
  }
  return new EndpointResponse(getRandomWeather());
};
