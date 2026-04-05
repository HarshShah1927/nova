import { useEffect } from 'react';
import Scene from './components/3d/Scene';
import Overlay from './components/ui/Overlay';
import Intro from './components/ui/Intro';
import { useAppStore } from './store/useAppStore';

function App() {
  const { introComplete, setIntroComplete, isAdmin } = useAppStore();

  useEffect(() => {
    // Bind admin class to body for background transition
    if (isAdmin) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [isAdmin]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* 3D Canvas Layer */}
      <Scene />
      
      {/* Cinematic Intro Layer */}
      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}

      {/* Primary UI Overlay Layer */}
      {introComplete && <Overlay />}
    </div>
  );
}

export default App;
