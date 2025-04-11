
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ExpenseCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VoiceInputProps {
  onComplete?: () => void;
}

const VoiceInput = ({ onComplete }: VoiceInputProps) => {
  const { user, addExpense } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processingResult, setProcessingResult] = useState<{
    amount: number | null;
    category: ExpenseCategory | null;
    notes: string | null;
  } | null>(null);

  const isVoiceEligible = user.ageGroup === 'senior';

  // Function to parse voice input into expense data
  const parseExpenseFromText = (text: string) => {
    // Simple regex-based NLP parsing
    // Looking for patterns like "spent 200 on medicine" or "paid 500 for food"
    const amountRegex = /(?:spent|paid|₹|rs|rupees|amount)\s*(\d+)/i;
    const amountMatch = text.match(amountRegex);
    
    // Extract category using keyword matching
    const categoryKeywords: Record<ExpenseCategory, string[]> = {
      food: ['food', 'lunch', 'dinner', 'breakfast', 'meal', 'restaurant', 'grocery'],
      transportation: ['transport', 'bus', 'train', 'taxi', 'uber', 'auto', 'fuel', 'petrol', 'gas'],
      housing: ['rent', 'house', 'apartment', 'maintenance'],
      utilities: ['bill', 'electricity', 'water', 'gas', 'internet', 'wifi', 'phone'],
      healthcare: ['medicine', 'doctor', 'hospital', 'medical', 'pharmacy', 'health'],
      entertainment: ['movie', 'concert', 'show', 'entertainment', 'subscription', 'netflix'],
      clothing: ['clothes', 'dress', 'shirt', 'pants', 'clothing', 'shoes'],
      education: ['book', 'tuition', 'course', 'class', 'education', 'school', 'college'],
      personal: ['personal', 'haircut', 'salon', 'grooming'],
      other: ['other', 'miscellaneous']
    };
    
    let detectedCategory: ExpenseCategory | null = null;
    const lowercaseText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        detectedCategory = category as ExpenseCategory;
        break;
      }
    }
    
    // If no category is detected, default to "other"
    if (!detectedCategory) {
      detectedCategory = "other";
    }
    
    // Extract any additional notes
    let notes = text;
    if (amountMatch) {
      notes = notes.replace(amountMatch[0], '');
    }
    notes = notes.replace(/spent|paid|for|on|rupees|rs|₹/gi, '').trim();
    
    return {
      amount: amountMatch ? parseInt(amountMatch[1], 10) : null,
      category: detectedCategory,
      notes: notes || null
    };
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setProcessingResult(null);
    toast.info("Listening... Please speak clearly.");
    
    // Simulate voice recognition (in a real app, use Web Speech API)
    setTimeout(() => {
      // Simulated transcript
      const simulatedInput = "I spent 200 rupees on medicine at the pharmacy yesterday";
      setTranscript(simulatedInput);
      
      // Process the transcript
      const result = parseExpenseFromText(simulatedInput);
      setProcessingResult(result);
      
      // Stop recording
      setIsRecording(false);
      
      if (result.amount && result.category) {
        toast.success(`Detected: ₹${result.amount} for ${result.category}`);
        
        // Add the expense
        addExpense({
          amount: result.amount,
          category: result.category,
          date: new Date().toISOString(),
          notes: result.notes || undefined,
        });
        
        if (onComplete) {
          onComplete();
        }
      } else {
        toast.error("Could not fully understand. Please try again or enter manually.");
      }
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.info("Stopped listening.");
  };

  if (!isVoiceEligible) {
    return null;
  }

  return (
    <div className="border p-4 rounded-lg bg-muted/20">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-medium">Voice Input</h3>
        
        {!isRecording && !transcript && (
          <Button 
            onClick={startRecording} 
            className="bg-eco-green hover:bg-eco-dark text-white h-16 w-16 rounded-full flex items-center justify-center"
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}
        
        {isRecording && (
          <>
            <div className="animate-pulse flex space-x-2 items-center">
              <span className="h-3 w-3 bg-red-500 rounded-full"></span>
              <span className="text-sm">Listening...</span>
            </div>
            <Button 
              onClick={stopRecording} 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <MicOff className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}
        
        {transcript && (
          <div className="w-full space-y-2">
            <div className="p-3 bg-secondary rounded-lg text-sm">
              <p className="font-medium mb-1">I heard:</p>
              <p>"{transcript}"</p>
            </div>
            
            {processingResult && (
              <div className="p-3 bg-white border rounded-lg">
                <p className="font-medium mb-2">Expense details:</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{processingResult.amount ? `₹${processingResult.amount}` : 'Not detected'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium capitalize">{processingResult.category || 'Not detected'}</span>
                  </li>
                  {processingResult.notes && (
                    <li className="flex justify-between">
                      <span>Notes:</span>
                      <span className="font-medium">{processingResult.notes}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            <Button onClick={startRecording} className="w-full bg-eco-green hover:bg-eco-dark">
              <Mic className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
