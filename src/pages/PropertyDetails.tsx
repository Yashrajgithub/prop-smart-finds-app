
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Home, 
  Check, 
  ArrowLeft,
  Share2,
  Calendar,
  PercentCircle,
  BarChart,
  Brain,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { propertyApi, aiApi, userApi } from "@/lib/api"; // Fixed import to include userApi
import { useAuth } from "@/contexts/AuthContext";

// Chart imports for price prediction chart
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  imageUrl: string;
  squareFeet?: number;
  yearBuilt?: number;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  agent?: {
    name: string;
    phone: string;
    email: string;
    photo?: string;
  };
}

interface PricePrediction {
  label: string;
  price: number;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [pricePredictions, setPricePredictions] = useState<PricePrediction[]>([]);
  const [marketInsights, setMarketInsights] = useState<string | null>(null);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch property details
        const propertyData = await propertyApi.getProperty(id);
        setProperty(propertyData);
        
        // Check if property is in user's favorites
        if (currentUser) {
          const favorites = await userApi.getFavorites(currentUser.id);
          setIsFavorite(favorites.includes(id));
          
          // Get AI compatibility score if user is logged in
          try {
            const score = await propertyApi.getCompatibilityScore(id, currentUser.id);
            setCompatibilityScore(score.compatibilityScore);
          } catch (error) {
            console.error("Error fetching compatibility score:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Failed to load property details");
        
        // Fallback sample data for development
        setProperty({
          id: id || "prop1",
          title: "Modern Downtown Apartment",
          description: "This beautiful apartment is located in the heart of downtown with stunning views of the city skyline. Features include hardwood floors, stainless steel appliances, and floor-to-ceiling windows. The building offers a fitness center, rooftop lounge, and 24/7 concierge service.",
          type: "Apartment",
          location: "Downtown, New York",
          price: 2500,
          bedrooms: 2,
          bathrooms: 2,
          features: ["Parking", "Gym", "Pet Friendly", "Central AC", "Dishwasher", "In-unit Laundry", "Hardwood Floors", "Balcony"],
          imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
          squareFeet: 1200,
          yearBuilt: 2018,
          neighborhood: "Financial District",
          agent: {
            name: "Jane Smith",
            phone: "(555) 123-4567",
            email: "jane.smith@example.com",
            photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60"
          }
        });
        
        setIsFavorite(false);
        setCompatibilityScore(85);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, currentUser]);

  // Load AI features
  useEffect(() => {
    const loadAIFeatures = async () => {
      if (!property) return;
      
      setLoadingAI(true);
      
      try {
        // Get AI price predictions
        const predictionData = await aiApi.getPricePrediction({
          id: property.id,
          type: property.type,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareFeet: property.squareFeet,
          features: property.features
        }).catch(() => null);
        
        if (predictionData) {
          setPricePredictions(predictionData.predictions);
        } else {
          // Sample data for development
          setPricePredictions([
            { label: "Current", price: property.price },
            { label: "+3 Months", price: Math.round(property.price * 1.02) },
            { label: "+6 Months", price: Math.round(property.price * 1.03) },
            { label: "+9 Months", price: Math.round(property.price * 1.05) },
            { label: "+12 Months", price: Math.round(property.price * 1.07) }
          ]);
        }
        
        // Get market insights
        const insightsData = await aiApi.getMarketTrends(property.location.split(',')[0])
          .catch(() => null);
        
        if (insightsData) {
          setMarketInsights(insightsData.insights);
        } else {
          // Sample insights for development
          setMarketInsights(
            "The neighborhood has seen a 5% increase in rental prices over the past year, slightly above the city average of 3%. Properties like this typically spend 20 days on the market before being rented. The area is becoming increasingly popular among young professionals due to its proximity to tech companies and public transportation options."
          );
        }
        
        // Get AI-generated description
        const descriptionData = await aiApi.generateDescription(property.id)
          .catch(() => null);
          
        if (descriptionData) {
          setAiDescription(descriptionData.description);
        }
        
      } catch (error) {
        console.error("Error loading AI features:", error);
      } finally {
        setLoadingAI(false);
      }
    };
    
    loadAIFeatures();
  }, [property]);

  const toggleFavorite = async () => {
    if (!currentUser || !property) {
      toast.error("Please log in to save favorites");
      return;
    }
    
    try {
      const userId = currentUser.id;
      
      if (isFavorite) {
        await userApi.removeFromFavorites(userId, property.id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await userApi.addToFavorites(userId, property.id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/properties">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <Link to="/properties" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Properties
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Property images and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Property header */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={isFavorite ? "default" : "outline"} 
                    size="icon" 
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                  <span className="text-xl font-bold">${property.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <div className="flex items-center">
                  <BedDouble className="h-5 w-5 mr-1 text-muted-foreground" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-1 text-muted-foreground" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
                {property.squareFeet && (
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-1 text-muted-foreground" />
                    <span>{property.squareFeet} sq ft</span>
                  </div>
                )}
              </div>
              
              {compatibilityScore && (
                <div className="mt-4 flex items-center bg-primary/10 p-2 rounded-md">
                  <PercentCircle className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <span className="font-bold text-primary">{compatibilityScore}% Match</span>
                    <span className="text-sm text-muted-foreground ml-2">based on your preferences</span>
                  </div>
                </div>
              )}
            </div>
            
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="insights">
                  AI Insights
                  <Sparkles className="h-3 w-3 ml-1" />
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{aiDescription || property.description}</p>
                  
                  {aiDescription && (
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span>AI-enhanced description</span>
                    </div>
                  )}
                </div>
                
                {(property.yearBuilt || property.neighborhood) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.yearBuilt && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Year Built</div>
                          <div className="font-medium">{property.yearBuilt}</div>
                        </CardContent>
                      </Card>
                    )}
                    {property.neighborhood && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Neighborhood</div>
                          <div className="font-medium">{property.neighborhood}</div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="features">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-6">
                {loadingAI ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading AI insights...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center mb-4">
                        <BarChart className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-lg font-semibold">Price Prediction</h3>
                      </div>
                      <div className="h-64 bg-card rounded-md p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={pricePredictions}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="label"
                              tick={{ fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              tickFormatter={(value) => `$${value}`}
                              tick={{ fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <Tooltip
                              formatter={(value) => [`$${value}`, "Price"]}
                              labelStyle={{ fontWeight: "bold" }}
                            />
                            <Area
                              type="monotone"
                              dataKey="price"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorPrice)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <Sparkles className="inline h-3 w-3 mr-1" />
                        AI-powered price prediction based on market trends and property features
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Brain className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-lg font-semibold">Market Analysis</h3>
                      </div>
                      <p className="text-muted-foreground">{marketInsights}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <Sparkles className="inline h-3 w-3 mr-1" />
                        Generated using AI analysis of current market conditions
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Contact and scheduling */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Schedule a Viewing</h3>
                
                <div className="flex items-center mb-6">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Select your preferred date and time</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {["Mon", "Tue", "Wed", "Thu"].map(day => (
                    <Button key={day} variant="outline" className="h-16 flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{day}</span>
                      <span className="text-sm">15</span>
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {["9:00 AM", "11:00 AM", "2:00 PM"].map(time => (
                    <Button key={time} variant="outline" className="text-sm">
                      {time}
                    </Button>
                  ))}
                </div>
                
                <Button className="w-full">Schedule Viewing</Button>
              </CardContent>
            </Card>
            
            {property.agent && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    {property.agent.photo ? (
                      <img 
                        src={property.agent.photo} 
                        alt={property.agent.name}
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg font-medium text-muted-foreground">
                          {property.agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{property.agent.name}</div>
                      <div className="text-sm text-muted-foreground">Property Agent</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{property.agent.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{property.agent.email}</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
