
import { useApp } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "./DashboardCard";
import { Wallet } from "lucide-react";

const BudgetOverview = () => {
  const { getBudgetProgress, getTotalSpent, budget } = useApp();
  const progress = getBudgetProgress();
  const totalSpent = getTotalSpent();
  const remaining = budget.totalLimit - totalSpent;

  // Determine the color based on the progress
  const getStatusColor = () => {
    if (progress > 90) return "text-red-500";
    if (progress > 75) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <DashboardCard title="Budget Overview" icon={<Wallet className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly Spending</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-xl font-semibold">₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-semibold">₹{remaining.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default BudgetOverview;
