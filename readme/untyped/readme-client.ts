export const fetchWeather = async (cityName: string) => {
  const response = await fetch(`/api/weather/${cityName}`, { method: 'get' });
  const payload = await response.json();
  if ('errorMessage' in payload) {
    console.error(payload);
    // Deal with validation errors
  } else {
    console.log(payload);
    // Deal with weather data
  }
};
