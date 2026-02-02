import "./style.css";
import { API_KEY } from "./constants.js";
import { WeatherService } from "./weather-service.js";
import { WeatherCard, LoadingComponent, ErrorComponent } from "./components.js";
import { Carousel, Pagination } from "./carousel.js";

// Main Weather Application
class WeatherApp {
  constructor() {
    this.weatherService = new WeatherService();
    this.isLoading = false;

    this.init();
  }

  async init() {
    this.setupComponents();
    await this.loadWeatherData();
  }

  setupComponents() {
    // Initialize loading component
    this.loadingComponent = new LoadingComponent(
      document.getElementById("loadingState"),
    );

    // Initialize error component
    this.errorComponent = new ErrorComponent(
      document.getElementById("errorState"),
      () => this.loadWeatherData(),
    );

    // Initialize carousel
    this.carousel = new Carousel(
      document.querySelector(".carousel-container"),
      (index) => this.onCityChange(index),
    );

    // Initialize pagination
    this.pagination = new Pagination(
      document.getElementById("paginationDots"),
      (index) => this.carousel.goTo(index),
    );
  }

  onCityChange(index) {
    // Handle city change if needed
    console.log(`Switched to city index: ${index}`);
  }

  async loadWeatherData() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      let weatherData;

      // Check if we should use real API or mock data
      if (!API_KEY || API_KEY === "your_openweathermap_api_key") {
        weatherData = this.weatherService.generateMockData();
      } else {
        weatherData = await this.weatherService.fetchAllCitiesWeather();
      }

      this.renderWeatherCards(weatherData);
      this.hideLoading();
    } catch (error) {
      console.error("Error loading weather data:", error);
      this.showError();
    } finally {
      this.isLoading = false;
    }
  }

  renderWeatherCards(weatherData) {
    const cards = weatherData.map((data) => {
      const card = new WeatherCard(data);
      return card.render();
    });

    this.carousel.addCards(cards);
  }

  showLoading() {
    this.loadingComponent.show();
    this.hideCarousel();
    this.errorComponent.hide();
  }

  hideLoading() {
    this.loadingComponent.hide();
    this.showCarousel();
    this.errorComponent.hide();
  }

  showError() {
    this.errorComponent.show();
    this.hideCarousel();
    this.loadingComponent.hide();
  }

  showCarousel() {
    document.querySelector(".cities-carousel").style.display = "block";
  }

  hideCarousel() {
    document.querySelector(".cities-carousel").style.display = "none";
  }
}

// Initialize the weather app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp();
});
