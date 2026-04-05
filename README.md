# Cinematic 3D Finance Dashboard: NOVAPORTFOLIO

A highly immersive, futuristic financial dashboard built with Vite, React, React Three Fiber, and Framer Motion. This project treats data visualization as a cinematic storytelling experience, complete with dynamic unpredictable animations, 3D data representations, and a toggleable "Financial Galaxy View".

## Tech Stack
- **Framework**: Vite + React + TypeScript
- **3D Engine**: Three.js, React Three Fiber, React Three Drei
- **Animations**: Framer Motion (DOM Overlay), GSAP/React-Spring principles in fiber
- **State Management**: Zustand
- **Styling**: Vanilla CSS with comprehensive CSS custom properties (variables) emphasizing glassmorphism, glowing accents, and high-performance gradients.

## 🌟 The "Wow Feature": Financial Galaxy View
Instead of a standard pie chart, this dashboard includes a fully immersive **Financial Galaxy View**. 
- **Planets** represent Spending/Income Categories.
- **Satellites/Particles** orbit the planets representing individual transactions. 
- You can freely pan, zoom, and rotate the galaxy to explore your transaction history spatially.

## Core Design Philosophy

1. **Unpredictable Animation System**:
   Using a custom `generateRandomEntry()` helper, every component calculates a unique Framer Motion variant upon render. Direction, scale, rotation, and easing curves are randomized within a cinematic threshold, ensuring the UI never feels repetitive on repeat visits.

2. **Layered Architecture**:
   - `Scene.tsx`: The bottom layer. A WebGL canvas featuring ambient lighting, a galaxy mode, and a reactive particle system (700+ instanced spheres).
   - `Intro.tsx`: A cinematic 'OS booting' overlay that dominates the z-index before gracefully revealing the data layers.
   - `Overlay.tsx`: The top-most DOM layer where users interact with standard HTML inputs, but rendered through heavy Glassmorphism. 

3. **Role-Based Theming**:
   Clicking 'Admin Mode' triggers a state shift via Zustand. The root level CSS variables dynamically transition from 'User' (Neon Blue/Purple) to 'Admin' (Gold/Crimson), smoothly updating both DOM glow properties and the WebGL Particle emission colors simultaneously.

## Getting Started
1. Run `npm install`
2. Run `npm run dev`
3. Enjoy the cinematic entrance. Switch between "Dashboard" and "Galaxy View" at the top right!
