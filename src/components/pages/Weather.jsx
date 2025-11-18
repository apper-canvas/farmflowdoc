import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import weatherService from "@/services/api/weatherService";
import { format } from "date-fns";

const Weather = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      setError("");
      setLoading(true);
      const weatherData = await weatherService.getForecast();
      setForecast(weatherData);
    } catch (err) {
      setError("Failed to load weather forecast");
      console.error("Weather loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadWeather} />;
  }

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny": return "Sun";
      case "partly cloudy": return "CloudSun";
      case "cloudy": return "Cloud";
      case "light rain": return "CloudRain";
      case "rain": return "CloudRain";
      case "storm": return "CloudLightning";
      default: return "Cloud";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny": return "text-yellow-500";
      case "partly cloudy": return "text-blue-400";
      case "cloudy": return "text-gray-500";
      case "light rain": 
      case "rain": return "text-blue-600";
      case "storm": return "text-purple-600";
      default: return "text-gray-500";
    }
  };

  const getBackgroundGradient = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny": return "from-yellow-50 to-orange-100";
      case "partly cloudy": return "from-blue-50 to-sky-100";
      case "cloudy": return "from-gray-50 to-slate-100";
      case "light rain": 
      case "rain": return "from-blue-50 to-indigo-100";
      case "storm": return "from-purple-50 to-indigo-100";
      default: return "from-gray-50 to-slate-100";
    }
  };

  const getFarmingRecommendation = (weather) => {
    const { condition, precipitation, temperature } = weather;
    
    if (precipitation > 30) {
      return {
        icon: "Umbrella",
        text: "Heavy rain expected - Focus on indoor tasks and equipment maintenance",
        color: "text-blue-600"
      };
    }
    
    if (precipitation > 10) {
      return {
        icon: "CloudRain",
        text: "Light rain likely - Good for newly planted crops, avoid field work",
        color: "text-blue-500"
      };
    }

    if (condition.toLowerCase() === "sunny" && temperature.high > 85) {
      return {
        icon: "Sun",
        text: "Hot and sunny - Perfect for harvesting, ensure adequate irrigation",
        color: "text-orange-600"
      };
    }

    if (condition.toLowerCase() === "sunny") {
      return {
        icon: "Sun",
        text: "Excellent weather for outdoor farm work and field operations",
        color: "text-green-600"
      };
    }

    return {
      icon: "Leaf",
      text: "Good conditions for most farming activities",
      color: "text-green-600"
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-gray-600 mt-2">7-day forecast for your farming operations</p>
        </div>
        <Button onClick={loadWeather} icon="RefreshCw" variant="outline">
          Refresh
        </Button>
      </div>

      {/* Current Weather */}
      {forecast.length > 0 && (
        <div className={`card bg-gradient-to-br ${getBackgroundGradient(forecast[0].condition)} border-2 border-white/50`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Today's Weather</h2>
              <p className="text-gray-600">{format(new Date(forecast[0].date), "EEEE, MMMM dd, yyyy")}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <ApperIcon 
                  name={getWeatherIcon(forecast[0].condition)} 
                  size={64} 
                  className={getConditionColor(forecast[0].condition)} 
                />
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    {forecast[0].temperature.high}°F
                  </p>
                  <p className="text-lg text-gray-600">
                    Low: {forecast[0].temperature.low}°F
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white/30 backdrop-blur-sm rounded-lg">
              <ApperIcon name="Eye" size={20} className="mx-auto mb-2 text-gray-700" />
              <p className="text-sm text-gray-600 mb-1">Condition</p>
              <p className="font-semibold text-gray-900">{forecast[0].condition}</p>
            </div>
            
            <div className="text-center p-3 bg-white/30 backdrop-blur-sm rounded-lg">
              <ApperIcon name="Droplets" size={20} className="mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600 mb-1">Precipitation</p>
              <p className="font-semibold text-gray-900">{forecast[0].precipitation}%</p>
            </div>
            
            <div className="text-center p-3 bg-white/30 backdrop-blur-sm rounded-lg">
              <ApperIcon name="Wind" size={20} className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-600 mb-1">Humidity</p>
              <p className="font-semibold text-gray-900">{forecast[0].humidity}%</p>
            </div>
          </div>

          {/* Farming Recommendation */}
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30">
            <div className="flex items-center space-x-3">
              <ApperIcon 
                name={getFarmingRecommendation(forecast[0]).icon} 
                size={24} 
                className={getFarmingRecommendation(forecast[0]).color} 
              />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Farming Recommendation</p>
                <p className="text-sm text-gray-700">{getFarmingRecommendation(forecast[0]).text}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">7-Day Forecast</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className={`p-4 rounded-lg transition-all duration-200 hover:shadow-lg ${
              index === 0 
                ? `bg-gradient-to-br ${getBackgroundGradient(day.condition)} border-2 border-primary` 
                : "bg-gray-50 hover:bg-gray-100"
            }`}>
              <div className="text-center space-y-3">
                <div>
                  <p className={`text-sm font-medium ${index === 0 ? "text-primary" : "text-gray-600"}`}>
                    {index === 0 ? "Today" : format(new Date(day.date), "EEE")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(day.date), "MMM dd")}
                  </p>
                </div>

                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={40} 
                  className={getConditionColor(day.condition)} 
                />

                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">
                    {day.temperature.high}°
                  </p>
                  <p className="text-sm text-gray-600">
                    {day.temperature.low}°
                  </p>
                </div>

                <p className="text-xs text-gray-700 font-medium truncate">
                  {day.condition}
                </p>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                  <ApperIcon name="Droplets" size={12} className="text-blue-500" />
                  <span>{day.precipitation}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="AlertTriangle" size={20} className="mr-2 text-warning" />
          Weather Alerts & Tips
        </h3>
        
        <div className="space-y-3">
          {forecast.filter(day => day.precipitation > 20).length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="CloudRain" size={20} className="text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold text-blue-900">Rain Expected</p>
                  <p className="text-sm text-blue-700">
                    {forecast.filter(day => day.precipitation > 20).length} days with significant precipitation expected. 
                    Plan indoor activities and protect sensitive crops.
                  </p>
                </div>
              </div>
            </div>
          )}

          {forecast.filter(day => day.temperature.high > 85).length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Sun" size={20} className="text-orange-600 mr-3" />
                <div>
                  <p className="font-semibold text-orange-900">Hot Weather Warning</p>
                  <p className="text-sm text-orange-700">
                    {forecast.filter(day => day.temperature.high > 85).length} days with high temperatures expected. 
                    Ensure adequate irrigation and consider early morning work schedules.
                  </p>
                </div>
              </div>
            </div>
          )}

          {forecast.filter(day => day.condition.toLowerCase() === "sunny").length >= 5 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Sun" size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="font-semibold text-green-900">Excellent Growing Conditions</p>
                  <p className="text-sm text-green-700">
                    Great weather ahead! Perfect conditions for field work, planting, and harvesting activities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;