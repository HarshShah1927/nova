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
  isAdmin: boolean;
  toggleRole: () => void;
  
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  
  transactions: Transaction[];
  portfolioData: ChartData[];
  
  // View states
  viewMode: 'dashboard' | 'galaxy';
  setViewMode: (mode: 'dashboard' | 'galaxy') => void;
  
  // Intro state
  introComplete: boolean;
  setIntroComplete: (val: boolean) => void;
}

// Mock Data - User Mode
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

// Mock Data - Admin Mode (Higher values, different transactions)
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

export const useAppStore = create<AppState>((set, get) => ({
  isAdmin: false,
  toggleRole: () => set((state) => ({ isAdmin: !state.isAdmin })),
  
  // Static values - will be computed by selectors
  totalBalance: 0, // Will be overridden by selector
  totalIncome: 0,   // Will be overridden by selector
  totalExpenses: 0, // Will be overridden by selector
  transactions: [], // Will be overridden by selector
  portfolioData: [], // Will be overridden by selector
  
  viewMode: 'dashboard',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  introComplete: false,
  setIntroComplete: (val) => set({ introComplete: val })
}));

// Selectors for computed values
export const useComputedStore = () => {
  const isAdmin = useAppStore((state) => state.isAdmin);
  
  return {
    totalBalance: isAdmin 
      ? ADMIN_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0)
      : USER_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0),
    
    totalIncome: isAdmin
      ? ADMIN_TRANSACTIONS.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
      : USER_TRANSACTIONS.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
    
    totalExpenses: isAdmin
      ? Math.abs(ADMIN_TRANSACTIONS.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0))
      : Math.abs(USER_TRANSACTIONS.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)),
    
    transactions: isAdmin ? ADMIN_TRANSACTIONS : USER_TRANSACTIONS,
    portfolioData: isAdmin ? ADMIN_PORTFOLIO : USER_PORTFOLIO
  };
};
