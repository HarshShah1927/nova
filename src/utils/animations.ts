import type { Variants } from "framer-motion";

// Helper to generate unpredictable entry variants
export const generateRandomEntry = (): Variants => {
  const directions = [
    { x: -50, y: 0 },
    { x: 50, y: 0 },
    { x: 0, y: -50 },
    { x: 0, y: 50 },
    { x: 20, y: 20 },
    { x: -20, y: -20 }
  ];
  
  const rotations = [-10, 10, -5, 5, 0];
  const scales = [0.9, 0.95, 0.8, 1.1];
  
  const randomDir = directions[Math.floor(Math.random() * directions.length)];
  const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
  const randomScale = scales[Math.floor(Math.random() * scales.length)];
  
  // Random duration between 0.6 and 1.2
  const randomDur = 0.6 + Math.random() * 0.6;
  
  return {
    hidden: { 
      opacity: 0, 
      x: randomDir.x, 
      y: randomDir.y, 
      rotate: randomRot,
      scale: randomScale
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      rotate: 0,
      scale: 1,
      transition: {
        duration: randomDur,
        ease: [0.22, 1, 0.36, 1] // Sharp but smooth finish
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.4 }
    }
  };
};

export const hoverEffect: Variants = {
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 10px 30px -10px var(--accent-glow)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: {
    scale: 0.98,
    y: 0
  }
};
