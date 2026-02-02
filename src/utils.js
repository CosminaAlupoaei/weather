// Utility functions for weather app
export class DateUtils {
  static formatDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static formatForecastDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
  }
}

export class DOMUtils {
  static createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  }

  static toggleClass(element, className, force) {
    element.classList.toggle(className, force);
  }

  static addEventListeners(element, events) {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  }
}

export class AnimationUtils {
  static slideToIndex(track, index) {
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;
  }

  static updateBackgroundForCity(cityName) {
    const className = cityName.toLowerCase().replace(" ", "-");
    document.body.className = className;
  }
}
