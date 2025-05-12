
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home,
  Search,
  Settings,
  LayoutDashboard,
  LineChart,
  Building,
  Heart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="border-b sticky top-0 z-30 bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PropSmartFinds</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive("/") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link
              to="/properties"
              className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive("/properties") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              <Search className="mr-1 h-4 w-4" />
              Properties
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                    isActive("/dashboard") ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/market-insights"
                  className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                    isActive("/market-insights") ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  <LineChart className="mr-1 h-4 w-4" />
                  AI Insights
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/admin") ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {currentUser ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {currentUser.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer w-full flex">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/properties" className="cursor-pointer w-full flex">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Properties</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/market-insights" className="cursor-pointer w-full flex">
                        <LineChart className="mr-2 h-4 w-4" />
                        <span>Market Insights</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/preferences" className="cursor-pointer w-full flex">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Preferences</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <button
            className="block md:hidden rounded-md p-2 text-primary-foreground transition-colors hover:bg-primary/80"
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container pt-4 pb-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                <Building className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">PropSmartFinds</span>
              </Link>
              <button
                className="rounded-md p-2 text-primary-foreground transition-colors hover:bg-primary/80"
                onClick={toggleMenu}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            
            <div className="mt-8 space-y-4">
              <Link
                to="/"
                className="block py-3 text-lg font-medium"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="block py-3 text-lg font-medium"
                onClick={closeMenu}
              >
                Properties
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-3 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/market-insights"
                    className="block py-3 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    AI Market Insights
                  </Link>
                  <Link
                    to="/preferences"
                    className="block py-3 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    Preferences
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-3 text-lg font-medium"
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-4">
                  <Button asChild variant="outline">
                    <Link to="/login" onClick={closeMenu}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup" onClick={closeMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
