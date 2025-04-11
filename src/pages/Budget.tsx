
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { ExpenseCategory } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryColor } from "@/utils/categoryIcons";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Budget = () => {
  const { budget, getCategoryTotal, updateBudgetCategory } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);

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

  const handleEditCategory = (category: ExpenseCategory, currentLimit: number) => {
    setSelectedCategory(category);
    setNewLimit(currentLimit);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedCategory && newLimit > 0) {
      updateBudgetCategory(selectedCategory, newLimit);
      setIsDialogOpen(false);
    }
  };

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
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          ₹{cat.spent.toFixed(0)} / ₹{cat.limit}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleEditCategory(cat.category, cat.limit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress 
                      value={cat.percentage} 
                      className="h-2"
                      style={{
                        backgroundColor: 'hsl(var(--secondary))',
                        // Apply the category color for the progress bar
                        '--progress-foreground': getCategoryColor(cat.category),
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Limit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              {selectedCategory && getCategoryIcon(selectedCategory)}
              <span className="capitalize">{selectedCategory}</span>
            </div>
            <div className="space-y-2">
              <label htmlFor="budget-limit" className="text-sm font-medium">New Budget Limit (₹)</label>
              <Input
                id="budget-limit"
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(Number(e.target.value))}
                min={1}
                step={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budget;
