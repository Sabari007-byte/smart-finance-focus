
import { useApp } from "@/context/AppContext";
import DashboardCard from "./DashboardCard";
import { Brain, AlertTriangle, Lightbulb, Trophy } from "lucide-react";

const AIInsights = () => {
  const { insights } = useApp();
  
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

  // Get only the most recent 5 insights
  const recentInsights = insights.slice(0, 5);

  return (
    <DashboardCard title="AI Insights" icon={<Brain className="h-5 w-5" />}>
      <div className="space-y-3">
        {recentInsights.length > 0 ? (
          recentInsights.map((insight) => (
            <div key={insight.id} className="border rounded-lg p-3">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <p className="text-sm">{insight.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(insight.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No insights available yet. Add more expenses to get personalized insights.
          </p>
        )}
      </div>
    </DashboardCard>
  );
};

export default AIInsights;
