
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Expense, Budget, Challenge, AIInsight, ExpenseCategory } from '../types';
import { mockUser, mockBudget, mockChallenges, mockInsights, getMockExpenses, CARBON_WEIGHTS } from '../utils/mockData';
import { toast } from 'sonner';

interface AppContextType {
  user: User;
  expenses: Expense[];
  budget: Budget;
  challenges: Challenge[];
  insights: AIInsight[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'carbonImpact'>) => void;
  updateUser: (user: Partial<User>) => void;
  completeChallenge: (id: string) => void;
  getCurrentMonthExpenses: () => Expense[];
  getCategoryTotal: (category: ExpenseCategory) => number;
  getTotalSpent: () => number;
  getBudgetProgress: () => number;
  getCarbonImpact: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [expenses, setExpenses] = useState<Expense[]>(getMockExpenses());
  const [budget, setBudget] = useState<Budget>(mockBudget);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);

  const getCurrentMonthExpenses = (): Expense[] => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses.filter(expense => new Date(expense.date) >= startOfMonth);
  };

  const getCategoryTotal = (category: ExpenseCategory): number => {
    return getCurrentMonthExpenses()
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalSpent = (): number => {
    return getCurrentMonthExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBudgetProgress = (): number => {
    const total = getTotalSpent();
    return (total / budget.totalLimit) * 100;
  };

  const getCarbonImpact = (): number => {
    return getCurrentMonthExpenses().reduce((sum, expense) => sum + expense.carbonImpact, 0);
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'userId' | 'carbonImpact'>) => {
    const carbonImpact = expenseData.amount * CARBON_WEIGHTS[expenseData.category];
    
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      userId: user.id,
      carbonImpact,
      ...expenseData
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    toast.success('Expense added successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const completeChallenge = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, completed: true } 
          : challenge
      )
    );
    
    setUser(prev => ({
      ...prev,
      points: prev.points + challenges.find(c => c.id === id)?.points || 0
    }));
    
    toast.success('Challenge completed! Points awarded.');
  };

  return (
    <AppContext.Provider value={{
      user,
      expenses,
      budget,
      challenges,
      insights,
      addExpense,
      updateUser,
      completeChallenge,
      getCurrentMonthExpenses,
      getCategoryTotal,
      getTotalSpent,
      getBudgetProgress,
      getCarbonImpact
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
