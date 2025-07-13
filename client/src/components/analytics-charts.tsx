import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Thermometer, Droplets, Leaf, Lightbulb } from "lucide-react";
import type { DemandTrend } from "@shared/schema";

export default function AnalyticsCharts() {
  const { data: trends = [] } = useQuery<DemandTrend[]>({
    queryKey: ["/api/trends", "24"],
  });

  const chartData = trends.map(trend => ({
    hour: `${trend.hour}:00`,
    temperature: trend.temperature,
    salesVolume: trend.salesVolume,
  }));

  const environmentalEffects = [
    {
      title: "Temperature Effect",
      description: "Cold beverages, ice cream, fans",
      impact: "+68%",
      icon: Thermometer,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "Humidity Effect", 
      description: "Dehumidifiers, hair care",
      impact: "+23%",
      icon: Droplets,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Air Quality Effect",
      description: "Air purifiers, masks, plants",
      impact: "+15%",
      icon: Leaf,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <>
      {/* Demand Trends Chart */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">24-Hour Demand Trends</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-walmart-blue-500 rounded-full"></div>
                <span className="text-gray-600">Temperature Impact</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-walmart-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Sales Volume</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(207, 100%, 55%)"
                  strokeWidth={2}
                  name="Temperature (°F)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="salesVolume" 
                  stroke="hsl(45, 100%, 55%)"
                  strokeWidth={2}
                  name="Sales Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact Analysis */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Environmental Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {environmentalEffects.map((effect, index) => {
              const Icon = effect.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${effect.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`${effect.iconColor} w-5 h-5`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{effect.title}</p>
                      <p className="text-sm text-gray-600">{effect.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{effect.impact}</p>
                    <p className="text-sm text-gray-600">sales boost</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-walmart-yellow-50 border border-walmart-yellow-500 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="text-walmart-yellow-600 mt-1 w-5 h-5" />
              <div>
                <p className="font-medium text-walmart-yellow-800">AI Insight</p>
                <p className="text-sm text-walmart-yellow-700 mt-1">
                  Current conditions suggest a 34% increase in cooling product demand over the next 6 hours. 
                  Consider expanding refrigerated beverage displays.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
