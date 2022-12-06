export const fetchWeather = async (cityName: string) => {
  const response = await fetch(`/api/weather/${cityName}`, { method: 'get' });
  const payload = await response.json();
  if ('errorMessage' in payload) {
    // Deal with validation errors
  } else {
    // Deal with weather data
  }
};
