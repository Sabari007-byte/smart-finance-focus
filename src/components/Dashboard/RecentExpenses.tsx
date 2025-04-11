
import { useApp } from "@/context/AppContext";
import DashboardCard from "./DashboardCard";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/utils/categoryIcons";

const RecentExpenses = () => {
  const { expenses } = useApp();
  
  // Get the 4 most recent expenses
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <DashboardCard title="Recent Expenses" icon={<Clock className="h-5 w-5" />}>
      <div className="space-y-4">
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center border-b pb-2">
                <div className="bg-eco-light p-2 rounded-full">
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium capitalize">{expense.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-medium">₹{expense.amount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent expenses</p>
        )}
        
        <Button variant="outline" className="w-full">View All Expenses</Button>
      </div>
    </DashboardCard>
  );
};

export default RecentExpenses;
