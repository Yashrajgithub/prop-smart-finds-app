
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Sparkles,
  Search,
  TrendingUp,
  ArrowDown,
  ArrowUp,
  BarChart,
  LineChart,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";

// Charts
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface MarketData {
  locationName: string;
  overview: string;
  priceChange: {
    monthly: number;
    yearly: number;
  };
  averageRent: {
    overall: number;
    studio: number;
    oneBed: number;
    twoBed: number;
    threeBed: number;
    fourBed: number;
  };
  demandIndex: number;
  supplyIndex: number;
  trendingNeighborhoods: {
    name: string;
    averageRent: number;
    changeRate: number;
  }[];
  priceHistory: {
    month: string;
    price: number;
  }[];
  propertyTypeDistribution: {
    name: string;
    value: number;
  }[];
  // Add other data structures as needed
}

// Sample data (fallback if API fails)
const sampleData: MarketData = {
  locationName: "New York, NY",
  overview: "The New York rental market continues to show strong demand with limited supply, pushing prices higher in most neighborhoods. Manhattan and Brooklyn remain the most expensive areas, while emerging areas in Queens and the Bronx are seeing faster price growth due to relative affordability and improved amenities.",
  priceChange: {
    monthly: 1.2,
    yearly: 5.8
  },
  averageRent: {
    overall: 3500,
    studio: 2600,
    oneBed: 3200,
    twoBed: 4100,
    threeBed: 5300,
    fourBed: 7000
  },
  demandIndex: 85,
  supplyIndex: 35,
  trendingNeighborhoods: [
    { name: "Long Island City", averageRent: 3700, changeRate: 8.2 },
    { name: "Williamsburg", averageRent: 3900, changeRate: 6.7 },
    { name: "Bushwick", averageRent: 3000, changeRate: 9.3 },
    { name: "Astoria", averageRent: 2800, changeRate: 7.1 },
    { name: "Harlem", averageRent: 2900, changeRate: 6.8 }
  ],
  priceHistory: [
    { month: "Jan", price: 3250 },
    { month: "Feb", price: 3275 },
    { month: "Mar", price: 3300 },
    { month: "Apr", price: 3350 },
    { month: "May", price: 3400 },
    { month: "Jun", price: 3450 },
    { month: "Jul", price: 3500 },
    { month: "Aug", price: 3525 },
    { month: "Sep", price: 3550 },
    { month: "Oct", price: 3575 },
    { month: "Nov", price: 3600 },
    { month: "Dec", price: 3650 }
  ],
  propertyTypeDistribution: [
    { name: "Studio", value: 25 },
    { name: "1 Bedroom", value: 40 },
    { name: "2 Bedroom", value: 20 },
    { name: "3+ Bedroom", value: 15 }
  ]
};

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#22C55E"];

const MarketInsights = () => {
  const [location, setLocation] = useState<string>("New York, NY");
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    // Initial load with default location
    fetchMarketData(location);
  }, []);

  const fetchMarketData = async (locationQuery: string) => {
    setLoading(true);
    try {
      const data = await aiApi.getMarketTrends(locationQuery);
      setMarketData(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      toast.error(`Failed to load market data for ${locationQuery}`);
      // Use sample data as fallback
      setMarketData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput);
      fetchMarketData(searchInput);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-1">Analyzing Market Data</p>
            <p className="text-muted-foreground">Using AI to process market insights for {location}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-3xl font-bold">AI Market Insights</h1>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground max-w-2xl">
              Leverage our AI-powered analytics to understand rental market trends, price predictions, 
              and demand patterns to make informed property decisions.
            </p>
          </div>
        </header>
        
        {/* Location search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Enter city, neighborhood or zip code" 
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {marketData && (
          <>
            {/* Market Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold flex items-center mb-2">
                <span className="mr-2">{marketData.locationName} Market Overview</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {marketData.overview}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Average Rent</div>
                    <div className="text-2xl font-bold">${marketData.averageRent.overall}</div>
                    <div className={`text-sm flex items-center ${marketData.priceChange.monthly > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marketData.priceChange.monthly > 0 ? 
                        <ArrowUp className="h-3 w-3 mr-1" /> : 
                        <ArrowDown className="h-3 w-3 mr-1" />}
                      {Math.abs(marketData.priceChange.monthly)}% past month
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Yearly Change</div>
                    <div className="text-2xl font-bold">{marketData.priceChange.yearly}%</div>
                    <div className="text-sm text-muted-foreground">Year-over-year price trend</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Demand Index</div>
                    <div className="text-2xl font-bold">{marketData.demandIndex}/100</div>
                    <div className="text-sm text-muted-foreground">
                      {marketData.demandIndex > 75 ? 'Very High' : 
                       marketData.demandIndex > 50 ? 'High' : 
                       marketData.demandIndex > 25 ? 'Moderate' : 'Low'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Supply Index</div>
                    <div className="text-2xl font-bold">{marketData.supplyIndex}/100</div>
                    <div className="text-sm text-muted-foreground">
                      {marketData.supplyIndex < 25 ? 'Very Low' : 
                       marketData.supplyIndex < 50 ? 'Low' : 
                       marketData.supplyIndex < 75 ? 'Moderate' : 'High'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Tabs defaultValue="trends">
              <TabsList className="mb-8">
                <TabsTrigger value="trends">Price Trends</TabsTrigger>
                <TabsTrigger value="neighborhoods">Hot Neighborhoods</TabsTrigger>
                <TabsTrigger value="distribution">Property Distribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="space-y-6">
                {/* Price Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="h-5 w-5 text-primary mr-2" />
                      Rental Price Trend (12 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={marketData.priceHistory}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, "Average Rent"]} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Price by Property Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 text-primary mr-2" />
                      Average Rent by Property Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={[
                            { type: "Studio", price: marketData.averageRent.studio },
                            { type: "1 Bed", price: marketData.averageRent.oneBed },
                            { type: "2 Bed", price: marketData.averageRent.twoBed },
                            { type: "3 Bed", price: marketData.averageRent.threeBed },
                            { type: "4+ Bed", price: marketData.averageRent.fourBed }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, "Average Rent"]} />
                          <Bar dataKey="price" fill="hsl(var(--primary))" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="neighborhoods">
                {/* Trending Neighborhoods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-primary mr-2" />
                      Trending Neighborhoods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Neighborhood</th>
                            <th className="text-right py-3 px-4">Avg. Rent</th>
                            <th className="text-right py-3 px-4">Change</th>
                            <th className="text-right py-3 px-4">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketData.trendingNeighborhoods.map((neighborhood, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{neighborhood.name}</td>
                              <td className="py-3 px-4 text-right font-medium">${neighborhood.averageRent}</td>
                              <td className={`py-3 px-4 text-right font-medium ${
                                neighborhood.changeRate > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {neighborhood.changeRate > 0 ? '+' : ''}{neighborhood.changeRate}%
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  {neighborhood.changeRate > 8 ? 'Hot' : 
                                   neighborhood.changeRate > 5 ? 'Rising' : 'Stable'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="distribution">
                {/* Property Type Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={marketData.propertyTypeDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={110}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {marketData.propertyTypeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Market Share"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="prose">
                      <div className="space-y-4">
                        <p>
                          In {marketData.locationName}, {marketData.propertyTypeDistribution[0].name} 
                          and {marketData.propertyTypeDistribution[1].name} properties dominate the market, 
                          comprising {marketData.propertyTypeDistribution[0].value + marketData.propertyTypeDistribution[1].value}% 
                          of available rentals.
                        </p>
                        
                        <p>
                          The market is currently experiencing a 
                          {marketData.demandIndex > marketData.supplyIndex ? " high demand with limited supply" : " balanced demand and supply"}, 
                          which is contributing to the {marketData.priceChange.yearly > 0 ? "rising" : "stabilizing"} prices.
                        </p>
                        
                        <p>
                          {marketData.trendingNeighborhoods[0].name} and {marketData.trendingNeighborhoods[1].name} 
                          show the strongest growth indicators, suggesting potential for investment opportunities or 
                          finding deals before further price increases.
                        </p>
                        
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Sparkles className="h-3 w-3 mr-1" />
                          <span>AI-generated market analysis</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketInsights;
