import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, DollarSign, TrendingUp } from "lucide-react";

export default function CurrentEvents() {
  const events = [
    {
      title: "Current Festivals",
      icon: Calendar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      items: [
        { name: "4th of July", date: "July 4th", impact: "BBQ & Party Supplies", urgency: "high" },
        { name: "Summer Season", date: "Ongoing", impact: "Cooling Products", urgency: "medium" },
      ]
    },
    {
      title: "Current Sports",
      icon: Trophy,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      items: [
        { name: "MLB Season", date: "Ongoing", impact: "Snacks & Beverages", urgency: "medium" },
        { name: "Summer Olympics Prep", date: "Upcoming", impact: "Sports Equipment", urgency: "low" },
      ]
    },
    {
      title: "Market Trends",
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      items: [
        { name: "Back to School Prep", date: "Starting", impact: "School Supplies", urgency: "medium" },
        { name: "Health & Wellness", date: "Trending", impact: "Fitness Products", urgency: "low" },
      ]
    },
    {
      title: "Economic Factors",
      icon: DollarSign,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      items: [
        { name: "Summer Sales Peak", date: "Current", impact: "Seasonal Discounts", urgency: "high" },
        { name: "Weekend Rush", date: "Fri-Sun", impact: "Convenience Items", urgency: "medium" },
      ]
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      default: return "text-green-600";
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Market Influencers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event, index) => {
          const Icon = event.icon;
          return (
            <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${event.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`${event.iconColor} w-5 h-5`} />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-900">{event.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {event.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className={`text-xs font-medium ${getUrgencyColor(item.urgency)} capitalize`}>
                          {item.urgency}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{item.date}</div>
                      <div className="text-xs text-blue-600 font-medium">{item.impact}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}