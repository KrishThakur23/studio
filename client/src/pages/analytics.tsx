import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Package, Users, Target, Clock } from "lucide-react";
import Sidebar from "@/components/sidebar";
import type { DemandTrend, EnvironmentalData, Recommendation } from "@shared/schema";

export default function Analytics() {
  const { data: trends = [] } = useQuery<DemandTrend[]>({
    queryKey: ["/api/trends", "24"],
  });

  const { data: recommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations/all"],
  });

  const { data: environmentalHistory = [] } = useQuery<EnvironmentalData[]>({
    queryKey: ["/api/environmental/history", "24"],
  });

  // Analytics calculations
  const totalRecommendations = recommendations.length;
  const appliedRecommendations = recommendations.filter(r => !r.isActive).length;
  const totalExpectedRevenue = recommendations.reduce((sum, r) => sum + r.expectedImpact, 0);
  const averageScore = recommendations.length > 0 ? Math.round(recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length) : 0;

  const categoryData = recommendations.reduce((acc, rec) => {
    acc[rec.category] = (acc[rec.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  
  const priorityData = [
    { priority: 'High', count: recommendations.filter(r => r.priority === 'high').length, color: '#ef4444' },
    { priority: 'Medium', count: recommendations.filter(r => r.priority === 'medium').length, color: '#f97316' },
    { priority: 'Low', count: recommendations.filter(r => r.priority === 'low').length, color: '#8b5cf6' },
  ];

  const performanceMetrics = [
    {
      title: "Total Recommendations",
      value: totalRecommendations.toString(),
      change: "+12% vs last week",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Applied Recommendations",
      value: appliedRecommendations.toString(),
      change: `${Math.round((appliedRecommendations / totalRecommendations) * 100)}% success rate`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Expected Revenue Impact",
      value: `$${(totalExpectedRevenue / 1000).toFixed(1)}K`,
      change: "+24% potential increase",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Average Recommendation Score",
      value: `${averageScore}/100`,
      change: "+3 points this week",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">Performance insights and recommendation analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Last updated: <span className="font-medium">2 minutes ago</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`${metric.color} w-6 h-6`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales vs Temperature Trend */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Sales vs Temperature Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} name="Temperature (°F)" />
                      <Line yAxisId="right" type="monotone" dataKey="salesVolume" stroke="#82ca9d" strokeWidth={2} name="Sales Volume" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recommendation Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="priority" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={(entry) => entry.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown and Environmental Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recommendations by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Recommendations */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((rec, index) => (
                      <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{rec.title}</p>
                          <p className="text-sm text-gray-600">{rec.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{rec.score}/100</p>
                          <p className="text-sm text-green-600">+${rec.expectedImpact.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}