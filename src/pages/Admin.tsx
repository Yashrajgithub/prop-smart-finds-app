
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Users, Home as HomeIcon, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// Mock sample data (in a real app, this would come from Firestore)
const sampleProperties = [
  {
    id: "prop1",
    title: "Modern Downtown Apartment",
    type: "Apartment",
    location: "Downtown, New York",
    price: 2500,
    status: "Available"
  },
  {
    id: "prop2",
    title: "Spacious Family House",
    type: "House",
    location: "Suburb, Chicago",
    price: 3200,
    status: "Available"
  },
  {
    id: "prop3",
    title: "Cozy Studio Apartment",
    type: "Studio",
    location: "Midtown, San Francisco",
    price: 1800,
    status: "Available"
  },
  {
    id: "prop4",
    title: "Luxury Waterfront Condo",
    type: "Condo",
    location: "Waterfront, Miami",
    price: 4800,
    status: "Available"
  }
];

const sampleUsers = [
  {
    id: "user1",
    email: "john.doe@example.com",
    name: "John Doe",
    registered: "2025-04-01",
    matches: 15
  },
  {
    id: "user2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    registered: "2025-03-28",
    matches: 8
  },
  {
    id: "user3",
    email: "michael.brown@example.com",
    name: "Michael Brown",
    registered: "2025-04-10",
    matches: 12
  },
  {
    id: "user4",
    email: "sarah.jones@example.com",
    name: "Sarah Jones",
    registered: "2025-04-15",
    matches: 5
  }
];

const Admin = () => {
  const [properties, setProperties] = useState(sampleProperties);
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);

  // Delete property handler
  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(property => property.id !== id));
    toast.success("Property deleted successfully");
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage properties, users, and system settings
          </p>
        </header>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search properties or users..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isAddPropertyDialogOpen} onOpenChange={setIsAddPropertyDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new property to the system.
                </DialogDescription>
              </DialogHeader>
              
              <AddPropertyForm 
                onSubmit={(newProperty) => {
                  // In a real app, this would save to Firestore
                  const id = `prop${properties.length + 1}`;
                  setProperties([...properties, { id, ...newProperty, status: "Available" }]);
                  setIsAddPropertyDialogOpen(false);
                  toast.success("Property added successfully");
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Property Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No properties found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProperties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell className="font-medium">{property.title}</TableCell>
                            <TableCell>{property.type}</TableCell>
                            <TableCell>{property.location}</TableCell>
                            <TableCell>${property.price}/mo</TableCell>
                            <TableCell>{property.status}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteProperty(property.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Matches</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.registered}</TableCell>
                            <TableCell>{user.matches}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface PropertyFormData {
  title: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  imageUrl: string;
}

const AddPropertyForm = ({ onSubmit }: { onSubmit: (data: PropertyFormData) => void }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    type: "",
    location: "",
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    description: "",
    features: [],
    imageUrl: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($/month)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            value={formData.price.toString()} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select 
            value={formData.bedrooms.toString()} 
            onValueChange={(value) => setFormData({ ...formData, bedrooms: parseInt(value) })}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Select 
            value={formData.bathrooms.toString()} 
            onValueChange={(value) => setFormData({ ...formData, bathrooms: parseInt(value) })}
          >
            <SelectTrigger id="bathrooms">
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          rows={3} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input 
          id="imageUrl" 
          name="imageUrl" 
          value={formData.imageUrl} 
          onChange={handleChange} 
          placeholder="https://example.com/image.jpg" 
        />
      </div>
      
      <Button type="submit" className="w-full">Add Property</Button>
    </form>
  );
};

export default Admin;
