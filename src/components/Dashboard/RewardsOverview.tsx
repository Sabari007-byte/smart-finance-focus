
import { useApp } from "@/context/AppContext";
import DashboardCard from "./DashboardCard";
import { Award, Leaf, Wallet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Challenge } from "@/types";

const RewardsOverview = () => {
  const { user, challenges } = useApp();
  const navigate = useNavigate();
  const activeChallenges = challenges.filter(c => !c.completed).slice(0, 3);

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'budget':
        return <Wallet className="h-4 w-4 text-blue-500" />;
      case 'eco':
        return <Leaf className="h-4 w-4 text-green-500" />;
      case 'daily':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  return (
    <DashboardCard title="Rewards & Challenges" icon={<Award className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-secondary rounded-lg">
          <div className="bg-eco-green rounded-full p-2">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-2xl font-semibold">{user.points}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Active Challenges</h4>
          <div className="space-y-3">
            {activeChallenges.length > 0 ? (
              activeChallenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {getTypeIcon(challenge.type)}
                        <p className="font-medium">{challenge.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                    <span className="bg-eco-light text-eco-green text-xs font-medium px-2 py-1 rounded-full">
                      +{challenge.points} pts
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active challenges</p>
            )}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/rewards')}
        >
          View All Challenges
        </Button>
      </div>
    </DashboardCard>
  );
};

export default RewardsOverview;
