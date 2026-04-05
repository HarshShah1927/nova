import { useComputedStore } from '../../store/useAppStore';

export default function Insights() {
  const { transactions, totalIncome, totalExpenses, role } = useComputedStore();

  const expenseCategories = transactions
    .filter(tx => tx.type === 'expense')
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {});

  const highestCategory = Object.entries(expenseCategories)
    .sort(([, a], [, b]) => b - a)[0];

  const highestCategoryLabel = highestCategory ? `${highestCategory[0]} · ₹${highestCategory[1].toLocaleString()}` : 'No expenses yet';
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const observation = totalIncome > 0
    ? totalExpenses > totalIncome
      ? 'Spending exceeds income — focus on controlling operational costs.'
      : 'Cashflow is positive. Keep managing expenses to maintain margin.'
    : 'No income data available to compare with spending.';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '2rem', pointerEvents: 'auto' }}>
      <div className="glass-panel" style={{ padding: '22px', minHeight: '110px' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Top spending category</p>
        <h3 style={{ margin: '12px 0 0', fontSize: '1.25rem' }}>{highestCategoryLabel}</h3>
      </div>

      <div className="glass-panel" style={{ padding: '22px', minHeight: '110px' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monthly comparison</p>
        <h3 style={{ margin: '12px 0 0', fontSize: '1.25rem' }}>{expenseRatio}% of income</h3>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Expense-to-income ratio</p>
      </div>

      <div className="glass-panel" style={{ padding: '22px', minHeight: '110px' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Insight</p>
        <h3 style={{ margin: '12px 0 0', fontSize: '1.25rem' }}>{role === 'admin' ? 'Enterprise view' : 'Personal view'}</h3>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{observation}</p>
      </div>
    </div>
  );
}
