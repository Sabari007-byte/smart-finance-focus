
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { ExpenseCategory } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryColor } from "@/utils/categoryIcons";

const Budget = () => {
  const { budget, getCategoryTotal } = useApp();

  const categoryBudgets = budget.categories.map((cat) => {
    const spent = getCategoryTotal(cat.category);
    const percentage = (spent / cat.limit) * 100;
    return {
      ...cat,
      spent,
      percentage,
    };
  });

  // Data for the chart
  const chartData = categoryBudgets.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    spent: cat.spent,
    limit: cat.limit,
  }));

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Budget Planning</h1>
        <p className="text-muted-foreground">
          Manage your monthly budget and track spending
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Amount']}
                      labelFormatter={(value) => `Category: ${value}`}
                    />
                    <Bar dataKey="spent" name="Spent" fill="#27ae60" />
                    <Bar dataKey="limit" name="Budget Limit" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBudgets.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat.category)}
                        <span className="capitalize">{cat.category}</span>
                      </div>
                      <div className="text-sm">
                        ₹{cat.spent.toFixed(0)} / ₹{cat.limit}
                      </div>
                    </div>
                    <Progress 
                      value={cat.percentage} 
                      className="h-2"
                      style={{
                        backgroundColor: 'hsl(var(--secondary))',
                      }}
                    />
                    <style jsx>{`
                      .progress-bar {
                        background-color: ${getCategoryColor(cat.category)};
                      }
                    `}</style>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Budget;
