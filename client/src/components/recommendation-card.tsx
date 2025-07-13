import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Recommendation } from "@shared/schema";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [isApplied, setIsApplied] = useState(false);
  const { toast } = useToast();

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          gradient: "from-red-500 to-red-600",
          icon: Flame,
          bgColor: "bg-red-100",
          textColor: "text-red-100"
        };
      case "medium":
        return {
          gradient: "from-orange-500 to-orange-600",
          icon: TrendingUp,
          bgColor: "bg-orange-100",
          textColor: "text-orange-100"
        };
      default:
        return {
          gradient: "from-purple-500 to-purple-600",
          icon: Calendar,
          bgColor: "bg-purple-100",
          textColor: "text-purple-100"
        };
    }
  };

  const config = getPriorityConfig(recommendation.priority);
  const Icon = config.icon;

  const handleApplyRecommendation = async () => {
    try {
      const response = await fetch(`/api/recommendations/${recommendation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (response.ok) {
        setIsApplied(true);
        toast({
          title: "Recommendation Applied",
          description: `${recommendation.title} has been applied successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${config.gradient} p-4`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Icon className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold capitalize">{recommendation.priority} Priority</p>
              <p className={`${config.textColor} text-sm`}>Score: {recommendation.score}/100</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm ${config.textColor}`}>Expected Impact</p>
            <p className="font-bold">+${recommendation.expectedImpact.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          {recommendation.imageUrl && (
            <img 
              src={recommendation.imageUrl} 
              alt={recommendation.title}
              className="w-16 h-16 rounded-lg object-cover" 
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Suggested Placement:</span>
            <span className="font-medium text-gray-900">{recommendation.suggestedPlacement}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Inventory Impact:</span>
            <span className="font-medium text-green-600">{recommendation.inventoryImpact}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Time Sensitivity:</span>
            <span className={`font-medium ${
              recommendation.timeSensitivity.toLowerCase().includes('urgent') ? 'text-red-600' :
              recommendation.timeSensitivity.toLowerCase().includes('hour') ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {recommendation.timeSensitivity}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleApplyRecommendation}
          disabled={isApplied}
          className={`w-full mt-4 transition-colors font-medium ${
            isApplied 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-walmart-blue-500 hover:bg-walmart-blue-600'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Applied
            </>
          ) : (
            'Apply Recommendation'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
