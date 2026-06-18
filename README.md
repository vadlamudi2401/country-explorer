# Country Explorer Portal

A dynamic, responsive front-end web application built with vanilla JavaScript, HTML5, and CSS3. This application allows users to explore data from various countries around the world, filter through records seamlessly, and view detailed metrics for individual nations via a dedicated details portal page.

## 🚀 Live Demo
🔗 [View Live Application](https://vadlamudi2401.github.io/country-explorer/)

---

## 🛠️ Features Implemented

- **Dynamic Grid Layout:** Renders country cards in a clean, fully responsive 4-column layout utilizing CSS Grid (`1fr 1fr 1fr 1fr`).
- **Advanced Real-Time Filtering:** - **Search by Name:** Case-insensitive search matching both *common* and *official* country names.
  - **Region Filter:** Dropdown filtering by continent boundaries with an "All Regions" bypass logic state.
  - **Population Filter:** Minimum population floor filter with custom boundary validations up to 1.5 billion.
- **Dynamic Pagination:** Implements a "Show More" interaction system that loads an initial batch of 12 cards on startup and increments the view cleanly by 8 items per click.
- **Two-Column Details Portal:** Clicking any country card safe-encodes complex objects (currencies, languages) into browser query strings and renders them in an organized two-column view complete with a dynamic back navigation module.

---

## 📂 Project Structure

- `index.html` - Main dashboard view portal layout.
- `details.html` - Secondary single country profile detail sheet.
- `script.js` - Logic management for card population, tracking, and filters.
- `details.js` - Logic management for parameter decoding and back redirection.
- `style.css` - Core global stylesheet management matching assignment specs.
- `data.js` - Local raw JavaScript object data arrays (27 countries).
- `assets/` - High-resolution country flags and system icons.