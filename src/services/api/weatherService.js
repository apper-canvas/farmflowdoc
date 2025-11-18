import weatherData from "@/services/mockData/weather.json";

const weatherService = {
  async getForecast() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...weatherData];
  },

  async getCurrentWeather() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return weatherData[0] || null;
  }
};

export default weatherService;