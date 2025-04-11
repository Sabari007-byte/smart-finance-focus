
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Trophy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";

const Insights = () => {
  const { 
    insights, 
    predictedSpending, 
    getBudgetSuggestions, 
    expenses, 
    previousMonthExpenses,
    user
  } = useApp();
  
  const navigate = useNavigate();
  
  // Get budget recommendations
  const budgetSuggestions = getBudgetSuggestions();
  
  // Calculate monthly trend data
  const calculateMonthlyTrend = () => {
    // Get current month total
    const currentMonthTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get previous month total
    const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Create dummy data for the past 6 months (in a real app, this would come from the database)
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = now.getMonth();
    
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = monthNames[monthIndex];
      
      let value;
      if (i === 0) {
        // Current month
        value = currentMonthTotal;
      } else if (i === 1) {
        // Previous month
        value = previousMonthTotal;
      } else {
        // Generate some reasonable random data for earlier months
        const baseValue = (previousMonthTotal * 0.8) + (previousMonthTotal * 0.4 * Math.random());
        value = baseValue;
      }
      
      trendData.push({
        name: monthName,
        value: value
      });
    }
    
    return trendData;
  };
  
  const trendData = calculateMonthlyTrend();
  
  // Group insights by type
  const warningInsights = insights.filter(insight => insight.type === 'warning');
  const tipInsights = insights.filter(insight => insight.type === 'tip');
  const achievementInsights = insights.filter(insight => insight.type === 'achievement');
  
  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Insights & Analysis</h1>
        <p className="text-muted-foreground">
          Smart financial recommendations and spending predictions
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Your monthly spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Total Spending']}
                      labelFormatter={(value) => `Month: ${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Monthly Spending"
                      stroke="#27ae60" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>End of Month Prediction</CardTitle>
              <CardDescription>Based on your current spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Projected Total</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    ₹{Object.values(predictedSpending).reduce((sum, val) => sum + val, 0).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.monthlyIncome > 0 && 
                      `${(Object.values(predictedSpending).reduce((sum, val) => sum + val, 0) / user.monthlyIncome * 100).toFixed(0)}% of your income`
                    }
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Top Categories</h3>
                  <div className="space-y-2">
                    {Object.entries(predictedSpending)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center">
                          <p className="text-sm capitalize">{category}</p>
                          <p className="text-sm font-medium">₹{amount.toFixed(0)}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/budget')}
                >
                  View Budget Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {warningInsights.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <CardTitle>Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warningInsights.slice(0, 3).map(insight => (
                  <div key={insight.id} className="border-l-4 border-orange-500 pl-3 py-2">
                    <p className="text-sm">{insight.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(insight.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {tipInsights.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <CardTitle>Smart Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tipInsights.slice(0, 3).map(insight => (
                  <div key={insight.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="text-sm">{insight.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(insight.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {achievementInsights.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle>Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievementInsights.slice(0, 3).map(insight => (
                  <div key={insight.id} className="border-l-4 border-yellow-500 pl-3 py-2">
                    <p className="text-sm">{insight.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(insight.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {budgetSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-eco-green" />
              <CardTitle>Budget Optimization Suggestions</CardTitle>
            </div>
            <CardDescription>
              Smart recommendations to help you stay within your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetSuggestions.map(suggestion => (
                <div key={suggestion.category} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium capitalize mb-2">{suggestion.category}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Suggested monthly limit:
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{suggestion.suggestion.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Insights;
