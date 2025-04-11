
import { Expense, ExpenseCategory, AIInsight } from "@/types";

// Function to analyze expenses and generate insights
export const generateInsights = (
  expenses: Expense[],
  previousMonthExpenses: Expense[]
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const now = new Date();

  // Get current month expenses by category
  const currentMonthCategoryTotals: Record<ExpenseCategory, number> = {
    food: 0,
    transportation: 0,
    housing: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    clothing: 0,
    education: 0,
    personal: 0,
    other: 0,
  };

  // Get previous month expenses by category
  const previousMonthCategoryTotals: Record<ExpenseCategory, number> = {
    food: 0,
    transportation: 0,
    housing: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    clothing: 0,
    education: 0,
    personal: 0,
    other: 0,
  };

  // Calculate current month spending by category
  expenses.forEach((expense) => {
    currentMonthCategoryTotals[expense.category] += expense.amount;
  });

  // Calculate previous month spending by category
  previousMonthExpenses.forEach((expense) => {
    previousMonthCategoryTotals[expense.category] += expense.amount;
  });

  // Compare spending by category and generate insights
  Object.entries(currentMonthCategoryTotals).forEach(([category, amount]) => {
    const previousAmount = previousMonthCategoryTotals[category as ExpenseCategory];
    
    // Skip if there was no spending in this category before
    if (previousAmount === 0) return;

    // Calculate percentage change
    const percentChange = ((amount - previousAmount) / previousAmount) * 100;

    // Generate insights based on percentage change
    if (percentChange > 25) {
      insights.push({
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "warning",
        message: `You spent ${percentChange.toFixed(0)}% more on ${category} this month compared to last month.`,
        date: now.toISOString(),
      });
    } else if (percentChange < -20) {
      insights.push({
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "achievement",
        message: `Great job! You reduced your ${category} expenses by ${Math.abs(percentChange).toFixed(0)}% this month.`,
        date: now.toISOString(),
      });
    }
  });

  // Predict potential overspending
  const highSpendingCategories = Object.entries(currentMonthCategoryTotals)
    .filter(([category, amount]) => {
      const previousAmount = previousMonthCategoryTotals[category as ExpenseCategory];
      // Consider high spending if >50% increase and amount is significant
      return amount > previousAmount * 1.5 && amount > 1000;
    })
    .map(([category]) => category);

  if (highSpendingCategories.length > 0) {
    const categories = highSpendingCategories.join(", ");
    
    // Calculate potential overspending amount (simple estimation)
    const potentialOverspend = highSpendingCategories.reduce((total, category) => {
      const current = currentMonthCategoryTotals[category as ExpenseCategory];
      const previous = previousMonthCategoryTotals[category as ExpenseCategory];
      return total + (current - previous);
    }, 0);

    insights.push({
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "warning",
      message: `You might overspend ₹${potentialOverspend.toFixed(0)} unless you cut back on ${categories}.`,
      date: now.toISOString(),
    });
  }

  // Add some general tips based on spending patterns
  const highestCategory = Object.entries(currentMonthCategoryTotals)
    .reduce((max, [category, amount]) => 
      amount > max.amount ? { category, amount } : max, 
      { category: "", amount: 0 }
    );

  if (highestCategory.amount > 0) {
    const tipsByCategory: Record<string, string[]> = {
      food: [
        "Try meal planning to reduce food expenses.",
        "Consider cooking at home more often to save on restaurant bills.",
      ],
      transportation: [
        "Look into carpooling or public transportation to reduce costs.",
        "Plan your trips more efficiently to save on fuel.",
      ],
      entertainment: [
        "Consider free or low-cost entertainment options.",
        "Look for deals and discounts for entertainment activities.",
      ],
      shopping: [
        "Try a 24-hour waiting period before making non-essential purchases.",
        "Consider second-hand options for some purchases.",
      ],
      healthcare: [
        "Check if you're using in-network providers to reduce healthcare costs.",
        "Ask about generic medication options to save on prescriptions.",
      ],
    };

    const categoryTips = tipsByCategory[highestCategory.category] || 
      ["Review your budget to find areas where you can reduce spending."];

    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    
    insights.push({
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "tip",
      message: randomTip,
      date: now.toISOString(),
    });
  }

  return insights;
};

// Function to predict spending for the end of month
export const predictEndOfMonthSpending = (
  expenses: Expense[],
  previousMonthExpenses: Expense[]
): Record<ExpenseCategory, number> => {
  const predictions: Record<ExpenseCategory, number> = {
    food: 0,
    transportation: 0,
    housing: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    clothing: 0,
    education: 0,
    personal: 0,
    other: 0,
  };

  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - dayOfMonth;
  
  // Calculate daily average for current month by category
  const currentMonthCategoryTotals: Record<ExpenseCategory, number> = {
    food: 0,
    transportation: 0,
    housing: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    clothing: 0,
    education: 0,
    personal: 0,
    other: 0,
  };

  expenses.forEach((expense) => {
    currentMonthCategoryTotals[expense.category] += expense.amount;
  });

  // If we have at least a week of data, use it for prediction
  if (dayOfMonth >= 7) {
    // Predict based on daily average
    Object.entries(currentMonthCategoryTotals).forEach(([category, amount]) => {
      const dailyAverage = amount / dayOfMonth;
      predictions[category as ExpenseCategory] = amount + (dailyAverage * remainingDays);
    });
  } else {
    // Use last month's data as baseline if not enough current data
    const previousMonthCategoryTotals: Record<ExpenseCategory, number> = {
      food: 0,
      transportation: 0,
      housing: 0,
      utilities: 0,
      healthcare: 0,
      entertainment: 0,
      clothing: 0,
      education: 0,
      personal: 0,
      other: 0,
    };

    previousMonthExpenses.forEach((expense) => {
      previousMonthCategoryTotals[expense.category] += expense.amount;
    });

    Object.entries(previousMonthCategoryTotals).forEach(([category, amount]) => {
      // Add current spending plus projected from previous month pattern
      predictions[category as ExpenseCategory] = 
        currentMonthCategoryTotals[category as ExpenseCategory] + 
        (amount * remainingDays / daysInMonth);
    });
  }

  return predictions;
};

// Function to generate smart budget suggestions
export const generateBudgetSuggestions = (
  expenses: Expense[],
  previousMonthExpenses: Expense[],
  income: number
): { category: ExpenseCategory; suggestion: number }[] => {
  const suggestions: { category: ExpenseCategory; suggestion: number }[] = [];
  
  // Use spending predictions as a baseline
  const predictions = predictEndOfMonthSpending(expenses, previousMonthExpenses);
  
  // Calculate total predicted spending
  const totalPredicted = Object.values(predictions).reduce((sum, amount) => sum + amount, 0);
  
  // If spending is more than income, suggest adjustments
  if (totalPredicted > income) {
    // Sort categories by amount (highest first)
    const sortedCategories = Object.entries(predictions)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .map(([category]) => category as ExpenseCategory);
    
    // Target 10% reduction in discretionary categories (skip housing, utilities)
    const discretionaryCategories = sortedCategories.filter(
      category => !['housing', 'utilities'].includes(category)
    );
    
    // Calculate how much we need to reduce
    const reductionNeeded = totalPredicted - income;
    let reductionAssigned = 0;
    
    // Distribute reduction across discretionary categories
    discretionaryCategories.forEach(category => {
      const currentAmount = predictions[category];
      // How much of the remaining reduction should this category take
      const reductionAmount = Math.min(
        currentAmount * 0.15, // Don't reduce by more than 15%
        (reductionNeeded - reductionAssigned) * (currentAmount / totalPredicted * 2)
      );
      
      // If the reduction is significant, add a suggestion
      if (reductionAmount > 100) {
        suggestions.push({
          category,
          suggestion: currentAmount - reductionAmount
        });
        reductionAssigned += reductionAmount;
      }
    });
  }
  
  return suggestions;
};
