
export type UserAgeGroup = 'teen' | 'adult' | 'senior';

export interface User {
  id: string;
  name: string;
  ageGroup: UserAgeGroup;
  monthlyIncome: number;
  financialGoal: string;
  targetAmount?: number;
  points: number;
  carbonScore: number;
}

export type ExpenseCategory = 
  | 'food' 
  | 'transportation' 
  | 'housing' 
  | 'utilities' 
  | 'healthcare' 
  | 'entertainment' 
  | 'clothing' 
  | 'education' 
  | 'personal' 
  | 'other';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  carbonImpact: number;
}

export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  categories: {
    category: ExpenseCategory;
    limit: number;
  }[];
  totalLimit: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'budget' | 'eco' | 'daily';
  completed: boolean;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement';
  message: string;
  date: string;
}

export interface CarbonData {
  category: ExpenseCategory;
  impact: number;
}
