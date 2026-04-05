import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { LogOut, User, Zap } from 'lucide-react';
import { generateRandomEntry } from '../../utils/animations';

export default function Header() {
  const { isAdmin, toggleRole, viewMode, setViewMode } = useAppStore();

  return (
    <motion.header 
      className="glass-panel"
      variants={generateRandomEntry()}
      initial="hidden"
      animate="visible"
      style={{ 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pointerEvents: 'auto',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '12px', 
          background: 'var(--accent-primary)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 0 15px var(--accent-glow)'
        }}>
          <Zap fill="white" size={20} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px' }}>
          {isAdmin ? 'NOVA' : 'NOVA'}<span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{isAdmin ? 'ENTERPRISE' : 'PORTFOLIO'}</span>
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div 
          onClick={() => setViewMode(viewMode === 'dashboard' ? 'galaxy' : 'dashboard')}
          style={{ 
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
        >
          {viewMode === 'dashboard' ? 'Switch to Galaxy View' : 'Switch to Dashboard'}
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRole}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            cursor: 'pointer', background: 'var(--glass-bg)', 
            padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)' 
          }}
        >
          <div style={{ 
            width: '28px', height: '28px', borderRadius: '50%', 
            background: 'var(--accent-primary)', opacity: 0.8,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <User size={16} />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, marginRight: '4px' }}>
            {isAdmin ? 'Admin Mode' : 'User Mode'}
          </span>
          <LogOut size={16} color="var(--text-secondary)" />
        </motion.div>
      </div>
    </motion.header>
  );
}
