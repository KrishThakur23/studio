import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";
import Sidebar from "@/components/sidebar";
import type { Recommendation } from "@shared/schema";

export default function AppliedRecommendations() {
  const { data: allRecommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations/all"],
    queryFn: () => 
      fetch('/api/recommendations/all')
        .then(res => res.json())
        .catch(() => [])
  });

  // Filter for applied (inactive) recommendations
  const appliedRecommendations = allRecommendations.filter(rec => !rec.isActive);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-orange-600 bg-orange-100";
      default: return "text-purple-600 bg-purple-100";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Applied Recommendations</h2>
              <p className="text-gray-600">Track implemented product placement strategies</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{appliedRecommendations.length}</span> recommendations applied
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {appliedRecommendations.length === 0 ? (
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applied Recommendations</h3>
                <p className="text-gray-600">
                  Once you apply recommendations from the dashboard, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appliedRecommendations.map((recommendation) => (
                  <Card key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Applied</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority} priority
                        </span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {recommendation.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recommendation.imageUrl && (
                          <img 
                            src={recommendation.imageUrl} 
                            alt={recommendation.title}
                            className="w-full h-32 rounded-lg object-cover" 
                          />
                        )}
                        
                        <p className="text-sm text-gray-600">{recommendation.description}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Category:</span>
                            <span className="font-medium text-gray-900">{recommendation.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Placement:</span>
                            <span className="font-medium text-gray-900">{recommendation.suggestedPlacement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expected Impact:</span>
                            <span className="font-medium text-green-600">+${recommendation.expectedImpact.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Applied:</span>
                            <span className="font-medium text-gray-900">{formatDate(recommendation.createdAt)}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Score: {recommendation.score}/100</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{recommendation.timeSensitivity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}