import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Particles from './Particles';
import { useAppStore } from '../../store/useAppStore';
import { Suspense, lazy } from 'react';

// Lazy loading the galaxy view for performance
const GalaxyView = lazy(() => import('./GalaxyView'));

export default function Scene() {
  const { viewMode } = useAppStore();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        
        {/* Cinematic ambient and directional lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <spotLight position={[-10, -10, -10]} intensity={2} color="#0ea5e9" />
        
        {/* Floating particles that form the atmospheric background */}
        <Particles count={700} />
        
        <Suspense fallback={null}>
          {viewMode === 'galaxy' && <GalaxyView />}
        </Suspense>

        {/* Global Environment Map for reflections */}
        <Environment preset="city" />
        
        {/* Only enable OrbitControls in Galaxy View naturally, though we can restrict it */}
        {viewMode === 'galaxy' && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
      </Canvas>
    </div>
  );
}
