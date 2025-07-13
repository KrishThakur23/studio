import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Database, Shield, Clock, Thermometer, TrendingUp } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Store Configuration",
      icon: Settings,
      items: [
        { label: "Store Number", value: "#2847", type: "display" },
        { label: "Store Manager", value: "Gaurav Pawar", type: "display" },
        { label: "Location", value: "Phoenix, AZ", type: "display" },
        { label: "Operating Hours", value: "6:00 AM - 11:00 PM", type: "display" },
      ]
    },
    {
      title: "Data Refresh Settings",
      icon: Database,
      items: [
        { label: "Environmental Data Refresh", value: "30 seconds", type: "setting", toggle: true },
        { label: "Recommendations Refresh", value: "60 seconds", type: "setting", toggle: true },
        { label: "Real-time Simulation", value: "Enabled", type: "setting", toggle: true },
        { label: "Historical Data Retention", value: "7 days", type: "display" },
      ]
    },
    {
      title: "Alert Thresholds",
      icon: Bell,
      items: [
        { label: "High Temperature Alert", value: "85°F", type: "setting" },
        { label: "Low Humidity Alert", value: "30%", type: "setting" },
        { label: "High AQI Alert", value: "150", type: "setting" },
        { label: "Recommendation Score Threshold", value: "70/100", type: "setting" },
      ]
    },
    {
      title: "User Preferences",
      icon: User,
      items: [
        { label: "Temperature Unit", value: "Fahrenheit", type: "setting" },
        { label: "Theme", value: "Light Mode", type: "setting" },
        { label: "Notification Sounds", value: "Enabled", type: "setting", toggle: true },
        { label: "Dashboard Auto-refresh", value: "Enabled", type: "setting", toggle: true },
      ]
    }
  ];

  const systemStatus = [
    { service: "Environmental Sensors", status: "Connected", uptime: "99.8%", color: "bg-green-500" },
    { service: "Recommendation Engine", status: "Active", uptime: "99.5%", color: "bg-green-500" },
    { service: "Data Analytics", status: "Running", uptime: "98.9%", color: "bg-green-500" },
    { service: "API Services", status: "Operational", uptime: "99.9%", color: "bg-green-500" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Settings & Configuration</h2>
              <p className="text-gray-600">Manage your Walmart Pulse dashboard preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-walmart-blue-500 hover:bg-walmart-blue-600 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* System Status */}
          <div className="mb-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {systemStatus.map((service, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{service.service}</span>
                        <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{service.status}</p>
                      <p className="text-xs text-green-600 font-medium">{service.uptime} uptime</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {settingsCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <Icon className="w-5 h-5 mr-2" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2">
                          <div>
                            <span className="font-medium text-gray-900">{item.label}</span>
                            {item.type === 'display' && (
                              <Badge variant="secondary" className="ml-2 text-xs">Read Only</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.toggle ? (
                              <>
                                <span className="text-sm text-gray-600">{item.value}</span>
                                <Switch defaultChecked />
                              </>
                            ) : (
                              <span className="text-sm font-medium text-gray-900">{item.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Export Environmental Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Recommendations Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Clear Analytics Cache
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2" />
                  Sensor Calibration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Calibrate Temperature Sensor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Calibrate Humidity Sensor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Test AQI Sensor
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Optimize Recommendations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Refresh ML Models
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  System Diagnostics
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}