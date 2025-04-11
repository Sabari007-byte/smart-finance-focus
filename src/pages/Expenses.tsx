
import { useApp } from "@/context/AppContext";
import AddExpenseForm from "@/components/AddExpenseForm";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getCategoryColor } from "@/utils/categoryIcons";

const Expenses = () => {
  const { expenses, getCategoryTotal } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter expenses based on search term
  const filteredExpenses = sortedExpenses.filter(
    (expense) =>
      expense.category.includes(searchTerm.toLowerCase()) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate total for each category
  const categoryData = [
    { name: 'Food', value: getCategoryTotal('food') },
    { name: 'Transportation', value: getCategoryTotal('transportation') },
    { name: 'Housing', value: getCategoryTotal('housing') },
    { name: 'Utilities', value: getCategoryTotal('utilities') },
    { name: 'Healthcare', value: getCategoryTotal('healthcare') },
    { name: 'Entertainment', value: getCategoryTotal('entertainment') },
    { name: 'Clothing', value: getCategoryTotal('clothing') },
    { name: 'Education', value: getCategoryTotal('education') },
    { name: 'Personal', value: getCategoryTotal('personal') },
    { name: 'Other', value: getCategoryTotal('other') },
  ].filter(item => item.value > 0);

  return (
    <div className="container px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Expense Management</h1>
          <p className="text-muted-foreground">
            Track and manage your expenses
          </p>
        </div>
        <AddExpenseForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Carbon</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.slice(0, 10).map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <span className="inline-block">
                            {getCategoryIcon(expense.category)}
                          </span>
                          <span className="capitalize">{expense.category}</span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(expense.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>₹{expense.amount}</TableCell>
                        <TableCell>{expense.notes || "-"}</TableCell>
                        <TableCell>
                          {expense.carbonImpact.toFixed(1)} kg
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getCategoryColor(entry.name.toLowerCase() as any)} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`₹${value}`, 'Amount']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
