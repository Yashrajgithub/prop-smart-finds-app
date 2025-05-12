
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Home as HomeIcon, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Filter,
  ArrowUpDown,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { propertyApi } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";

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

const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Townhouse", "Studio"];
const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "bedrooms", label: "Most Bedrooms" }
];

const Properties = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedType, setSelectedType] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const [minBathrooms, setMinBathrooms] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [nlpSearchActive, setNlpSearchActive] = useState(false);

  // Regular search and filter
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const filters = {
          minPrice,
          maxPrice,
          propertyType: selectedType || undefined,
          bedrooms: minBedrooms || undefined,
          bathrooms: minBathrooms || undefined,
          sortBy
        };
        
        const data = await propertyApi.getProperties(filters);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
        
        // Fallback to sample data for development
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
            imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
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
            imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
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
            imageUrl: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
          }
        ];
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };

    if (!nlpSearchActive) {
      fetchProperties();
    }
  }, [minPrice, maxPrice, selectedType, minBedrooms, minBathrooms, sortBy, nlpSearchActive]);

  // Handle AI natural language search
  const handleNLPSearch = async () => {
    if (!searchQuery.trim()) {
      setNlpSearchActive(false);
      return;
    }
    
    setLoading(true);
    setNlpSearchActive(true);
    
    try {
      const results = await propertyApi.searchWithNLP(searchQuery);
      setProperties(results);
      toast.success(`Found ${results.length} properties matching your search criteria`);
    } catch (error) {
      console.error("NLP search error:", error);
      toast.error("AI search failed. Falling back to regular search.");
      setNlpSearchActive(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const getSortedProperties = () => {
    if (!properties.length) return [];
    
    return [...properties].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "bedrooms":
          return b.bedrooms - a.bedrooms;
        case "newest":
        default:
          return 0; // Assuming backend already sorted by newest
      }
    });
  };

  // Filter by text search (name or location)
  const getFilteredProperties = () => {
    const sorted = getSortedProperties();
    
    if (!searchQuery.trim() || nlpSearchActive) {
      return sorted;
    }
    
    const query = searchQuery.toLowerCase();
    return sorted.filter(property => 
      property.title.toLowerCase().includes(query) || 
      property.location.toLowerCase().includes(query) ||
      property.description.toLowerCase().includes(query)
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setMinPrice(500);
    setMaxPrice(10000);
    setSelectedType("");
    setMinBedrooms(null);
    setMinBathrooms(null);
    setSortBy("newest");
    setSearchQuery("");
    setNlpSearchActive(false);
  };

  const displayProperties = getFilteredProperties();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Property Listings</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search properties or try 'spacious apartment with a view under $3000'"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (nlpSearchActive && !e.target.value) {
                      setNlpSearchActive(false);
                    }
                  }}
                  className="pr-20"
                />
                <div className="absolute right-1 top-1 flex">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    onClick={handleNLPSearch}
                    title="AI Search"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => {
                      if (searchQuery) {
                        setNlpSearchActive(false);
                      }
                    }}
                    title="Regular Search"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-secondary/50" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </header>
        
        {/* Filters panel */}
        {showFilters && (
          <div className="mb-8 p-4 border rounded-lg bg-card">
            <h3 className="font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="flex items-center justify-between text-sm">
                  <span>${minPrice}</span>
                  <span>${maxPrice}</span>
                </div>
                <div className="pt-2">
                  <Slider
                    min={500}
                    max={10000}
                    step={100}
                    value={[minPrice, maxPrice]}
                    onValueChange={(values) => {
                      setMinPrice(values[0]);
                      setMaxPrice(values[1]);
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    {PROPERTY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bedrooms</label>
                  <Select 
                    value={minBedrooms !== null ? String(minBedrooms) : ""}
                    onValueChange={val => setMinBedrooms(val ? parseInt(val) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={String(num)}>
                          {num}+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bathrooms</label>
                  <Select 
                    value={minBathrooms !== null ? String(minBathrooms) : ""}
                    onValueChange={val => setMinBathrooms(val ? parseFloat(val) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      {[1, 1.5, 2, 2.5, 3].map(num => (
                        <SelectItem key={num} value={String(num)}>
                          {num}+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI search indicator */}
        {nlpSearchActive && (
          <div className="flex items-center gap-2 mb-6 p-2 bg-primary/10 rounded-md">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Using AI to search: "{searchQuery}"</span>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setNlpSearchActive(false)}>
              Clear
            </Button>
          </div>
        )}
        
        {/* Results display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading properties...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {displayProperties.length} properties found
              </p>
            </div>
            
            {displayProperties.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <HomeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onClick={() => navigate(`/property/${property.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
