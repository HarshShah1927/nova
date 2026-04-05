import { motion } from 'framer-motion';
import { useComputedStore, useAppStore } from '../../store/useAppStore';
import { generateRandomEntry } from '../../utils/animations';
import { TrendingUp, TrendingDown, DollarSign, Users, Building } from 'lucide-react';

export default function DashboardCards() {
  const { isAdmin } = useAppStore();
  const { totalBalance, totalIncome, totalExpenses } = useComputedStore();

  const userCards = [
    { title: 'Total Balance', amount: totalBalance, icon: DollarSign, color: 'var(--accent-primary)', trend: '+12.5%' },
    { title: 'Monthly Income', amount: totalIncome, icon: TrendingUp, color: '#10b981', trend: '+4.2%' },
    { title: 'Monthly Expenses', amount: totalExpenses, icon: TrendingDown, color: '#ef4444', trend: '-1.4%' }
  ];

  const adminCards = [
    { title: 'Company Assets', amount: totalBalance, icon: Building, color: 'var(--admin-primary)', trend: '+8.3%' },
    { title: 'Quarterly Revenue', amount: totalIncome, icon: TrendingUp, color: '#fbbf24', trend: '+15.7%' },
    { title: 'Operational Costs', amount: totalExpenses, icon: TrendingDown, color: '#ef4444', trend: '+2.1%' },
    { title: 'Active Users', amount: 125000, icon: Users, color: '#8b5cf6', trend: '+24.5%' }
  ];

  const cards = isAdmin ? adminCards : userCards;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          variants={generateRandomEntry()}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          layout
          className="glass-panel"
          style={{ padding: '24px', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{card.title}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>₹{card.amount.toLocaleString()}</h2>
            </div>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '16px', 
              background: `rgba(${card.color === '#10b981' ? '16, 185, 129' : card.color === '#ef4444' ? '239, 68, 68' : 'var(--accent-primary)'}, 0.1)`, 
              display: 'flex', justifyContent: 'center', alignItems: 'center' 
            }}>
              <card.icon color={card.color} size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: card.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
            <span style={{ fontWeight: 600 }}>{card.trend}</span> vs last month
          </div>
        </motion.div>
      ))}
    </div>
  );
}
