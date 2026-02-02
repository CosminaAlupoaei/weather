import { WEATHER_ICONS } from "./constants.js";
import { DateUtils, DOMUtils } from "./utils.js";

// Weather Card Component
export class WeatherCard {
  constructor(data) {
    this.data = data;
  }

  render() {
    const card = DOMUtils.createElement("div", "weather-card");
    const current = this.data.current;
    const weather = current.weather[0];
    const icon = WEATHER_ICONS[weather.icon] || "🌤️";

    // Calculate min/max from forecast or current data
    const tempRange =
      this.data.forecast && this.data.forecast.length > 0
        ? `${Math.round(this.data.forecast[0].temp.min)}°/${Math.round(this.data.forecast[0].temp.max)}°`
        : `${Math.round(current.main.temp_min || current.main.temp - 5)}°/${Math.round(current.main.temp_max || current.main.temp + 5)}°`;

    card.innerHTML = `
      <div class="weather-card-header">
        <h2 class="city-name">${this.data.city}</h2>
        <p class="current-date">${DateUtils.formatDate(new Date())}</p>
      </div>
      
      <div class="current-weather">
        <span class="weather-icon">${icon}</span>
        <div class="temperature">${Math.round(current.main.temp)}°</div>
        <div class="weather-description">${weather.description}</div>
        <div class="temp-range">${tempRange}</div>
      </div>
      
      ${this._renderWeatherDetails(current)}
      ${this._renderChart()}
      ${this._renderForecast()}

    `;

    return card;
  }

  _renderWeatherDetails(current) {
    return `
      <div class="weather-details">
        <div class="weather-detail">
          <div class="detail-label">Feels like</div>
          <div class="detail-value">${Math.round(current.main.feels_like)}°</div>
        </div>
        <div class="weather-detail">
          <div class="detail-label">Humidity</div>
          <div class="detail-value">${current.main.humidity}%</div>
        </div>
        <div class="weather-detail">
          <div class="detail-label">Wind</div>
          <div class="detail-value">${Math.round(current.wind.speed)} m/s</div>
        </div>
        <div class="weather-detail">
          <div class="detail-label">Pressure</div>
          <div class="detail-value">${current.main.pressure}</div>
        </div>
      </div>
    `;
  }

  _renderForecast() {
    const forecastItems = this.data.forecast
      .map(
        (day) => `
        <div class="forecast-item">
          <div class="forecast-day">${DateUtils.formatForecastDay(day.dt)}</div>
          <span class="forecast-icon">${WEATHER_ICONS[day.weather[0].icon] || "🌤️"}</span>
          <div class="forecast-temp-high">${Math.round(day.temp.max)}°</div>
          <div class="forecast-temp-low">${Math.round(day.temp.min)}°</div>
        </div>
      `,
      )
      .join("");

    return `
      <div class="forecast-section">
        <h3 class="forecast-title">7-Day Forecast</h3>
        <div class="forecast-list">
          ${forecastItems}
        </div>
      </div>
    `;
  }

  _renderChart() {
    if (!this.data.forecast || this.data.forecast.length === 0) {
      return "";
    }

    const chart = new TemperatureChart(this.data.forecast);
    const chartElement = chart.render();
    return chartElement.outerHTML;
  }
}

// Loading Component
export class LoadingComponent {
  constructor(container) {
    this.container = container;
  }

  show() {
    this.container.classList.add("active");
  }

  hide() {
    this.container.classList.remove("active");
  }

  render() {
    return `
      <div class="loading-spinner"></div>
      <p>Loading weather data...</p>
    `;
  }
}

// Error Component
export class ErrorComponent {
  constructor(container, onRetry) {
    this.container = container;
    this.onRetry = onRetry;
  }

  show() {
    this.container.classList.add("active");
    this._bindRetryButton();
  }

  hide() {
    this.container.classList.remove("active");
  }

  _bindRetryButton() {
    const retryBtn = this.container.querySelector("#retryBtn");
    if (retryBtn && this.onRetry) {
      retryBtn.addEventListener("click", this.onRetry);
    }
  }

  render() {
    return `
      <div class="error-icon">⚠️</div>
      <p>Unable to load weather data</p>
      <button class="retry-btn" id="retryBtn">Try Again</button>
    `;
  }
}

// Temperature Chart Component
export class TemperatureChart {
  constructor(forecastData) {
    this.forecastData = forecastData;
    this.width = 340;
    this.height = 120;
    this.padding = { top: 20, right: 20, bottom: 30, left: 20 };
  }

  render() {
    const chartContainer = DOMUtils.createElement("div", "temperature-chart");

    if (!this.forecastData || this.forecastData.length === 0) {
      chartContainer.innerHTML =
        '<p class="chart-error">No forecast data available</p>';
      return chartContainer;
    }

    const svg = this._createSVG();
    const { maxTemps, minTemps } = this._extractTemperatures();
    const { maxPath, minPath, gradientId } = this._createPaths(
      maxTemps,
      minTemps,
    );

    svg.innerHTML = `
      <defs>
        ${this._createGradients(gradientId)}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
        </filter>
      </defs>
      
      <!-- Background area -->
      <path d="${minPath} L ${this.width - this.padding.right} ${this.height - this.padding.bottom} L ${this.padding.left} ${this.height - this.padding.bottom} Z" 
            fill="url(#${gradientId})" 
            opacity="0.3"/>
      
      <!-- Temperature lines -->
      <path d="${maxPath}" 
            stroke="#ff6b35" 
            stroke-width="3" 
            fill="none" 
            filter="url(#shadow)"
            class="temp-line max-temp">
        <animate attributeName="stroke-dasharray" 
                 values="0,1000;1000,0" 
                 dur="1.5s" 
                 fill="freeze"/>
      </path>
      
      <path d="${minPath}" 
            stroke="#4fc3f7" 
            stroke-width="3" 
            fill="none" 
            filter="url(#shadow)"
            class="temp-line min-temp">
        <animate attributeName="stroke-dasharray" 
                 values="0,1000;1000,0" 
                 dur="1.5s" 
                 begin="0.3s" 
                 fill="freeze"/>
      </path>
      
      <!-- Temperature points -->
      ${this._createTemperaturePoints(maxTemps, minTemps)}
      
      <!-- Day labels -->
      ${this._createDayLabels()}
    `;

    chartContainer.appendChild(svg);
    return chartContainer;
  }

  _createSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.width);
    svg.setAttribute("height", this.height);
    svg.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
    svg.setAttribute("class", "temperature-chart-svg");
    return svg;
  }

  _extractTemperatures() {
    const maxTemps = this.forecastData
      .slice(0, 7)
      .map((day) =>
        day.temp ? day.temp.max : day.main?.temp_max || day.main?.temp || 20,
      );
    const minTemps = this.forecastData
      .slice(0, 7)
      .map((day) =>
        day.temp ? day.temp.min : day.main?.temp_min || day.main?.temp || 10,
      );
    return { maxTemps, minTemps };
  }

  _createPaths(maxTemps, minTemps) {
    const allTemps = [...maxTemps, ...minTemps];
    const minTemp = Math.min(...allTemps) - 2;
    const maxTemp = Math.max(...allTemps) + 2;
    const tempRange = maxTemp - minTemp;

    const stepX =
      (this.width - this.padding.left - this.padding.right) /
      (maxTemps.length - 1);

    const getY = (temp) => {
      const normalizedTemp = (temp - minTemp) / tempRange;
      return (
        this.height -
        this.padding.bottom -
        normalizedTemp * (this.height - this.padding.top - this.padding.bottom)
      );
    };

    const maxPath = this._createSmoothPath(maxTemps, stepX, getY);
    const minPath = this._createSmoothPath(minTemps, stepX, getY);

    return {
      maxPath,
      minPath,
      gradientId: `temperatureGradient${Date.now()}`,
    };
  }

  _createSmoothPath(temps, stepX, getY) {
    if (temps.length === 0) return "";

    let path = `M ${this.padding.left} ${getY(temps[0])}`;

    for (let i = 1; i < temps.length; i++) {
      const x = this.padding.left + i * stepX;
      const y = getY(temps[i]);

      if (i === 1) {
        path += ` L ${x} ${y}`;
      } else {
        const prevX = this.padding.left + (i - 1) * stepX;
        const prevY = getY(temps[i - 1]);
        const cpX1 = prevX + stepX * 0.4;
        const cpX2 = x - stepX * 0.4;
        path += ` C ${cpX1} ${prevY} ${cpX2} ${y} ${x} ${y}`;
      }
    }

    return path;
  }

  _createGradients(gradientId) {
    return `
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#4fc3f7;stop-opacity:0.8" />
      </linearGradient>
    `;
  }

  _createTemperaturePoints(maxTemps, minTemps) {
    const allTemps = [...maxTemps, ...minTemps];
    const minTemp = Math.min(...allTemps) - 2;
    const maxTemp = Math.max(...allTemps) + 2;
    const tempRange = maxTemp - minTemp;
    const stepX =
      (this.width - this.padding.left - this.padding.right) /
      (maxTemps.length - 1);

    const getY = (temp) => {
      const normalizedTemp = (temp - minTemp) / tempRange;
      return (
        this.height -
        this.padding.bottom -
        normalizedTemp * (this.height - this.padding.top - this.padding.bottom)
      );
    };

    let points = "";

    // Max temperature points
    maxTemps.forEach((temp, index) => {
      const x = this.padding.left + index * stepX;
      const y = getY(temp);
      points += `
        <circle cx="${x}" cy="${y}" r="4" fill="#ff6b35" stroke="white" stroke-width="2" class="temp-point max-point">
          <animate attributeName="r" values="0;4" dur="0.5s" begin="${1.5 + index * 0.1}s" fill="freeze"/>
        </circle>
        <text x="${x}" y="${y - 10}" text-anchor="middle" class="temp-label max-label" opacity="0">
          ${Math.round(temp)}°
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="${2 + index * 0.1}s" fill="freeze"/>
        </text>
      `;
    });

    // Min temperature points
    minTemps.forEach((temp, index) => {
      const x = this.padding.left + index * stepX;
      const y = getY(temp);
      points += `
        <circle cx="${x}" cy="${y}" r="4" fill="#4fc3f7" stroke="white" stroke-width="2" class="temp-point min-point">
          <animate attributeName="r" values="0;4" dur="0.5s" begin="${1.8 + index * 0.1}s" fill="freeze"/>
        </circle>
        <text x="${x}" y="${y + 20}" text-anchor="middle" class="temp-label min-label" opacity="0">
          ${Math.round(temp)}°
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="${2.3 + index * 0.1}s" fill="freeze"/>
        </text>
      `;
    });

    return points;
  }

  _createDayLabels() {
    const stepX =
      (this.width - this.padding.left - this.padding.right) /
      (this.forecastData.length - 1);
    let labels = "";

    this.forecastData.slice(0, 7).forEach((day, index) => {
      const x = this.padding.left + index * stepX;
      const dayName = day.dt
        ? new Date(day.dt * 1000).toLocaleDateString("en", { weekday: "short" })
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index];

      labels += `
        <text x="${x}" y="${this.height - 5}" text-anchor="middle" class="day-label" opacity="0">
          ${dayName}
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="${0.5 + index * 0.1}s" fill="freeze"/>
        </text>
      `;
    });

    return labels;
  }
}
