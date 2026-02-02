import { API_KEY, API_BASE_URL, CITIES } from "./constants.js";

// Weather API service
export class WeatherService {
  constructor() {
    this.cache = new Map();
  }

  async fetchCityWeather(city) {
    const cacheKey = `${city.name}-${city.country}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Current weather
      const currentResponse = await fetch(
        `${API_BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`,
      );

      if (!currentResponse.ok) {
        throw new Error(`Failed to fetch weather for ${city.name}`);
      }

      const currentData = await currentResponse.json();

      // 7-day forecast
      const forecastResponse = await fetch(
        `${API_BASE_URL}/onecall?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,alerts`,
      );

      if (!forecastResponse.ok) {
        throw new Error(`Failed to fetch forecast for ${city.name}`);
      }

      const forecastData = await forecastResponse.json();

      const result = {
        city: city.name,
        country: city.country,
        current: currentData,
        forecast: forecastData.daily.slice(1, 8), // Next 7 days
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching weather for ${city.name}:`, error);
      throw error;
    }
  }

  async fetchAllCitiesWeather() {
    const promises = CITIES.map((city) => this.fetchCityWeather(city));
    return Promise.all(promises);
  }

  generateMockData() {
    return CITIES.map((city, index) => ({
      city: city.name,
      country: city.country,
      current: {
        main: {
          temp: 20 + index * 5,
          feels_like: 22 + index * 5,
          humidity: 65 + index * 5,
          pressure: 1013 + index * 2,
          temp_min: 15 + index * 3,
          temp_max: 25 + index * 5,
        },
        weather: [
          {
            main: ["Clear", "Clouds", "Rain", "Clear", "Partly Cloudy"][index],
            description: [
              "sunny",
              "partly cloudy",
              "light rain",
              "clear sky",
              "few clouds",
            ][index],
            icon: ["01d", "02d", "09d", "01d", "02d"][index],
          },
        ],
        wind: {
          speed: 3.5 + index * 0.5,
        },
        visibility: 10000,
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        dt: Date.now() / 1000 + (i + 1) * 86400,
        temp: {
          max: 20 + index * 5 + Math.random() * 10,
          min: 15 + index * 3 + Math.random() * 5,
        },
        weather: [
          {
            main: ["Clear", "Clouds", "Rain", "Clear", "Partly Cloudy"][
              Math.floor(Math.random() * 5)
            ],
            description: ["sunny", "cloudy", "rainy", "clear", "partly cloudy"][
              Math.floor(Math.random() * 5)
            ],
            icon: ["01d", "02d", "09d", "01d", "02d"][
              Math.floor(Math.random() * 5)
            ],
          },
        ],
      })),
    }));
  }
}
