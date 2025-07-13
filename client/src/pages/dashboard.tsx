import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import EnvironmentalCards from "@/components/environmental-cards";
import CurrentEvents from "@/components/current-events";
import RecommendationCard from "@/components/recommendation-card";
import AnalyticsCharts from "@/components/analytics-charts";
import StoreLayout from "@/components/store-layout";
import { Clock, Activity } from "lucide-react";
import type { EnvironmentalData, Recommendation } from "@shared/schema";

export default function Dashboard() {
  const { data: environmentalData, refetch: refetchEnvironmental } = useQuery<EnvironmentalData>({
    queryKey: ["/api/environmental/current"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: recommendations = [] } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
    refetchInterval: 60000, // Refetch every minute
  });

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Simulate environmental data updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/environmental/simulate', { method: 'POST' });
        refetchEnvironmental();
      } catch (error) {
        console.error('Failed to simulate environmental data:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchEnvironmental]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Store Dashboard</h2>
              <p className="text-gray-600">Real-time demand sensing and recommendations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Environmental Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Environmental Conditions</h3>
            <EnvironmentalCards data={environmentalData} />
          </div>

          {/* Current Events and Market Influencers */}
          <CurrentEvents />

          {/* Smart Recommendations */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Smart Product Recommendations</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Last updated:</span>
                <span className="text-sm font-medium text-gray-900">2 minutes ago</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-walmart-blue-500 text-white rounded-lg hover:bg-walmart-blue-600 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AnalyticsCharts />
          </div>

          {/* Store Layout Suggestions */}
          <StoreLayout />
        </main>
      </div>
    </div>
  );
}
