
import { useApp } from "@/context/AppContext";
import DashboardCard from "./DashboardCard";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { ExpenseCategory } from "@/types";

const SmartSuggestions = () => {
  const { 
    predictedSpending, 
    budget, 
    getBudgetSuggestions 
  } = useApp();
  
  const budgetSuggestions = getBudgetSuggestions();
  
  // Check if any category is predicted to exceed its budget
  const categoryWarnings = budget.categories
    .filter(cat => {
      const predicted = predictedSpending[cat.category] || 0;
      return predicted > cat.limit;
    })
    .map(cat => {
      const predicted = predictedSpending[cat.category] || 0;
      const overage = predicted - cat.limit;
      const percentOver = ((overage / cat.limit) * 100).toFixed(0);
      
      return {
        category: cat.category,
        predicted,
        overage,
        percentOver
      };
    })
    .sort((a, b) => b.overage - a.overage)
    .slice(0, 3); // Top 3 most concerning categories
  
  // Generic tips based on category
  const categoryTips: Record<ExpenseCategory, string[]> = {
    food: [
      "Try meal prepping to save on food expenses.",
      "Consider buying groceries in bulk to save money.",
      "Use apps to find restaurant deals and discounts."
    ],
    transportation: [
      "Carpooling can significantly reduce your transportation costs.",
      "Consider using public transportation for regular commutes.",
      "Plan your trips efficiently to save on fuel."
    ],
    housing: [
      "Reduce utility bills by using energy-efficient appliances.",
      "Consider a roommate to split housing costs.",
      "Negotiate with your landlord for a better rent."
    ],
    utilities: [
      "Unplug electronics when not in use to save electricity.",
      "Consider installing LED bulbs to reduce energy consumption.",
      "Fix leaky faucets to save on water bills."
    ],
    healthcare: [
      "Look for generic medication options to save on prescriptions.",
      "Take advantage of preventive care services covered by insurance.",
      "Consider telehealth options for routine consultations."
    ],
    entertainment: [
      "Look for free community events and activities.",
      "Share subscription services with family or friends.",
      "Use your library card for free books, movies, and more."
    ],
    clothing: [
      "Consider second-hand shops for quality clothing at lower prices.",
      "Build a capsule wardrobe with versatile pieces.",
      "Wait for seasonal sales to purchase clothing items."
    ],
    education: [
      "Look for scholarships and grants to reduce education costs.",
      "Consider used textbooks or digital versions to save money.",
      "Take advantage of free online learning resources."
    ],
    personal: [
      "DIY personal care items when possible.",
      "Look for sales and use coupons for personal care products.",
      "Consider multi-purpose products to save money."
    ],
    other: [
      "Review all recurring subscriptions and cancel unused ones.",
      "Set a waiting period before making non-essential purchases.",
      "Look for cashback or rewards programs for regular purchases."
    ]
  };
  
  // Select a random tip for a category
  const getRandomTip = (category: ExpenseCategory) => {
    const tips = categoryTips[category] || categoryTips.other;
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  return (
    <DashboardCard title="Smart Suggestions" icon={<Brain className="h-5 w-5" />}>
      <div className="space-y-4">
        {categoryWarnings.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Predicted Budget Alerts
            </h3>
            
            {categoryWarnings.map((warning) => (
              <div key={warning.category} className="border-l-4 border-amber-500 pl-3 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {warning.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Projected to exceed by ₹{warning.overage.toFixed(0)} ({warning.percentOver}%)
                    </p>
                  </div>
                  <div className="text-amber-500 text-xs font-medium px-2 py-1 bg-amber-50 rounded-full">
                    Action needed
                  </div>
                </div>
                <p className="text-xs mt-2">
                  {getRandomTip(warning.category)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-l-4 border-green-500 pl-3 py-2">
            <p className="text-sm font-medium">
              You're on track with your budget! Keep it up.
            </p>
          </div>
        )}
        
        {budgetSuggestions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              Budget Optimization Suggestions
            </h3>
            
            {budgetSuggestions.map((suggestion) => (
              <div key={suggestion.category} className="border-l-4 border-blue-500 pl-3 py-2 mb-2">
                <p className="text-sm font-medium capitalize">
                  Consider limiting {suggestion.category} to ₹{suggestion.suggestion.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
            <TrendingUp className="h-4 w-4 text-eco-green" />
            Spending Predictions
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(predictedSpending)
              .filter(([, amount]) => amount > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([category, amount]) => (
                <div key={category} className="bg-secondary p-2 rounded">
                  <p className="text-xs capitalize">{category}</p>
                  <p className="text-sm font-medium">₹{amount.toFixed(0)}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default SmartSuggestions;
