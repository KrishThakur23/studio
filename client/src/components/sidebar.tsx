import { 
  BarChart3, 
  ShoppingCart, 
  TrendingUp, 
  MapPin, 
  Settings,
  Activity
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();
  
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: ShoppingCart, label: "Product Recommendations", path: "/applied-recommendations" },
    { icon: TrendingUp, label: "Analytics", path: "/analytics" },
    { icon: MapPin, label: "Store Layout", path: "/store-layout" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 bg-walmart-blue-500 text-white flex-shrink-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-walmart-yellow-500 rounded-lg flex items-center justify-center">
            <Activity className="text-walmart-blue-500 text-lg w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Walmart Pulse</h1>
            <p className="text-blue-200 text-sm">Store #2847</p>
          </div>
        </div>
        
        {/* User Profile at top */}
        <div className="bg-walmart-blue-600 rounded-lg p-3 mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-walmart-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-walmart-blue-500 font-semibold text-sm">GP</span>
            </div>
            <div>
              <p className="font-medium text-sm">Gaurav Pawar</p>
              <p className="text-blue-200 text-xs">Store Manager</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? "text-white bg-walmart-blue-600 border-r-4 border-walmart-yellow-500"
                  : "text-blue-200 hover:text-white hover:bg-walmart-blue-600"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
