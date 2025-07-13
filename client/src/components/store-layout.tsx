import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, CreditCard, Calendar } from "lucide-react";

export default function StoreLayout() {
  const layoutSuggestions = [
    {
      title: "Entrance Display",
      description: "High-impact placement for impulse purchases",
      icon: DoorOpen,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      suggestions: [
        { item: "Cold beverages", priority: "Priority 1", color: "text-green-600" },
        { item: "Holiday supplies", priority: "Priority 2", color: "text-orange-600" }
      ]
    },
    {
      title: "Checkout Counter",
      description: "Last-minute addition opportunities",
      icon: CreditCard,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      suggestions: [
        { item: "Energy drinks", priority: "Priority 1", color: "text-green-600" },
        { item: "Cooling towels", priority: "Priority 2", color: "text-green-600" }
      ]
    },
    {
      title: "Seasonal Section",
      description: "Holiday and weather-driven products",
      icon: Calendar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      suggestions: [
        { item: "BBQ supplies", priority: "Urgent", color: "text-red-600" },
        { item: "Summer toys", priority: "Priority 3", color: "text-orange-600" }
      ]
    }
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Optimized Store Layout Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {layoutSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${suggestion.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`${suggestion.iconColor} text-2xl w-8 h-8`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                <div className="space-y-2 text-left">
                  {suggestion.suggestions.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.item}</span>
                      <span className={`font-medium ${item.color}`}>{item.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
