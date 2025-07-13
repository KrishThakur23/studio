import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, CreditCard, Calendar, MapPin, Package, Users, TrendingUp } from "lucide-react";
import Sidebar from "@/components/sidebar";
import type { Recommendation } from "@shared/schema";

export default function StoreLayout() {
  const { data: recommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  const layoutZones = [
    {
      zone: "Store Entrance",
      description: "High-traffic area for maximum visibility",
      icon: DoorOpen,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      priority: "Critical",
      recommendations: recommendations.filter(r => 
        r.suggestedPlacement.toLowerCase().includes('entrance') || 
        r.suggestedPlacement.toLowerCase().includes('front')
      )
    },
    {
      zone: "Checkout Counter",
      description: "Last-chance impulse purchase zone",
      icon: CreditCard,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      priority: "High",
      recommendations: recommendations.filter(r => 
        r.suggestedPlacement.toLowerCase().includes('checkout') ||
        r.suggestedPlacement.toLowerCase().includes('counter')
      )
    },
    {
      zone: "Seasonal Section",
      description: "Dynamic area for holiday and weather-driven products",
      icon: Calendar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      priority: "High",
      recommendations: recommendations.filter(r => 
        r.suggestedPlacement.toLowerCase().includes('seasonal') ||
        r.category.toLowerCase().includes('seasonal') ||
        r.category.toLowerCase().includes('holiday')
      )
    },
    {
      zone: "Electronics Section",
      description: "Tech and cooling appliances area",
      icon: Package,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      priority: "Medium",
      recommendations: recommendations.filter(r => 
        r.suggestedPlacement.toLowerCase().includes('electronics') ||
        r.category.toLowerCase().includes('electronics')
      )
    },
    {
      zone: "Health & Beauty",
      description: "Personal care and wellness products",
      icon: Users,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
      priority: "Medium",
      recommendations: recommendations.filter(r => 
        r.suggestedPlacement.toLowerCase().includes('health') ||
        r.category.toLowerCase().includes('health') ||
        r.category.toLowerCase().includes('beauty')
      )
    },
    {
      zone: "Sports & Recreation",
      description: "Active lifestyle and sports equipment",
      icon: TrendingUp,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      priority: "Medium",
      recommendations: recommendations.filter(r => 
        r.suggestedPlacement.toLowerCase().includes('sports') ||
        r.category.toLowerCase().includes('sports') ||
        r.category.toLowerCase().includes('fitness')
      )
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRecommendationPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      default: return 'text-purple-600 bg-purple-100';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Store Layout Optimization</h2>
              <p className="text-gray-600">Strategic product placement for maximum sales impact</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{recommendations.length}</span> active recommendations
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Store Layout Overview */}
          <div className="mb-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Store Layout Map - Recommended Placements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {layoutZones.map((zone, index) => {
                    const Icon = zone.icon;
                    return (
                      <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-walmart-blue-500 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${zone.bgColor} rounded-lg flex items-center justify-center`}>
                              <Icon className={`${zone.iconColor} w-5 h-5`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{zone.zone}</h4>
                              <p className="text-xs text-gray-600">{zone.description}</p>
                            </div>
                          </div>
                          <div className={`w-3 h-3 ${getPriorityColor(zone.priority)} rounded-full`}></div>
                        </div>
                        
                        <div className="space-y-2">
                          {zone.recommendations.length > 0 ? (
                            zone.recommendations.slice(0, 3).map((rec, recIndex) => (
                              <div key={recIndex} className="text-xs bg-gray-50 rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-gray-900">{rec.title}</span>
                                  <Badge className={`text-xs ${getRecommendationPriorityColor(rec.priority)}`}>
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <div className="text-gray-600">${rec.expectedImpact.toLocaleString()} impact</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-500 italic">No current recommendations</div>
                          )}
                          {zone.recommendations.length > 3 && (
                            <div className="text-xs text-blue-600 font-medium">
                              +{zone.recommendations.length - 3} more recommendations
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Zone Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {layoutZones
              .filter(zone => zone.recommendations.length > 0)
              .slice(0, 4)
              .map((zone, index) => {
                const Icon = zone.icon;
                return (
                  <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${zone.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`${zone.iconColor} w-5 h-5`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{zone.zone}</CardTitle>
                          <p className="text-sm text-gray-600">{zone.recommendations.length} active recommendations</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {zone.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{rec.title}</h5>
                              <Badge className={`text-xs ${getRecommendationPriorityColor(rec.priority)}`}>
                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-gray-500">Expected Impact:</span>
                                <div className="font-medium text-green-600">+${rec.expectedImpact.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Inventory Impact:</span>
                                <div className="font-medium text-blue-600">{rec.inventoryImpact}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Score:</span>
                                <div className="font-medium text-gray-900">{rec.score}/100</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Time Sensitivity:</span>
                                <div className="font-medium text-orange-600">{rec.timeSensitivity}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </main>
      </div>
    </div>
  );
}