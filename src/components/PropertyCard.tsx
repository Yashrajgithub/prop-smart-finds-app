
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, BedDouble, Bath, PercentCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { toast } from "sonner";

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
  compatibilityScore?: number;
}

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
}

export const PropertyCard = ({ 
  property, 
  isFavorite = false, 
  onToggleFavorite,
  onClick
}: PropertyCardProps) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorited, setFavorited] = useState(isFavorite);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error("Please log in to save favorites");
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (favorited) {
        await userApi.removeFromFavorites(currentUser.id, property.id);
        toast.success("Removed from favorites");
      } else {
        await userApi.addToFavorites(currentUser.id, property.id);
        toast.success("Added to favorites");
      }
      
      setFavorited(!favorited);
      if (onToggleFavorite) onToggleFavorite();
      
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error("Error updating favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
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
            className={`rounded-full ${favorited ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-background/80 hover:bg-background'}`}
            onClick={handleFavoriteToggle}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
          </Button>
        </div>
        {property.compatibilityScore && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
              <PercentCircle className="h-3 w-3" />
              {property.compatibilityScore}% Match
            </Badge>
          </div>
        )}
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
