# XEBIA LMS Frontend Studio Documentation

This document outlines the architecture, visual tokens, and features of the XEBIA LMS Course Management frontend.

---

## 🎨 1. Visual Token System & Colors
The frontend utilizes a modern **Light Mode Glassmorphism** design system with a clean, high-contrast typography stack.

### Brand Color Tokens
*   **Tranquil Velvet (Primary):** `#6C1D5F`
    *   *Usage:* Active menu items, highlight outlines, primary buttons, and headings.
*   **Tranquil Velvet Dark:** `#4A1E47`
    *   *Usage:* Deep gradient headers, sidebar backdrops, and major page titles.
*   **Bright Tr. Velvet:** `#84117C`
    *   *Usage:* Typography accents and progress bar fills.
*   **Emerald (Success Accent):** `#01AC9F`
    *   *Usage:* Active badges, success indicators, and live sync indicators.
*   **CTA Orange (Warning/Action Accent):** `#FF6200`
    *   *Usage:* "Start Course" buttons and critical alert borders.

### Surface & Border Tokens
*   **Main Background:** `#FAFBFD` (Clean, off-white background)
*   **Frosted Glass Fill (`--glass-bg`):** `rgba(255, 255, 255, 0.65)` with a `blur(16px)` filter.
*   **Glass Border:** `1px solid rgba(218, 220, 234, 0.55)`
*   **Typography Colors:** Primary: `#221A2B` (Dark violet-black), Muted: `#5D5768` (Grey-purple).

---

## ⚙️ 2. Core UI Layout Components

### A. Sidebar Navigation Pane (Dark Contrast Glass)
*   Holds the **XEBIA LMS Logo** (a gradient box featuring Emerald and Bright Velvet) and brand name.
*   Contains tabs to switch views: *Course Catalog*, *Learning Room*, and *Authoring Studio*.

### B. Course Catalog View
*   **Hero Welcome Banner:** A large, gradient-filled banner that introduces the portal.
*   **Search Box:** An interactive search bar with real-time keystroke filtering.
*   **Category Pills:** Pill-shaped tags dynamically generated to filter courses by category.
*   **Course Cards:** Glass cards displaying course title, description, difficulty level, duration, and progress bar.

### C. Learning Room View
*   **Curriculum Sidebar:** An accordion widget grouping lessons into Modules and Submodules with chevron rotations.
*   **Lecture Reading Pane:** Renders rich lesson contents dynamically:
    *   *Code Blocks:* Dark theme windows featuring decorative Mac-style status dots (Red, Yellow, Green) and a **Copy** button.
    *   *Callout Alerts:* Styled boxes with left-accent borders for notes or tips.
    *   *Responsive Videos:* Fully responsive video players (16:9 aspect ratio).

### D. Authoring Studio (Admin Board)
*   **SEO Analytics Dashboard:** Visual stat widgets highlighting views, clicks, CTR, and average SEO scores.
*   **Publishing Forms:** Inputs to create new Categories and Courses dynamically (with automatic slug generation).

---

## 📁 3. Code Architecture Overview

### 1. `index.html` (Layout Structure)
Contains semantic HTML5 elements representing the sidebar, main header, catalog panel, learning portal grids, and forms.

### 2. `style.css` (Visual Presentation)
*   Imports **Inter** (weights 300 to 800) from Google Fonts.
*   Applies **`-0.015em`** letter-spacing to the body and **`-0.03em`** to headings for a premium, clean SaaS look.
*   Generates glowing ambient background orbs using `body::before` and `body::after` pseudo-elements.

### 3. `app.js` (Interactivity & State)
*   Integrates with Spring Boot API endpoints (`/api/courses` & `/api/categories`).
*   Implements an **automatic mock database fallback** so the frontend is previewable even if the backend is offline.
*   Handles real-time search queries and filters cards dynamically.
