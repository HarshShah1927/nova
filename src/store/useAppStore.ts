import { create } from 'zustand';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export interface ChartData {
  name: string;
  value: number;
}

interface AppState {
  role: 'viewer' | 'admin';
  isAdmin: boolean;
  setRole: (role: 'viewer' | 'admin') => void;
  toggleRole: () => void;

  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;

  viewMode: 'dashboard' | 'galaxy';
  setViewMode: (mode: 'dashboard' | 'galaxy') => void;

  introComplete: boolean;
  setIntroComplete: (val: boolean) => void;
}

const USER_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Stripe Payout', amount: 4500, date: '2026-04-01', category: 'Freelance', type: 'income' },
  { id: '2', title: 'Apple Store', amount: -1200, date: '2026-04-02', category: 'Electronics', type: 'expense' },
  { id: '3', title: 'AWS Cloud', amount: -350, date: '2026-04-02', category: 'Infrastructure', type: 'expense' },
  { id: '4', title: 'Client Retainer', amount: 8000, date: '2026-04-03', category: 'Services', type: 'income' },
  { id: '5', title: 'Flight Tickets', amount: -650, date: '2026-04-03', category: 'Travel', type: 'expense' },
  { id: '6', title: 'Whole Foods', amount: -120, date: '2026-04-03', category: 'Groceries', type: 'expense' },
];

const USER_PORTFOLIO: ChartData[] = [
  { name: 'Crypto', value: 45 },
  { name: 'Stocks', value: 30 },
  { name: 'Real Estate', value: 15 },
  { name: 'Cash', value: 10 },
];

const ADMIN_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Enterprise Contract', amount: 50000, date: '2026-04-01', category: 'Enterprise', type: 'income' },
  { id: '2', title: 'Server Infrastructure', amount: -15000, date: '2026-04-02', category: 'Infrastructure', type: 'expense' },
  { id: '3', title: 'Office Expansion', amount: -25000, date: '2026-04-02', category: 'Real Estate', type: 'expense' },
  { id: '4', title: 'Government Grant', amount: 75000, date: '2026-04-03', category: 'Grants', type: 'income' },
  { id: '5', title: 'Executive Bonuses', amount: -35000, date: '2026-04-03', category: 'Compensation', type: 'expense' },
  { id: '6', title: 'R&D Investment', amount: -20000, date: '2026-04-03', category: 'Research', type: 'expense' },
  { id: '7', title: 'IPO Proceeds', amount: 200000, date: '2026-04-04', category: 'Capital', type: 'income' },
  { id: '8', title: 'Legal Fees', amount: -8000, date: '2026-04-04', category: 'Legal', type: 'expense' },
];

const ADMIN_PORTFOLIO: ChartData[] = [
  { name: 'Stocks', value: 40 },
  { name: 'Bonds', value: 25 },
  { name: 'Real Estate', value: 20 },
  { name: 'Crypto', value: 10 },
  { name: 'Private Equity', value: 5 },
];

// Local storage helpers
const loadFromStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue; // SSR safety
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return; // SSR safety
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const getDefaultTransactions = (role: 'viewer' | 'admin') => {
  const stored = loadFromStorage('fintech_transactions', null);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  return role === 'admin' ? ADMIN_TRANSACTIONS : USER_TRANSACTIONS;
};

export const useAppStore = create<AppState>((set) => ({
  role: loadFromStorage('fintech_role', 'viewer'),
  isAdmin: loadFromStorage('fintech_role', 'viewer') === 'admin',
  setRole: (role) => {
    saveToStorage('fintech_role', role);
    set({ role, isAdmin: role === 'admin', transactions: getDefaultTransactions(role) });
  },
  toggleRole: () => set((state) => {
    const newRole = state.isAdmin ? 'viewer' : 'admin';
    saveToStorage('fintech_role', newRole);
    return { role: newRole, isAdmin: !state.isAdmin, transactions: getDefaultTransactions(newRole) };
  }),

  transactions: getDefaultTransactions(loadFromStorage('fintech_role', 'viewer')),
  addTransaction: (transaction) => set((state) => {
    const newTransactions = [transaction, ...state.transactions];
    saveToStorage('fintech_transactions', newTransactions);
    return { transactions: newTransactions };
  }),
  updateTransaction: (transaction) => set((state) => {
    const newTransactions = state.transactions.map((item) => item.id === transaction.id ? transaction : item);
    saveToStorage('fintech_transactions', newTransactions);
    return { transactions: newTransactions };
  }),

  viewMode: loadFromStorage('fintech_viewMode', 'dashboard'),
  setViewMode: (mode) => {
    saveToStorage('fintech_viewMode', mode);
    set({ viewMode: mode });
  },

  introComplete: loadFromStorage('fintech_introComplete', false),
  setIntroComplete: (val) => {
    saveToStorage('fintech_introComplete', val);
    set({ introComplete: val });
  }
}));

export const useComputedStore = () => {
  const { role, transactions } = useAppStore();
  const isAdmin = role === 'admin';

  const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0));
  const totalBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return {
    role,
    isAdmin,
    totalBalance,
    totalIncome,
    totalExpenses,
    transactions,
    portfolioData: role === 'admin' ? ADMIN_PORTFOLIO : USER_PORTFOLIO
  };
};

// CSV export utility
export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Title', 'Category', 'Type', 'Amount (INR)'];
  const rows = transactions.map(tx => [
    tx.date,
    tx.title,
    tx.category,
    tx.type,
    Math.abs(tx.amount).toString()
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
