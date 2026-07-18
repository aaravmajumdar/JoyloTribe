# JOYLO — Travel Well

JOYLO is a premium, modern, and highly interactive travel agency web application. The website is styled around luxury retreats, curated journeys, and a personalized traveler lifestyle. It features high-quality assets, a glassmorphic user interface, and an interactive itinerary generator engine built in vanilla web technologies (HTML5, CSS3, ES6 JavaScript).

---

## 🎨 Branding & Design System

The layout is built from the ground up using custom branding extracted from the **JOYLO** identity:
- **Primary Brand Color**: Dark Teal (`#135f75`) — representing security, depth, and the calm oceans.
- **Accent Highlight**: Cream/Gold (`#ebd2a3`) — reflecting fine beaches, sunrise warmth, and elite service.
- **Typography**: 
  - **Outfit** (headings, stats, buttons) — geometric, crisp, and high-end.
  - **Plus Jakarta Sans** (body, forms, interface text) — highly readable, modern, and friendly.
- **Aesthetic Accents**: Responsive glassmorphism (`backdrop-filter`), hover scaling, glowing background elements, and smooth scrolling curves.

---

## 🌟 Core Features

1. **Custom SVG Logo**: Crisp, vector-rendered brand mark that looks sharp on high-DPI and mobile displays.
2. **Immersive Hero Widget**: Full-height display banner with a floating glass panel search widget for immediate engagement.
3. **Curated Escape Cards**: CSS grids with animated overlay tags, zoom-on-hover states, and quick-action booking anchors.
4. **Signature Services**: Visual cards outlining 24/7 Concierge Support, Curated Journeys, and VIP Airport Fast-track.
5. **Interactive Travel Planner**:
   - Live JavaScript application that compiles real-time itineraries based on **Destination**, **Travel Vibe** (Adventure, Relaxation, Cultural, Wellness), **Duration**, and **Luxury Tier** (Premium vs. Ultra-Luxe).
   - Generates simulated timeline checklists.
   - Calculates dynamic cost estimates based on selection variables.
6. **Bespoke Travel Collections**: Signature package details showing duration, category tags, premium inclusions, and price highlights.
7. **Testimonial Slider**: Auto-scrolling slide review carousel with manual controls and custom tracking dots.
8. **Toast Notification System**: Dynamic pop-up notices acknowledging forms (inquiry search, newsletter subscription, planner booking) in real time.

---

## 📂 Project Directory Structure

```
Joylo/
├── index.html          # Main landing structure, SVG assets, form frameworks
├── styles/
│   └── main.css        # Core layout, responsive grid definitions, animations, and design tokens
├── js/
│   └── app.js          # Intersection reveals, sliders, validation toasts, and planner engine
└── assets/
    ├── hero_bg.png     # Tropical resort hero background image
    ├── kyoto.png       # Kyoto cherry-blossom pagoda image
    ├── santorini.png   # Santorini blue dome sunset image
    ├── amalfi.png      # Positano cliffside coastline image
    └── swiss_alps.png  # Zermatt snowy Matterhorn chalets image
```

---

## 🚀 Running Locally

The project utilizes zero dependencies and runs out-of-the-box in any modern browser.

### Option 1: Direct File Launch
Double-click `index.html` inside the project folder to open it directly in Google Chrome, Microsoft Edge, Safari, or Firefox.

### Option 2: Local HTTP Server (Recommended)
To ensure optimal performance and standard loading behaviors, serve the directory locally using one of the following methods:

**Using Python:**
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

**Using Node.js:**
```bash
# Serves the current directory using http-server
npx -y http-server -p 8000
```
Then navigate to: `http://localhost:8000`

---

*Designed and engineered with passion for Joylo travelers.*
