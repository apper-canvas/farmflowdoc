import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import weatherService from "@/services/api/weatherService";
import { format } from "date-fns";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      setError("");
      setLoading(true);
      const currentWeather = await weatherService.getCurrentWeather();
      setWeather(currentWeather);
    } catch (err) {
      setError("Failed to load weather data");
      console.error("Weather loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="h-48 bg-surface rounded-xl animate-pulse"></div>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadWeather} />;
  }

  if (!weather) {
    return (
      <div className="card text-center">
        <ApperIcon name="CloudOff" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No weather data available</p>
      </div>
    );
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

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Weather</h3>
        <button
          onClick={loadWeather}
          className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name={getWeatherIcon(weather.condition)} 
              size={48} 
              className={getConditionColor(weather.condition)} 
            />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {weather.temperature.high}°F
              </p>
              <p className="text-sm text-gray-600">
                Low: {weather.temperature.low}°F
              </p>
            </div>
          </div>
          
          <p className="text-lg font-medium text-gray-800">
            {weather.condition}
          </p>
        </div>

        <div className="text-right space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-end text-sm text-gray-600">
              <ApperIcon name="Droplets" size={14} className="mr-1 text-blue-500" />
              <span>{weather.precipitation}%</span>
            </div>
            <div className="flex items-center justify-end text-sm text-gray-600">
              <ApperIcon name="Wind" size={14} className="mr-1 text-gray-500" />
              <span>{weather.humidity}%</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            {format(new Date(weather.date), "EEEE, MMM dd")}
          </p>
        </div>
      </div>

      {weather.precipitation > 20 && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center text-sm text-blue-800">
            <ApperIcon name="Info" size={14} className="mr-2" />
            <span>Rain expected - consider indoor tasks today</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;