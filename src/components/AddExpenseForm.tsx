
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ExpenseCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import VoiceInput from "./VoiceInput";

const categoryOptions: { value: ExpenseCategory; label: string }[] = [
  { value: "food", label: "Food" },
  { value: "transportation", label: "Transportation" },
  { value: "housing", label: "Housing" },
  { value: "utilities", label: "Utilities" },
  { value: "healthcare", label: "Healthcare" },
  { value: "entertainment", label: "Entertainment" },
  { value: "clothing", label: "Clothing" },
  { value: "education", label: "Education" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

const AddExpenseForm = () => {
  const { addExpense, user } = useApp();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    addExpense({
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      notes: notes || undefined,
    });

    // Reset form
    setAmount("");
    setCategory("food");
    setNotes("");
    setOpen(false);
  };

  const handleVoiceComplete = () => {
    setShowVoiceInput(false);
    setOpen(false);
  };

  const isVoiceEligible = user.ageGroup === 'senior';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-eco-green hover:bg-eco-dark text-white">
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record your expense details below.
          </DialogDescription>
        </DialogHeader>
        
        {showVoiceInput ? (
          <VoiceInput onComplete={handleVoiceComplete} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount (₹)
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ExpenseCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional details"
              />
            </div>

            {isVoiceEligible && (
              <Card className="border-dashed border-eco-green">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Voice Input</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-eco-green text-eco-green hover:bg-eco-light"
                    onClick={() => setShowVoiceInput(true)}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Add Expense by Voice
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-eco-green hover:bg-eco-dark">
                Save Expense
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseForm;
