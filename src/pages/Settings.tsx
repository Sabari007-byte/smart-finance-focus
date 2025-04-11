
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAgeGroup } from "@/types";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { user, updateUser } = useApp();
  const [formData, setFormData] = useState({
    name: user.name,
    ageGroup: user.ageGroup,
    monthlyIncome: user.monthlyIncome.toString(),
    financialGoal: user.financialGoal,
    targetAmount: user.targetAmount?.toString() || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveProfile = () => {
    updateUser({
      name: formData.name,
      ageGroup: formData.ageGroup as UserAgeGroup,
      monthlyIncome: parseFloat(formData.monthlyIncome),
      financialGoal: formData.financialGoal,
      targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
    });
    toast.success("Profile updated successfully");
  };

  const handleToggle = () => {
    toast.success("Setting updated");
  };

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select
                    value={formData.ageGroup}
                    onValueChange={(value) => handleChange("ageGroup", value)}
                  >
                    <SelectTrigger id="ageGroup">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teen">Teen</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financialGoal">Financial Goal</Label>
                  <Input
                    id="financialGoal"
                    value={formData.financialGoal}
                    onChange={(e) => handleChange("financialGoal", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (Optional)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => handleChange("targetAmount", e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full bg-eco-green hover:bg-eco-dark" 
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme Preference</p>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </p>
                  </div>
                  <Switch onCheckedChange={handleToggle} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Accessibility Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Enable larger text and buttons
                    </p>
                  </div>
                  <Switch onCheckedChange={handleToggle} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Voice Input</p>
                    <p className="text-sm text-muted-foreground">
                      Enable voice commands for expense logging
                    </p>
                  </div>
                  <Switch checked={user.ageGroup === 'senior'} onCheckedChange={handleToggle} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Budget Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you're close to exceeding your budget
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={handleToggle} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Challenges</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new challenges
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={handleToggle} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">AI Insights</p>
                    <p className="text-sm text-muted-foreground">
                      Get personalized spending and saving tips
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={handleToggle} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Carbon Impact Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your carbon footprint
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={handleToggle} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
