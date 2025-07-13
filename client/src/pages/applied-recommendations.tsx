import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, TrendingUp, Trash2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import type { Recommendation } from "@shared/schema";

export default function AppliedRecommendations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: allRecommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations/all"],
    queryFn: () => 
      fetch('/api/recommendations/all')
        .then(res => res.json())
        .catch(() => [])
  });

  // Filter for applied (inactive) recommendations
  const appliedRecommendations = allRecommendations.filter(rec => !rec.isActive);

  const reactivateMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/recommendations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: true }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations/all"] });
      toast({
        title: "Recommendation Reactivated",
        description: "The recommendation is now available again on the dashboard.",
      });
    },
  });

  const handleDeleteRecommendation = async (id: number) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/recommendations/all"] });
        toast({
          title: "Recommendation Deleted",
          description: "The recommendation has been permanently removed.",
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Score: {recommendation.score}/100</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{recommendation.timeSensitivity}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => reactivateMutation.mutate(recommendation.id)}
                              disabled={reactivateMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reactivate
                            </Button>
                            <Button 
                              onClick={() => handleDeleteRecommendation(recommendation.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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