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
  updateBudgetCategory: (category: ExpenseCategory, limit: number) => void;
  addNewChallenge: (challenge: Omit<Challenge, 'id'>) => void;
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

  useEffect(() => {
    const newInsights = generateInsights(expenses, previousMonthExpenses);
    
    if (newInsights.length > 0) {
      setInsights(prevInsights => {
        const combined = [...newInsights, ...prevInsights];
        return combined.slice(0, 10);
      });
    }
    
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

  const addNewChallenge = (challenge: Omit<Challenge, 'id'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge-${Date.now()}`
    };
    
    setChallenges(prev => [...prev, newChallenge]);
    toast.success('New challenge added!');
  };

  const updateBudgetCategory = (category: ExpenseCategory, limit: number) => {
    setBudget(prevBudget => {
      const updatedCategories = prevBudget.categories.map(cat => 
        cat.category === category ? { ...cat, limit } : cat
      );
      
      const newTotalLimit = updatedCategories.reduce((sum, cat) => sum + cat.limit, 0);
      
      return {
        ...prevBudget,
        categories: updatedCategories,
        totalLimit: newTotalLimit
      };
    });
    
    toast.success(`Budget for ${category} updated successfully`);
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
      getBudgetSuggestions,
      updateBudgetCategory,
      addNewChallenge
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
