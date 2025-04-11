
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Expense, Budget, Challenge, AIInsight, ExpenseCategory } from '../types';
import { 
  mockUser, 
  mockBudget, 
  mockChallenges, 
  getMockExpenses,
  getPreviousMonthExpenses,
  generateMockInsights,
  CARBON_WEIGHTS 
} from '../utils/mockData';
import { generateInsights, predictEndOfMonthSpending, generateBudgetSuggestions } from '../utils/aiEngine';
import { toast } from 'sonner';

interface AppContextType {
  user: User;
  expenses: Expense[];
  previousMonthExpenses: Expense[];
  budget: Budget;
  challenges: Challenge[];
  insights: AIInsight[];
  predictedSpending: Record<ExpenseCategory, number>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'carbonImpact'>) => void;
  updateUser: (user: Partial<User>) => void;
  completeChallenge: (id: string) => void;
  getCurrentMonthExpenses: () => Expense[];
  getCategoryTotal: (category: ExpenseCategory) => number;
  getTotalSpent: () => number;
  getBudgetProgress: () => number;
  getCarbonImpact: () => number;
  getBudgetSuggestions: () => { category: ExpenseCategory; suggestion: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [expenses, setExpenses] = useState<Expense[]>(getMockExpenses());
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState<Expense[]>(getPreviousMonthExpenses());
  const [budget, setBudget] = useState<Budget>(mockBudget);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [insights, setInsights] = useState<AIInsight[]>(generateMockInsights());
  const [predictedSpending, setPredictedSpending] = useState<Record<ExpenseCategory, number>>({} as Record<ExpenseCategory, number>);

  // Generate insights when expenses change
  useEffect(() => {
    // Generate AI insights based on expense data
    const newInsights = generateInsights(expenses, previousMonthExpenses);
    
    // Only update if we have new insights
    if (newInsights.length > 0) {
      setInsights(prevInsights => {
        // Combine with existing insights, but limit total to 10
        const combined = [...newInsights, ...prevInsights];
        return combined.slice(0, 10);
      });
    }
    
    // Update predicted spending
    const predictions = predictEndOfMonthSpending(expenses, previousMonthExpenses);
    setPredictedSpending(predictions);
  }, [expenses, previousMonthExpenses]);

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

  const getBudgetSuggestions = () => {
    return generateBudgetSuggestions(expenses, previousMonthExpenses, user.monthlyIncome);
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
      previousMonthExpenses,
      budget,
      challenges,
      insights,
      predictedSpending,
      addExpense,
      updateUser,
      completeChallenge,
      getCurrentMonthExpenses,
      getCategoryTotal,
      getTotalSpent,
      getBudgetProgress,
      getCarbonImpact,
      getBudgetSuggestions
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
