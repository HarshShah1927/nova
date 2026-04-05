import { useAppStore } from '../../store/useAppStore';
import Header from './Header';
import DashboardCards from './DashboardCards';
import Transactions from './Transactions';
import { motion, AnimatePresence } from 'framer-motion';
import SplineGraph from '../charts/SplineGraph';

export default function Overlay() {
  const { viewMode, isAdmin } = useAppStore();

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      padding: '2rem 4rem',
      pointerEvents: 'none', // Allow clicks to pass through to 3D canvas when clicking empty space
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10
    }}>
      <Header />
      
      <AnimatePresence mode="wait">
        {viewMode === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <DashboardCards />
            
            <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
              {/* Transactions takes up left column */}
              <Transactions />
              
              {/* 2D Spline Chart instead of placeholder */}
              <div className="glass-panel" style={{ flex: 1, padding: '24px', pointerEvents: 'auto', display: 'flex', flexDirection: 'column' }}>
                <SplineGraph />
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'galaxy' && (
          <motion.div
            key="galaxy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', pointerEvents: 'none' }}
          >
            <div className="glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem', pointerEvents: 'auto' }}>
              <p>
                {isAdmin 
                  ? 'Enterprise financial galaxy: Drag to explore corporate assets. Scroll to analyze investment orbits.' 
                  : 'Drag to rotate the financial galaxy. Scroll to zoom.'
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
