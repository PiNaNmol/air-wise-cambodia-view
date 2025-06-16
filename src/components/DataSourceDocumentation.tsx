
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, Key, Shield } from "lucide-react";

const DataSourceDocumentation: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Sources & API Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Data Source */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-50">Demo Mode</Badge>
            Current Data Source
          </h3>
          <p className="text-gray-600 mb-3">
            This application is currently using <strong>mock/simulated data</strong> for demonstration purposes. 
            The air quality values, pollutant concentrations, and forecasts are randomly generated.
          </p>
        </div>

        {/* Recommended Production APIs */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recommended Production APIs</h3>
          <div className="grid gap-4">
            {/* Google Air Quality API */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Google Air Quality API</h4>
                <Badge variant="secondary">Recommended</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Comprehensive air quality data with real-time conditions, forecasts, and health recommendations.
              </p>
              <ul className="text-sm space-y-1 mb-3">
                <li>• Real-time AQI and pollutant data</li>
                <li>• 96-hour forecasts</li>
                <li>• 70+ Air Quality Indexes</li>
                <li>• Health recommendations</li>
                <li>• Global coverage (100+ countries)</li>
              </ul>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">Free tier: 10,000 calls/month</span>
                <a 
                  href="https://developers.google.com/maps/documentation/air-quality" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  Documentation <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* OpenWeatherMap Air Pollution API */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">OpenWeatherMap Air Pollution API</h4>
                <Badge variant="outline">Free Option</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Free air pollution data including current, forecast, and historical information.
              </p>
              <ul className="text-sm space-y-1 mb-3">
                <li>• CO, NO, NO2, O3, SO2, PM2.5, PM10, NH3</li>
                <li>• Current and 5-day forecast</li>
                <li>• Historical data available</li>
                <li>• Completely free</li>
              </ul>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">Free: Unlimited calls</span>
                <a 
                  href="https://openweathermap.org/api/air-pollution" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  Documentation <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* IQAir API */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">IQAir Visual Crossing API</h4>
                <Badge variant="outline">Alternative</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Real-time air quality data from a global network of monitoring stations.
              </p>
              <ul className="text-sm space-y-1 mb-3">
                <li>• Real-time air quality data</li>
                <li>• City and nearest station data</li>
                <li>• High accuracy measurements</li>
              </ul>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-600">Paid service</span>
                <a 
                  href="https://www.iqair.com/air-pollution-data-api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  Documentation <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Implementation Guide
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">To integrate real API data:</h4>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Choose an API provider and obtain an API key</li>
              <li>Set up a backend proxy server (Express.js, Flask, etc.)</li>
              <li>Store API keys securely in environment variables</li>
              <li>Update the frontend to call your backend endpoints</li>
              <li>Replace mock data generation with real API calls</li>
            </ol>
          </div>
        </div>

        {/* Security Notice */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Best Practices
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 mb-2">⚠️ Important Security Notice</p>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Never expose API keys in frontend code</li>
              <li>• Always use a backend proxy for API calls</li>
              <li>• Implement rate limiting to prevent abuse</li>
              <li>• Use HTTPS for all API communications</li>
              <li>• Regularly rotate API keys</li>
            </ul>
          </div>
        </div>

        {/* Quick Start with OpenWeatherMap */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Start: OpenWeatherMap (Free)</h3>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm mb-3">
              For immediate implementation with free data, OpenWeatherMap is recommended:
            </p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Sign up at <a href="https://openweathermap.org/api" className="text-blue-500 hover:underline">openweathermap.org</a></li>
              <li>Get your free API key</li>
              <li>Use endpoint: <code className="bg-white px-2 py-1 rounded text-xs">http://api.openweathermap.org/data/2.5/air_pollution</code></li>
              <li>Replace mock data in the <code className="bg-white px-2 py-1 rounded text-xs">Index.tsx</code> file</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceDocumentation;
