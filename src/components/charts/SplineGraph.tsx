import { motion } from 'framer-motion';

export default function SplineGraph() {
  const points = "M0,80 C20,60 40,90 60,40 C80,-10 100,50 120,20 C140,-10 160,30 200,10";
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Income vs Expenses</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Red = Expense, green = Income
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Income</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Expense</span>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Base glow path */}
          <motion.path
            d={points}
            fill="none"
            stroke="var(--accent-glow)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: 'blur(8px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Main animated path */}
          <motion.path
            d={points}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
          />
        </svg>
      </div>
    </div>
  );
}
