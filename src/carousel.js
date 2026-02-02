import { CITIES } from "./constants.js";
import { DOMUtils, AnimationUtils } from "./utils.js";

// Carousel Component
export class Carousel {
  constructor(container, onIndexChange) {
    this.container = container;
    this.track = container.querySelector("#carouselTrack");
    this.currentIndex = 0;
    this.onIndexChange = onIndexChange;

    this.init();
  }

  init() {
    this.bindEvents();
    this.addSwipeSupport();
  }

  bindEvents() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    DOMUtils.addEventListeners(prevBtn, {
      click: () => this.previous(),
    });

    DOMUtils.addEventListeners(nextBtn, {
      click: () => this.next(),
    });

    // Keyboard navigation
    DOMUtils.addEventListeners(document, {
      keydown: (e) => {
        if (e.key === "ArrowLeft") this.previous();
        else if (e.key === "ArrowRight") this.next();
      },
    });
  }

  addSwipeSupport() {
    let startX = null;
    let startY = null;

    DOMUtils.addEventListeners(this.container, {
      touchstart: (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      touchend: (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = startX - endX;
        const diffY = startY - endY;

        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) this.next();
          else this.previous();
        }

        startX = null;
        startY = null;
      },
    });
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updatePosition();
    }
  }

  next() {
    if (this.currentIndex < CITIES.length - 1) {
      this.currentIndex++;
      this.updatePosition();
    }
  }

  goTo(index) {
    this.currentIndex = index;
    this.updatePosition();
  }

  updatePosition() {
    AnimationUtils.slideToIndex(this.track, this.currentIndex);
    this.updateNavigation();

    if (this.onIndexChange) {
      this.onIndexChange(this.currentIndex);
    }
  }

  updateNavigation() {
    this.updateNavigationButtons();
    this.updatePaginationDots();
    AnimationUtils.updateBackgroundForCity(CITIES[this.currentIndex].name);
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = this.currentIndex === 0;
    nextBtn.disabled = this.currentIndex === CITIES.length - 1;
  }

  updatePaginationDots() {
    const dots = document.querySelectorAll(".pagination-dot");
    dots.forEach((dot, index) => {
      DOMUtils.toggleClass(dot, "active", index === this.currentIndex);
    });
  }

  addCards(cards) {
    this.track.innerHTML = "";
    cards.forEach((card) => this.track.appendChild(card));
    this.updateNavigation();
  }
}

// Pagination Component
export class Pagination {
  constructor(container, onDotClick) {
    this.container = container;
    this.onDotClick = onDotClick;
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    CITIES.forEach((_, index) => {
      const dot = DOMUtils.createElement(
        "button",
        `pagination-dot ${index === 0 ? "active" : ""}`,
        "",
      );

      dot.setAttribute("aria-label", `Go to ${CITIES[index].name}`);

      DOMUtils.addEventListeners(dot, {
        click: () => this.onDotClick(index),
      });

      this.container.appendChild(dot);
    });
  }
}
