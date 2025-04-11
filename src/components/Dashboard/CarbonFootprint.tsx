
import { useApp } from "@/context/AppContext";
import DashboardCard from "./DashboardCard";
import { Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CarbonFootprint = () => {
  const { getCarbonImpact, user } = useApp();
  const navigate = useNavigate();
  const carbonImpact = getCarbonImpact();
  
  // Calculate a score out of 100, lower is better for carbon impact
  const score = Math.max(0, user.carbonScore);

  // Determine status based on score
  const getStatusText = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  // Determine color based on score
  const getStatusColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const handleOffsetCarbon = () => {
    navigate("/carbon");
  };

  return (
    <DashboardCard title="Carbon Footprint" icon={<Leaf className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="mb-2 rounded-full bg-eco-light p-3">
            <Leaf className="h-6 w-6 text-eco-green" />
          </div>
          <h3 className="text-xl font-semibold">Eco Score</h3>
          <p className={`text-3xl font-bold ${getStatusColor()}`}>{score}</p>
          <p className="text-sm text-muted-foreground">{getStatusText()}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly Impact</span>
            <span className="text-sm font-medium">
              {carbonImpact.toFixed(1)} kg CO<sub>2</sub>
            </span>
          </div>
          <Progress value={Math.min((carbonImpact / 200) * 100, 100)} className="h-2" />
        </div>

        <Button 
          variant="outline" 
          className="w-full text-eco-green border-eco-green hover:bg-eco-light"
          onClick={handleOffsetCarbon}
        >
          Offset Carbon
        </Button>
      </div>
    </DashboardCard>
  );
};

export default CarbonFootprint;
