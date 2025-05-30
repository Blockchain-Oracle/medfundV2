import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, FileText, CreditCard, Shield, Heart, LogOut, User } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

export const Header = () => {
  const location = useLocation();
  const { login, logout, authenticated, user, ready } = usePrivy();

  // Determine if we're in a dashboard/internal page (light theme) or external page (dark theme)
  const isInternalPage = location.pathname.includes("/dashboard") || 
                         location.pathname.includes("/medical-records");
  
  // Function to check if the current path matches a given path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Get user profile info
  const userAvatarUrl = user?.wallet?.address 
    ? `https://effigy.im/a/${user.wallet.address}.svg` // Fallback to blockchain avatar
    : null;
  const userDisplayName = user?.email?.address || "User";

  return (
    <header className={`${isInternalPage ? "bg-white shadow-lg border-b" : "bg-gray-900/90 backdrop-blur-sm border-b border-white/10"}`}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/MedFund_Logo.png" alt="MedFund Logo" className="h-8 w-8" />
            <span className={`text-2xl font-bold ${isInternalPage ? "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent" : "text-white"}`}>MedFund</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/campaigns">
              <Button 
                variant="ghost" 
                className={isActive("/campaigns") 
                  ? isInternalPage 
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200" 
                    : "bg-white/10 text-blue-300 hover:bg-white/20 border border-white/20"
                  : isInternalPage
                    ? "text-gray-700 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                }
              >
                <Heart className="w-4 h-4 mr-2" />
                Campaigns
              </Button>
            </Link>
            
            <Link to="/start-campaign">
              <Button 
                variant="ghost" 
                className={isActive("/start-campaign") 
                  ? isInternalPage 
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200" 
                    : "bg-white/10 text-blue-300 hover:bg-white/20 border border-white/20"
                  : isInternalPage
                    ? "text-gray-700 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                }
              >
                Start Campaign
              </Button>
            </Link>
            
            {authenticated && (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    className={isActive("/dashboard") 
                      ? isInternalPage 
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200" 
                        : "bg-white/10 text-blue-300 hover:bg-white/20 border border-white/20"
                      : isInternalPage
                        ? "text-gray-700 hover:bg-gray-100" 
                        : "text-white hover:bg-white/10"
                    }
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                
                <Link to="/medical-records">
                  <Button 
                    variant="ghost" 
                    className={isActive("/medical-records") 
                      ? isInternalPage 
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200" 
                        : "bg-white/10 text-blue-300 hover:bg-white/20 border border-white/20"
                      : isInternalPage
                        ? "text-gray-700 hover:bg-gray-100" 
                        : "text-white hover:bg-white/10"
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Medical Records
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  className={isInternalPage
                    ? "text-gray-700 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                  }
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={isInternalPage
                    ? "text-gray-700 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                  }
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Identity
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {ready ? (
              authenticated ? (
                <>
                  <div className={`flex items-center space-x-3 ${isInternalPage ? "bg-gray-50" : "bg-white/10"} px-4 py-2 rounded-lg`}>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {userAvatarUrl ? (
                        <img src={userAvatarUrl} alt="Profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <span className={isInternalPage ? "text-gray-700" : "text-white"}>
                      {userDisplayName}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => logout()} 
                    className={isInternalPage ? "text-gray-600 hover:text-gray-800 border-gray-300" : "text-white border-white/20 hover:bg-white/10"}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => login()} 
                    className={isInternalPage ? "text-gray-600 hover:text-gray-800 border-gray-300" : "text-white border-white/20 hover:bg-white/10"}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => login()} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Register
                  </Button>
                </>
              )
            ) : (
              // Loading state
              <Button disabled variant="outline">Loading...</Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}; 