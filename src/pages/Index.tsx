import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { SearchIcon, Star, Home, Building, Building2, AreaChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Find Your Perfect Property Match with <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            PropSmartFinds uses AI to match you with properties that fit your preferences, budget, and lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  <SearchIcon className="h-5 w-5" />
                  View Your Matches
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  <Star className="h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            )}
            <Link to="/properties">
              <Button variant="outline" size="lg">
                Browse All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How PropSmartFinds Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Tell Us Your Preferences</h3>
              <p className="text-muted-foreground">
                Answer a few questions about your ideal property, location, and budget.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Our algorithm analyzes thousands of properties to find your perfect matches.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Get Personalized Results</h3>
              <p className="text-muted-foreground">
                View properties ranked by compatibility score, tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">95%</p>
              <p className="text-sm text-muted-foreground">Match Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">5K+</p>
              <p className="text-sm text-muted-foreground">Properties</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">10K+</p>
              <p className="text-sm text-muted-foreground">Happy Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">4.8/5</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of happy customers who found their dream property with PropSmartFinds.
          </p>
          {currentUser ? (
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg">Create an Account</Button>
            </Link>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © 2025 PropSmartFinds. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
