
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import BudgetOverview from "@/components/Dashboard/BudgetOverview";
import CarbonFootprint from "@/components/Dashboard/CarbonFootprint";
import RewardsOverview from "@/components/Dashboard/RewardsOverview";
import AIInsights from "@/components/Dashboard/AIInsights";
import RecentExpenses from "@/components/Dashboard/RecentExpenses";
import SmartSuggestions from "@/components/Dashboard/SmartSuggestions";
import AddExpenseForm from "@/components/AddExpenseForm";

const Dashboard = () => {
  const { user } = useApp();

  return (
    <div className="container px-4 py-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            Here's your financial and eco-impact summary
          </p>
        </div>
        <AddExpenseForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <BudgetOverview />
        <CarbonFootprint />
        <RewardsOverview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentExpenses />
        <AIInsights />
      </div>
      
      <div className="mt-6">
        <SmartSuggestions />
      </div>
    </div>
  );
};

export default Dashboard;
