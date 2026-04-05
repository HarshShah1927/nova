import { motion } from 'framer-motion';
import { useComputedStore } from '../../store/useAppStore';
import { generateRandomEntry } from '../../utils/animations';
import { ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Transactions() {
  const { transactions } = useComputedStore();
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, filter, typeFilter]);

  return (
    <motion.div 
      className="glass-panel"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, pointerEvents: 'auto' }}
      variants={generateRandomEntry()}
      initial="hidden"
      animate="visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Recent Transactions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginTop: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expense</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
              {(['all', 'income', 'expense'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    border: typeFilter === type ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                    background: typeFilter === type ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Expenses'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '8px',
              padding: '8px 12px 8px 32px',
              color: 'white',
              outline: 'none',
              fontFamily: 'Outfit',
              width: '200px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '4px', flex: 1, minHeight: 0 }}>
        {filtered.map((tx, i) => (
          <motion.div
            key={tx.id}
            custom={i}
            variants={generateRandomEntry()}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            layout
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                color: tx.type === 'income' ? '#10b981' : '#ef4444'
              }}>
                {tx.type === 'income' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>{tx.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{tx.category} • {tx.date}</div>
              </div>
            </div>
            <div style={{ 
              fontWeight: 600, 
              color: tx.type === 'income' ? '#10b981' : 'var(--text-primary)'
            }}>
              {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
