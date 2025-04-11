
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { mockCarbonFootprint, mockCategoryDistribution } from "@/utils/mockData";
import { getCategoryColor } from "@/utils/categoryIcons";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";

const Carbon = () => {
  const { user } = useApp();
  const carbonData = mockCarbonFootprint();
  const categoryData = mockCategoryDistribution();
  
  const ecoTips = [
    "Use public transportation or carpool to reduce your carbon footprint from travel.",
    "Shop locally and choose seasonal produce to reduce emissions from long-distance shipping.",
    "Reduce meat consumption - even one vegetarian day per week can significantly lower your carbon impact.",
    "Consider investing in energy-efficient appliances for your home.",
    "Bring your own bags when shopping to reduce plastic waste."
  ];
  
  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Carbon Footprint</h1>
        <p className="text-muted-foreground">
          Track and reduce your environmental impact
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Impact Over Time</CardTitle>
              <CardDescription>Monthly CO₂ emissions based on your spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={carbonData.filter(d => d.value !== null)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} kg`, 'CO₂ Emissions']}
                      labelFormatter={(value) => `Month: ${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Carbon Impact"
                      stroke="#27ae60" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Your Eco Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="mb-2 rounded-full bg-eco-light p-4">
                  <Leaf className="h-10 w-10 text-eco-green" />
                </div>
                <p className="text-5xl font-bold text-eco-green mt-2">{user.carbonScore}</p>
                <p className="text-muted-foreground mt-2">
                  Better than 65% of users
                </p>
                <div className="mt-4 w-full">
                  <Button variant="outline" className="w-full text-eco-green border-eco-green hover:bg-eco-light">
                    Offset Carbon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Eco Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ecoTips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <Leaf className="h-5 w-5 text-eco-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Carbon Impact by Category</CardTitle>
          <CardDescription>See which spending categories contribute most to your carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${(value * 0.2).toFixed(1)} kg CO₂`, 'Carbon Impact']}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Carbon Impact"
                  fill="#27ae60"
                  radius={[4, 4, 0, 0]}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getCategoryColor(entry.name.toLowerCase() as any)} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Carbon;
