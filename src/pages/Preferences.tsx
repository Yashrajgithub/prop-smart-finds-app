import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userApi } from "@/lib/api";

const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Townhouse"];
const FEATURES = ["Parking", "Garden", "Pool", "Gym", "Pet Friendly", "Furnished"];

const Preferences = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Preference state
  const [location, setLocation] = useState("");
  const [minBudget, setMinBudget] = useState(500);
  const [maxBudget, setMaxBudget] = useState(5000);
  const [propertyType, setPropertyType] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState(1);
  const [minBathrooms, setMinBathrooms] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You must be logged in to save preferences");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const preferences = {
        location,
        budget: {
          min: minBudget,
          max: maxBudget
        },
        propertyType,
        bedrooms: minBedrooms,
        bathrooms: minBathrooms,
        features: selectedFeatures,
        updatedAt: new Date()
      };
      
      // Save to MongoDB API instead of Firestore
      const userId = currentUser.id; // Use id instead of uid
      await userApi.updatePreferences(userId, { preferences });
      
      toast.success("Preferences saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error("Error saving preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Your Preferences</CardTitle>
          <CardDescription>
            Tell us what you're looking for in a property
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Input
                id="location"
                placeholder="City, neighborhood or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Budget Range (per month)</Label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="minBudget" className="text-sm text-muted-foreground">Min: ${minBudget}</Label>
                  <Slider
                    id="minBudget"
                    min={500}
                    max={10000}
                    step={100}
                    value={[minBudget]}
                    onValueChange={(value) => setMinBudget(value[0])}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="maxBudget" className="text-sm text-muted-foreground">Max: ${maxBudget}</Label>
                  <Slider
                    id="maxBudget"
                    min={500}
                    max={10000}
                    step={100}
                    value={[maxBudget]}
                    onValueChange={(value) => setMaxBudget(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Minimum Bedrooms</Label>
                <Select 
                  value={String(minBedrooms)} 
                  onValueChange={(value) => setMinBedrooms(parseInt(value, 10))}
                >
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Minimum Bathrooms</Label>
                <Select 
                  value={String(minBathrooms)} 
                  onValueChange={(value) => setMinBathrooms(parseInt(value, 10))}
                >
                  <SelectTrigger id="bathrooms">
                    <SelectValue placeholder="Bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Desired Features</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FEATURES.map((feature) => (
                  <Button
                    key={feature}
                    type="button"
                    variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                    className="justify-start h-auto py-2"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Preferences;
