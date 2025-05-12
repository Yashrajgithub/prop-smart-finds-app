import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Settings, 
  Home as HomeIcon, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Star, 
  AlignLeft, 
  PercentCircle 
} from "lucide-react";
import { toast } from "sonner";
import { propertyApi, userApi } from "@/lib/api";

// Temporary sample properties until API is connected
const sampleProperties = [
  {
    id: "prop1",
    title: "Modern Downtown Apartment",
    description: "Beautiful apartment in the heart of downtown with amazing views.",
    type: "Apartment",
    location: "Downtown, New York",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    features: ["Parking", "Gym", "Pet Friendly"],
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    compatibilityScore: 92
  },
  {
    id: "prop2",
    title: "Spacious Family House",
    description: "Large house perfect for families with a beautiful garden.",
    type: "House",
    location: "Suburb, Chicago",
    price: 3200,
    bedrooms: 4,
    bathrooms: 3,
    features: ["Parking", "Garden", "Pet Friendly"],
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    compatibilityScore: 85
  },
  {
    id: "prop3",
    title: "Cozy Studio Apartment",
    description: "Perfect small studio for singles or couples in a quiet neighborhood.",
    type: "Studio",
    location: "Midtown, San Francisco",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    features: ["Furnished", "Pet Friendly"],
    imageUrl: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    compatibilityScore: 78
  },
  {
    id: "prop4",
    title: "Luxury Waterfront Condo",
    description: "High-end condo with stunning water views and premium amenities.",
    type: "Condo",
    location: "Waterfront, Miami",
    price: 4800,
    bedrooms: 3,
    bathrooms: 2.5,
    features: ["Parking", "Pool", "Gym", "Pet Friendly"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGx1eHVyeSUyMGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    compatibilityScore: 88
  }
];

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
  compatibilityScore: number;
}

interface UserPreferences {
  location?: string;
  budget?: {
    min: number;
    max: number;
  };
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from MongoDB API
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        // Get user data and preferences
        const userId = currentUser.id;
        const userData = await userApi.getUserData(userId);
        
        if (userData) {
          setUserPreferences(userData.preferences || null);
          
          // Get user favorites
          const userFavorites = await userApi.getFavorites(userId);
          setFavorites(userFavorites || []);
          
          // Get property recommendations
          const recommendedProperties = await propertyApi.getRecommendations(userId)
            .catch(() => propertyApi.getProperties()); // Fallback to all properties
          
          if (recommendedProperties && recommendedProperties.length > 0) {
            setProperties(recommendedProperties);
          } else {
            // Fallback to sample data for development
            setProperties(sampleProperties);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading dashboard data");
        // Fallback to sample data
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  const toggleFavorite = async (propertyId: string) => {
    if (!currentUser) return;
    
    try {
      const userId = currentUser.id;
      
      if (favorites.includes(propertyId)) {
        // Remove from favorites
        await userApi.removeFromFavorites(userId, propertyId);
        setFavorites(favorites.filter(id => id !== propertyId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        await userApi.addToFavorites(userId, propertyId);
        setFavorites([...favorites, propertyId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Error updating favorites");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Find your perfect property match based on your preferences
            </p>
            <div className="flex space-x-4">
              <Link to="/preferences">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Update Preferences
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="recommendations">
            <TabsList className="mb-6">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="favorites">
                Favorites
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{favorites.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendations" className="space-y-8">
              {!userPreferences ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Set Your Preferences</h3>
                  <p className="text-muted-foreground mb-4">
                    Tell us what you're looking for in a property to get personalized recommendations
                  </p>
                  <Link to="/preferences">
                    <Button>Set Preferences</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium mb-2">Your Current Preferences</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {userPreferences.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userPreferences.location}</span>
                        </div>
                      )}
                      {userPreferences.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">${userPreferences.budget.min} - ${userPreferences.budget.max}</span>
                        </div>
                      )}
                      {userPreferences.propertyType && (
                        <div className="flex items-center gap-2">
                          <HomeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userPreferences.propertyType}</span>
                        </div>
                      )}
                      {userPreferences.bedrooms && (
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userPreferences.bedrooms}+ beds</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties
                      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
                      .map((property) => (
                        <PropertyCard 
                          key={property.id} 
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={() => toggleFavorite(property.id)}
                        />
                      ))}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="favorites">
              {favorites.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save properties you like for easy access later
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties
                    .filter(property => favorites.includes(property.id))
                    .map((property) => (
                      <PropertyCard 
                        key={property.id} 
                        property={property}
                        isFavorite={true}
                        onToggleFavorite={() => toggleFavorite(property.id)}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const PropertyCard = ({ property, isFavorite, onToggleFavorite }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className={`rounded-full ${isFavorite ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-background/80 hover:bg-background'}`}
            onClick={onToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
            <PercentCircle className="h-3 w-3" />
            {property.compatibilityScore}% Match
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{property.title}</CardTitle>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {property.location}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold">${property.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1 text-muted-foreground" />
              {property.bedrooms}
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
              {property.bathrooms}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="secondary" className="font-normal">
              +{property.features.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;
