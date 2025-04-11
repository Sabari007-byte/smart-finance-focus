
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Calendar, Trophy, Check, Trees, Gift, Plus, Leaf, Wallet, UtilityPole } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Challenge } from "@/types";

const Rewards = () => {
  const { user, challenges, completeChallenge, addNewChallenge } = useApp();
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    points: 50,
    type: "budget" as "budget" | "eco" | "daily",
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
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
  
  const handleCreateChallenge = () => {
    if (!newChallenge.title || !newChallenge.description) {
      toast.error("Please fill all required fields");
      return;
    }
    
    addNewChallenge({
      ...newChallenge,
      completed: false
    });
    
    setNewChallenge({
      title: "",
      description: "",
      points: 50,
      type: "budget" as "budget" | "eco" | "daily",
    });
    
    setIsCreateDialogOpen(false);
  };
  
  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'budget':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      case 'eco':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'daily':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const budgetChallenges = challenges.filter(c => c.type === 'budget' && !c.completed);
  const ecoChallenges = challenges.filter(c => c.type === 'eco' && !c.completed);
  const dailyChallenges = challenges.filter(c => c.type === 'daily' && !c.completed);
  
  const availableRewards = [
    { id: 'reward-1', name: 'Plant a Tree', points: 200, icon: <Trees className="h-5 w-5" /> },
    { id: 'reward-2', name: 'Dark Theme', points: 300, icon: <Gift className="h-5 w-5" /> },
    { id: 'reward-3', name: 'Donate to Clean Water Project', points: 500, icon: <Gift className="h-5 w-5" /> },
    { id: 'reward-4', name: 'Custom Budget Template', points: 400, icon: <Wallet className="h-5 w-5" /> },
    { id: 'reward-5', name: 'Carbon Offset Certificate', points: 600, icon: <Leaf className="h-5 w-5" /> },
    { id: 'reward-6', name: 'Premium Analytics (1 month)', points: 800, icon: <UtilityPole className="h-5 w-5" /> },
  ];
  
  return (
    <div className="container px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rewards & Challenges</h1>
          <p className="text-muted-foreground">
            Complete challenges, earn points, and redeem rewards
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-eco-green hover:bg-eco-dark">
              <Plus className="mr-2 h-4 w-4" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Challenge</DialogTitle>
              <DialogDescription>
                Add a personal challenge to track and earn points when completed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  placeholder="e.g., No Coffee for a Week"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Describe your challenge"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="10"
                    max="200"
                    value={newChallenge.points}
                    onChange={(e) => setNewChallenge({...newChallenge, points: parseInt(e.target.value) || 50})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newChallenge.type} 
                    onValueChange={(value: "budget" | "eco" | "daily") => 
                      setNewChallenge({...newChallenge, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="eco">Eco-friendly</SelectItem>
                      <SelectItem value="daily">Daily Habit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateChallenge} className="bg-eco-green hover:bg-eco-dark">Create Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Challenges</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="by-type">By Type</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.filter(c => !c.completed).map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(challenge.type)}
                          <CardTitle className="text-base">{challenge.title}</CardTitle>
                        </div>
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
                        <div className="flex items-center gap-2">
                          {getTypeIcon(challenge.type)}
                          <CardTitle className="text-base">{challenge.title}</CardTitle>
                        </div>
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
            
            <TabsContent value="by-type">
              <div className="space-y-6">
                {/* Budget Challenges */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-blue-500" />
                    Budget Challenges
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgetChallenges.length > 0 ? (
                      budgetChallenges.map((challenge) => (
                        <Card key={challenge.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{challenge.title}</CardTitle>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                +{challenge.points} pts
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                            <Button 
                              variant="outline" 
                              className="w-full mt-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                              onClick={() => handleCompleteChallenge(challenge.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Complete
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-2">No active budget challenges</p>
                    )}
                  </div>
                </div>
                
                {/* Eco Challenges */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Leaf className="mr-2 h-5 w-5 text-green-500" />
                    Eco-friendly Challenges
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ecoChallenges.length > 0 ? (
                      ecoChallenges.map((challenge) => (
                        <Card key={challenge.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{challenge.title}</CardTitle>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                +{challenge.points} pts
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                            <Button 
                              variant="outline" 
                              className="w-full mt-2 border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => handleCompleteChallenge(challenge.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Complete
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-2">No active eco-friendly challenges</p>
                    )}
                  </div>
                </div>
                
                {/* Daily Challenges */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-orange-500" />
                    Daily Habit Challenges
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dailyChallenges.length > 0 ? (
                      dailyChallenges.map((challenge) => (
                        <Card key={challenge.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{challenge.title}</CardTitle>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                +{challenge.points} pts
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                            <Button 
                              variant="outline" 
                              className="w-full mt-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                              onClick={() => handleCompleteChallenge(challenge.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Complete
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-2">No active daily challenges</p>
                    )}
                  </div>
                </div>
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
