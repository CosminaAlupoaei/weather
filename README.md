# Weather Widget

# About

A responsive, mobile-first weather widget that displays current weather conditions and 7-day forecasts for 5 major cities: London, Milan, Bangkok, Los Angeles, and Nairobi.

Features:

-Weather data for 5 major cities worldwide
-Responsive layout optimized for mobile devices
-Smooth navigation between cities without external plugins
-Current conditions, 7-day forecast, and weather details
-Polished UI with CSS transitions and animations
-Keyboard navigation, ARIA labels, and focus management
-Clean, glassmorphism-inspired interface
-Swipe gestures for mobile navigation

# File Structure

```
weather/
├── index.html              # Main HTML structure
├── src/
│   ├── main.js             # Main application entry point and orchestration
│   ├── components.js       # Weather card, loading, and error components
│   ├── carousel.js         # Carousel navigation and pagination components
│   ├── weather-service.js  # Weather API service with caching
│   ├── constants.js        # API configuration, cities, and weather icons
│   ├── utils.js           # Date, DOM, and animation utility functions
│   └── style.css          # Complete CSS styling with responsive design
├── package.json           # Project configuration and dependencies
└── README.md             # This documentation
```

### Technical Stack

-Vanilla JavaScript (ES6+)
-Pure CSS with CSS Custom Properties
-Vite
-OpenWeatherMap (with mock data fallback)

## 🚀 Setup Instructions

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn package manager

### Installation

1. **Clone or download the project**

   ```bash
   # Navigate to project directory
   cd weather
   ```

````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The widget will load with mock data by default

### Production Build

```bash
npm run build
npm run preview
```


## Design Decisions

### 1. **Mobile-First Approach**

- Started design from mobile (320px+) and enhanced for larger screens
- Used CSS Grid and Flexbox for responsive layouts
- Implemented touch gestures for mobile navigation

### 2. **Performance Optimizations**

- Efficient carousel implementation using CSS transforms
- Lazy loading of weather data
- Optimized animations with `will-change` properties
- Reduced motion support for accessibility

### 3. **Accessibility Features**

- Semantic HTML structure with proper headings
- ARIA labels for screen readers
- Keyboard navigation support (arrow keys)
- Focus management and high contrast support
- Reduced motion preferences respected

### 4. **User Experience**

- Loading states with skeleton animations
- Error handling with retry functionality
- Smooth transitions between cities
- Visual feedback for all interactions
- Progressive enhancement approach

### 5. **CSS Architecture**

- CSS Custom Properties for maintainable theming
- BEM-like naming conventions
- Mobile-first media queries
- Glassmorphism design trend implementation

## 🎨 Styling Approach

### Design System

- **Colors**: Blue-purple gradient background with clean white cards
- **Typography**: Inter font family for modern, readable text
- **Spacing**: Consistent scale using CSS custom properties
- **Shadows**: Layered shadows for depth and glassmorphism effect
- **Animations**: Smooth transitions with easing functions

### Responsive Breakpoints

- **Mobile**: < 480px (single column, stacked forecast)
- **Tablet**: 481px - 767px (enhanced spacing)
- **Desktop**: > 768px (two-column layout, side-by-side content)
- **Large Desktop**: > 1024px (optimized proportions)


### Core Functionality

- **Weather Data Management**: Centralized data fetching and state management
- **Carousel Navigation**: Custom implementation with smooth transitions
- **Pagination System**: Visual dots with active state management
- **Error Handling**: Comprehensive error states with retry mechanisms

### UI Components

- **Weather Cards**: Modular design showing current conditions and forecasts
- **Navigation Controls**: Previous/next buttons with proper disabled states
- **Loading States**: Skeleton animations during data fetching
- **Responsive Layout**: Adaptive grid systems for different screen sizes

### User Interactions

- **Button Navigation**: Previous/next city navigation
- **Dot Navigation**: Direct navigation to specific cities
- **Keyboard Support**: Arrow key navigation
- **Touch Gestures**: Swipe navigation on touch devices

## State Management

The widget uses a simple class-based approach for state management:

- **Current Index**: Tracks active city
- **Weather Data**: Stores fetched/mock weather information
- **Loading State**: Manages loading, error, and success states
- **UI Updates**: Synchronized updates across all UI components

## Performance Considerations

- **CSS Transitions**: Hardware-accelerated transforms
- **Efficient Reflows**: Minimal DOM manipulation
- **Image Optimization**: Icon fonts instead of image files
- **Bundle Size**: Pure vanilla JavaScript, no framework overhead

## Accessibility Features

- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full functionality without mouse
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user preferences for motion
- **High Contrast**: Proper contrast ratios and high contrast mode support

## Future Enhancements

- **Geolocation Support**: Automatic local weather detection
- **Hourly Forecasts**: More detailed time-based predictions
- **Weather Alerts**: Severe weather notifications
- **Favorite Cities**: User-customizable city list
- **Theme Options**: Light/dark mode toggle
- **Weather Maps**: Integration with weather visualization

````
