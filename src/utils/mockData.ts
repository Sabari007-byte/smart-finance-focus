
import { User, Expense, Budget, Challenge, AIInsight, ExpenseCategory } from '../types';

// Carbon impact per dollar for each category
export const CARBON_WEIGHTS: Record<ExpenseCategory, number> = {
  food: 0.5,
  transportation: 0.8,
  housing: 0.3,
  utilities: 0.6,
  healthcare: 0.2,
  entertainment: 0.4,
  clothing: 0.7,
  education: 0.1,
  personal: 0.4,
  other: 0.3
};

// Generate a random user
export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  ageGroup: 'adult',
  monthlyIncome: 5000,
  financialGoal: 'Save for vacation',
  targetAmount: 2500,
  points: 750,
  carbonScore: 82
};

// Generate mock expenses for the last 30 days
export const generateMockExpenses = (): Expense[] => {
  const categories: ExpenseCategory[] = [
    'food', 'transportation', 'housing', 'utilities', 
    'healthcare', 'entertainment', 'clothing', 'education', 
    'personal', 'other'
  ];
  
  const expenses: Expense[] = [];
  const today = new Date();
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = Math.floor(Math.random() * 200) + 10;
    
    // Calculate carbon impact based on category and amount
    const carbonImpact = amount * CARBON_WEIGHTS[category];
    
    expenses.push({
      id: `exp-${i}`,
      userId: '1',
      amount,
      category,
      date: date.toISOString(),
      notes: Math.random() > 0.7 ? `Expense ${i} notes` : undefined,
      carbonImpact
    });
  }
  
  return expenses;
};

// Generate mock budget
export const mockBudget: Budget = {
  id: 'budget-1',
  userId: '1',
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  categories: [
    { category: 'food', limit: 600 },
    { category: 'transportation', limit: 300 },
    { category: 'housing', limit: 1500 },
    { category: 'utilities', limit: 250 },
    { category: 'healthcare', limit: 200 },
    { category: 'entertainment', limit: 150 },
    { category: 'clothing', limit: 100 },
    { category: 'education', limit: 100 },
    { category: 'personal', limit: 150 },
    { category: 'other', limit: 100 }
  ],
  totalLimit: 3450
};

// Generate mock challenges
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'No-Spend Day',
    description: 'Go an entire day without spending any money',
    points: 50,
    type: 'budget',
    completed: true
  },
  {
    id: 'challenge-2',
    title: 'Public Transport Week',
    description: 'Use public transportation exclusively for one week',
    points: 100,
    type: 'eco',
    completed: false
  },
  {
    id: 'challenge-3',
    title: 'Meal Prep Sunday',
    description: 'Prepare meals for the week to avoid food waste',
    points: 75,
    type: 'eco',
    completed: false
  },
  {
    id: 'challenge-4',
    title: 'Track All Expenses',
    description: 'Log every expense for 5 consecutive days',
    points: 60,
    type: 'daily',
    completed: true
  }
];

// Generate mock AI insights
export const mockInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'warning',
    message: 'You\'ve spent 25% more on dining out this month compared to last month.',
    date: new Date().toISOString()
  },
  {
    id: 'insight-2',
    type: 'tip',
    message: 'Consider using public transportation more often. It could save you ₹500 monthly and reduce your carbon footprint.',
    date: new Date().toISOString()
  },
  {
    id: 'insight-3',
    type: 'achievement',
    message: 'Great job! You stayed under your entertainment budget for 3 consecutive months.',
    date: new Date().toISOString()
  },
  {
    id: 'insight-4',
    type: 'warning',
    message: 'At your current spending rate, you might exceed your monthly budget by ₹1,200.',
    date: new Date().toISOString()
  }
];

// Generate mock data for charts
export const mockMonthlySpending = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    const value = index <= currentMonth 
      ? Math.floor(Math.random() * 1000) + 2000 
      : null;
    
    return {
      name: month,
      value
    };
  });
};

export const mockCarbonFootprint = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    const value = index <= currentMonth 
      ? Math.floor(Math.random() * 200) + 100 
      : null;
    
    return {
      name: month,
      value
    };
  });
};

export const mockCategoryDistribution = () => {
  const categories: ExpenseCategory[] = [
    'food', 'transportation', 'housing', 'utilities', 
    'healthcare', 'entertainment', 'clothing', 'education', 
    'personal', 'other'
  ];
  
  return categories.map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: Math.floor(Math.random() * 1000) + 100
  }));
};

export const getMockExpenses = (): Expense[] => {
  return generateMockExpenses();
};
