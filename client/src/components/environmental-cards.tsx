import { Thermometer, Droplets, Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EnvironmentalData } from "@shared/schema";

interface EnvironmentalCardsProps {
  data?: EnvironmentalData;
}

export default function EnvironmentalCards({ data }: EnvironmentalCardsProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Temperature",
      value: `${Math.round(data.temperature)}°F`,
      trend: "+2°F from yesterday",
      trendUp: true,
      icon: Thermometer,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      trendColor: "text-green-600"
    },
    {
      title: "Humidity",
      value: `${Math.round(data.humidity)}%`,
      trend: "-5% from yesterday",
      trendUp: false,
      icon: Droplets,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      trendColor: "text-blue-600"
    },
    {
      title: "Air Quality Index",
      value: Math.round(data.aqi).toString(),
      trend: "Good Quality",
      trendUp: true,
      icon: Leaf,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      trendColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${card.trendColor}`}>
                    {index < 2 && <TrendIcon className="text-xs mr-1 w-3 h-3" />}
                    {index === 2 && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                    <span>{card.trend}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} text-xl w-6 h-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
