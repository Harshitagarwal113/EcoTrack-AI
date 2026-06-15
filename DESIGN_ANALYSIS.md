# EcoTrack AI Sustainability Platform - Design Analysis

This document provides a comprehensive design analysis of the EcoTrack AI Stitch project (`10811599883168801948`). It outlines the visual aesthetic, design tokens, screens, and components to guide front-end development.

## 1. Screens & Navigation Structure

### All Screens
The application consists of the following 8 core screens:
1. **Dashboard** (`a05d5f23e2544a8e8930114246083a84`)
2. **Carbon Tracker** (`f5cd20d36e9346dd849800541f8a1f16`)
3. **Goals & Challenges** (`7ec0305f042c486d817dcbe9b8fd6e78`)
4. **AI Sustainability Coach** (`685f775e60cc4b838cf985630b27c7c0`)
5. **Activity History** (`aea2e1ad848d4d199f33bdc2817b59ad`)
6. **Receipt Scanner** (`280870d5280c48f5be71d38f222f2119`)
7. **Community** (`1b22870d815a46ac957621bd7836b3cc`)
8. **Settings** (`0bf94af4e52d49a985212a7ca92ca489`)

### Navigation Structure
- **Glass Sidebar**: The primary navigation is housed in a detached "Glass Sidebar" on the left side of the screen (desktop).
- **Navigation Flow**: Users can navigate seamlessly between the Dashboard, Tracker, Goals, AI Coach, History, Scanner, Community, and Settings from the global sidebar.

## 2. Design Aesthetic: "Liquid Glass"
The design system embodies **"Organic Precision"**—a blend of high-end software craftsmanship and natural fluidity. The aesthetic is "Liquid Glass", which prioritizes high-transparency layers, subtle internal strokes, and a "wet" surface tension effect rather than noisy glassmorphism.

### Depth & Elevation (Luminous Layering)
- **Level 0 (Base):** Subtle mint-tinted white (`#f9f9ff`).
- **Level 1 (Panels):** `rgba(255, 255, 255, 0.7)` background, 1px solid border `rgba(255, 255, 255, 0.4)`, 20px backdrop blur.
- **Level 2 (Active/Floating):** "Drop Glow" shadow with Emerald (`#10b981`) at 10% opacity and 40px blur.
- **Reflections:** 1px top-inner border (stroke) of pure white at 80% opacity on Level 1/2 panels to simulate light refractions.

## 3. Design Tokens

### Colors (Lush Monochrome)
A spectrum of greens represents ecological health and AI activity.
- **Backgrounds:**
  - Background/Surface: `#f9f9ff`
  - Surface Dim: `#d3daea`
  - Surface Container (Base): `#e7eefe`
  - Inverse Surface: `#2a313d`
- **Primary (Emerald - Active States & Metrics):**
  - Primary: `#006c49`
  - On-Primary: `#ffffff`
  - Primary Container: `#10b981`
  - On-Primary Container: `#00422b`
- **Secondary (Forest - Deep-UI & Contrast):**
  - Secondary: `#1f6c3a`
  - On-Secondary: `#ffffff`
  - Secondary Container: `#a4f1b2`
- **Tertiary (Lime - Growth Indicators):**
  - Tertiary: `#416900`
  - Tertiary Container: `#72b400`
- **Semantic/Error:**
  - Error: `#ba1a1a`
  - Error Container: `#ffdad6`
- **Gradients:** "Natural Flow" (e.g., `linear-gradient(135deg, #10B981 0%, #34D399 100%)`).

### Typography (Information Density with Breathability)
- **Display & Headlines:** Geist (Technical precision, tight kerning).
  - Display LG: 48px, 700, -0.04em letter spacing.
  - Headline LG: 32px, 600, -0.02em letter spacing.
  - Headline MD: 24px, 600.
- **Body & Interface:** Inter (Superior legibility for dense data).
  - Body LG: 18px, 400.
  - Body MD: 16px, 400.
- **Labels:** Geist.
  - Label MD: 14px, 500, 0.02em letter spacing.
  - Label SM: 12px, 600.
- **Note on Numeric Data:** Tabular figures (`tnum`) should be used for charts/metrics.

### Shapes (Organic Geometric)
- **Rounded Utilities:**
  - SM: `0.25rem` (4px)
  - MD: `0.75rem` (12px)
  - Default: `0.5rem` (8px)
  - LG: `1rem` (16px)
  - XL: `1.5rem` (24px)
  - Full: `9999px`
- **Containers:** Main panels use 24px radius (`xl`). Inner elements use 12px (`md`) or 16px (`lg`).
- **Smoothing:** "Squircle" smoothing to ensure continuous liquid corners.

## 4. Layout Hierarchy & Responsive Behavior

### Desktop (Fluid Floating Grid)
- **Grid:** 12-column layout with 24px gutters.
- **Max Width:** Container maxes out at `1440px`.
- **Sidebars:** Detached 12px from the left edge.
- **Sectioning:** Generous vertical padding (`stack-lg`: 32px) between visualizations.
- **Margins:** Desktop margin is `48px`.

### Mobile (Responsive Adaptation)
- **Grid:** Transitions to a single-column stack.
- **Margins:** Side margins reduce to `20px`.
- **Navigation:** Main navigation moves from sidebar to floating action buttons anchored to bottom-center with persistent backdrop blur.

## 5. Key Components

- **Buttons:** Primary buttons use an Emerald-to-Teal gradient, white 14px Geist SemiBold label, and a `0.5px` inner glow on the top edge.
- **Progress Rings:** Thick strokes (12px+) with rounded caps. Background track uses 10% opacity of the stroke color.
- **AI Chat Cards:** "Glass-on-Glass". AI responses feature a higher backdrop blur (40px) and a subtle "shimmer" border animation during processing.
- **Sidebar:** Transparent background with `saturate(180%)` backdrop filter. Icons use 2px stroke weights.
- **Analytics Charts:** Area fills with 20% opacity gradient of the line color. Data points are "Glass Beads" (white circles with thick primary-color border).
- **Input Fields:** "Recessed" appearance—slightly darker than panel background, inner shadow, 1px bottom-accent border on focus.
