
import { ReactNode } from "react";
import { 
  ShoppingCart, 
  Car, 
  Home, 
  Lightbulb, 
  Stethoscope, 
  Film, 
  Shirt, 
  GraduationCap, 
  User, 
  HelpCircle 
} from "lucide-react";
import { ExpenseCategory } from "@/types";

export const getCategoryIcon = (category: ExpenseCategory): ReactNode => {
  const iconProps = { size: 20, className: "text-eco-green" };
  
  switch (category) {
    case 'food':
      return <ShoppingCart {...iconProps} />;
    case 'transportation':
      return <Car {...iconProps} />;
    case 'housing':
      return <Home {...iconProps} />;
    case 'utilities':
      return <Lightbulb {...iconProps} />;
    case 'healthcare':
      return <Stethoscope {...iconProps} />;
    case 'entertainment':
      return <Film {...iconProps} />;
    case 'clothing':
      return <Shirt {...iconProps} />;
    case 'education':
      return <GraduationCap {...iconProps} />;
    case 'personal':
      return <User {...iconProps} />;
    case 'other':
      return <HelpCircle {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};

export const getCategoryColor = (category: ExpenseCategory): string => {
  switch (category) {
    case 'food':
      return '#e84393';
    case 'transportation':
      return '#0984e3';
    case 'housing':
      return '#6c5ce7';
    case 'utilities':
      return '#00b894';
    case 'healthcare':
      return '#00cec9';
    case 'entertainment':
      return '#fdcb6e';
    case 'clothing':
      return '#e17055';
    case 'education':
      return '#74b9ff';
    case 'personal':
      return '#a29bfe';
    case 'other':
      return '#b2bec3';
    default:
      return '#dfe6e9';
  }
};
