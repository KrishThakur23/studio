import { 
  BarChart3, 
  ShoppingCart, 
  TrendingUp, 
  MapPin, 
  Settings,
  Activity
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: ShoppingCart, label: "Product Recommendations", active: false },
    { icon: TrendingUp, label: "Analytics", active: false },
    { icon: MapPin, label: "Store Layout", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="w-64 bg-walmart-blue-500 text-white flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-walmart-yellow-500 rounded-lg flex items-center justify-center">
            <Activity className="text-walmart-blue-500 text-lg w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Walmart Pulse</h1>
            <p className="text-blue-200 text-sm">Store #2847</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 transition-colors ${
                item.active
                  ? "text-white bg-walmart-blue-600 border-r-4 border-walmart-yellow-500"
                  : "text-blue-200 hover:text-white hover:bg-walmart-blue-600"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-walmart-blue-600 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-walmart-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-walmart-blue-500 font-semibold">JD</span>
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-blue-200 text-sm">Store Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
