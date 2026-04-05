import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Calculator as CalculatorIcon, LogOut, User, Zap } from 'lucide-react';
import { generateRandomEntry } from '../../utils/animations';

interface HeaderProps {
  calculatorOpen: boolean;
  onCalculatorToggle: () => void;
}

export default function Header({ calculatorOpen, onCalculatorToggle }: HeaderProps) {
  const { role, setRole, viewMode, setViewMode } = useAppStore();

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
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px', margin: 0 }}>
            NOVA<span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{role === 'admin' ? ' ENTERPRISE' : ' PORTFOLIO'}</span>
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {role === 'admin' ? 'Admin role: edit and add transactions.' : 'Viewer role: read-only financial snapshot.'}
            <span style={{ marginLeft: '8px', opacity: 0.7 }}>💾 Data persisted</span>
          </p>
        </div>
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

        <div
          onClick={onCalculatorToggle}
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '20px',
            background: calculatorOpen ? 'rgba(14, 165, 233, 0.15)' : 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <CalculatorIcon size={16} />
          {calculatorOpen ? 'Close Calculator' : 'Calculator'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <div style={{ 
            width: '28px', height: '28px', borderRadius: '50%', 
            background: 'var(--accent-primary)', opacity: 0.8,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <User size={16} />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <LogOut size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </motion.header>
  );
}
