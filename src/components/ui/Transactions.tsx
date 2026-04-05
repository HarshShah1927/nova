import { motion } from 'framer-motion';
import { useAppStore, useComputedStore, exportTransactionsToCSV } from '../../store/useAppStore';
import type { Transaction } from '../../store/useAppStore';
import { generateRandomEntry } from '../../utils/animations';
import { ArrowUpRight, ArrowDownRight, Search, Download } from 'lucide-react';
import { useMemo, useState } from 'react';

const defaultFormData = {
  title: '',
  category: '',
  amount: '0',
  type: 'expense' as 'income' | 'expense',
  date: new Date().toISOString().split('T')[0]
};

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction } = useAppStore();
  const { isAdmin } = useComputedStore();
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, filter, typeFilter]);

  const saveTransaction = () => {
    const amountValue = Number(formData.amount) || 0;
    const signedAmount = formData.type === 'expense' ? -Math.abs(amountValue) : Math.abs(amountValue);
    const newTransaction: Transaction = {
      id: editing ? editing.id : `${Date.now()}`,
      title: formData.title || 'Untitled',
      category: formData.category || 'General',
      amount: signedAmount,
      date: formData.date,
      type: formData.type
    };

    if (editing) {
      updateTransaction(newTransaction);
    } else {
      addTransaction(newTransaction);
    }

    setEditing(null);
    setShowForm(false);
    setFormData(defaultFormData);
  };

  const startEdit = (tx: Transaction) => {
    setEditing(tx);
    setFormData({
      title: tx.title,
      category: tx.category,
      amount: Math.abs(tx.amount).toString(),
      type: tx.type,
      date: tx.date
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData(defaultFormData);
  };

  return (
    <motion.div 
      className="glass-panel"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, pointerEvents: 'auto', minWidth: '360px' }}
      variants={generateRandomEntry()}
      initial="hidden"
      animate="visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
          {isAdmin ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => exportTransactionsToCSV(transactions)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  const confirmReset = window.confirm('Reset to default transactions? This will clear all custom data.');
                  if (confirmReset) {
                    localStorage.removeItem('fintech_transactions');
                    window.location.reload(); // Simple way to reset the app state
                  }
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
              >
                Reset Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(true);
                  setEditing(null);
                  setFormData(defaultFormData);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '16px',
                  background: 'var(--accent-primary)',
                  border: 'none',
                  color: '#080c13',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Add Transaction
              </button>
            </div>
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Viewer role: read-only mode.</span>
          )}
        </div>
      </div>

      {showForm && (
        <div style={{ display: 'grid', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Title"
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white' }}
            />
            <input
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Category"
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <input
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount"
              type="number"
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white' }}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white' }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              type="date"
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={saveTransaction}
              style={{ padding: '10px 16px', borderRadius: '16px', background: 'var(--accent-primary)', border: 'none', color: '#080c13', fontWeight: 700, cursor: 'pointer' }}
            >
              {editing ? 'Save Changes' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: '10px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '4px', flex: 1, minHeight: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '24px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--text-secondary)' }}>
            {transactions.length === 0 ? 'No transactions available yet.' : 'No transactions match this filter.'}
          </div>
        ) : filtered.map((tx, i) => (
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
              cursor: 'default'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                fontWeight: 600, 
                color: tx.type === 'income' ? '#10b981' : 'var(--text-primary)'
              }}>
                {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => startEdit(tx)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '999px',
                    padding: '6px 12px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
