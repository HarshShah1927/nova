import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

type CalculatorProps = {
  open: boolean;
  onClose: () => void;
};

const buttonLayout = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', 'C', '+'],
  ['=',]
];

export default function Calculator({ open, onClose }: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const displayValue = useMemo(() => (expression || result), [expression, result]);

  const handleButton = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setResult('0');
      return;
    }

    if (value === '=') {
      try {
        // eslint-disable-next-line no-new-func
        const computed = new Function(`return ${expression}`)();
        setResult(String(computed));
        setExpression(String(computed));
      } catch {
        setResult('Error');
      }
      return;
    }

    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') return value;
      return `${prev}${value}`;
    });
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed',
        right: '2rem',
        bottom: '2rem',
        width: '320px',
        zIndex: 50,
        pointerEvents: 'auto'
      }}
    >
      <div className="glass-panel" style={{ padding: '1rem', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Calculator</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Quick math for both modes</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '18px',
          padding: '16px',
          minHeight: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'white',
          marginBottom: '1rem'
        }}>
          {displayValue}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {buttonLayout.flat().map((button) => (
            <button
              key={button}
              onClick={() => handleButton(button)}
              style={{
                padding: '14px 0',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: button === '=' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                color: button === '=' ? 'white' : 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
