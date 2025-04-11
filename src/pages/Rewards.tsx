
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Calendar, Trophy, Check, Trees, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Rewards = () => {
  const { user, challenges, completeChallenge } = useApp();
  
  const handleCompleteChallenge = (id: string) => {
    completeChallenge(id);
  };
  
  const handleRedeemReward = (points: number, name: string) => {
    if (user.points >= points) {
      toast.success(`Redeemed ${name} for ${points} points!`);
    } else {
      toast.error(`Not enough points to redeem ${name}.`);
    }
  };
  
  const availableRewards = [
    { id: 'reward-1', name: 'Plant a Tree', points: 200, icon: <Trees className="h-5 w-5" /> },
    { id: 'reward-2', name: 'Dark Theme', points: 300, icon: <Gift className="h-5 w-5" /> },
    { id: 'reward-3', name: 'Donate to Clean Water Project', points: 500, icon: <Gift className="h-5 w-5" /> },
  ];
  
  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Rewards & Challenges</h1>
        <p className="text-muted-foreground">
          Complete challenges, earn points, and redeem rewards
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Challenges</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.filter(c => !c.completed).map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{challenge.title}</CardTitle>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-eco-light text-eco-green">
                          +{challenge.points} pts
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-eco-green text-eco-green hover:bg-eco-light"
                        onClick={() => handleCompleteChallenge(challenge.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.filter(c => c.completed).map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{challenge.title}</CardTitle>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-eco-light p-4 mb-4">
                  <Trophy className="h-8 w-8 text-eco-green" />
                </div>
                <p className="text-4xl font-bold">{user.points}</p>
                <p className="text-muted-foreground mt-2">Total Points Earned</p>
                
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Level Progress</span>
                    <span>{Math.min(user.points, 1000)} / 1000</span>
                  </div>
                  <Progress value={(user.points / 1000) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Redeem Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-eco-light p-2 rounded-full">
                          {reward.icon}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{reward.name}</p>
                          <p className="text-sm text-muted-foreground">{reward.points} points</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-eco-green hover:bg-eco-dark"
                      onClick={() => handleRedeemReward(reward.points, reward.name)}
                      disabled={user.points < reward.points}
                    >
                      Redeem
                    </Button>
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

export default Rewards;
