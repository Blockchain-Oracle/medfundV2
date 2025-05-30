import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, FileText, CreditCard, Shield, Heart, LogOut, User, Settings, UserCircle, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import MD5 from "crypto-js/md5";

export const Header = () => {
  const location = useLocation();
  const { login, logout, authenticated, user, ready } = usePrivy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Determine if we're in a dashboard/internal page (light theme) or external page (dark theme)
  const isInternalPage = location.pathname.includes("/dashboard") || 
                         location.pathname.includes("/medical-records");
  
  // Function to check if the current path matches a given path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Get user profile info from social logins
  const getProfileInfo = () => {
    if (!user) return { avatarUrl: null, displayName: "User" };

    let avatarUrl = null;
    let displayName = "User";

    // Get info from Google account
    if (user.google?.name) {
      displayName = user.google.name;
      // Generate Gravatar URL from email
      if (user.google.email) {
        const emailHash = MD5(user.google.email.trim().toLowerCase()).toString();
        avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=200`;
      }
    } 
    // Fallback to linked accounts
    else if (user.linkedAccounts && user.linkedAccounts.length > 0) {
      for (const account of user.linkedAccounts) {
        if (account.type === "google_oauth" && account.name) {
          displayName = account.name;
          // Generate Gravatar URL from email
          if (account.email) {
            const emailHash = MD5(account.email.trim().toLowerCase()).toString();
            avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=200`;
          }
          break;
        } else if (account.type === "twitter_oauth" && account.name) {
          displayName = account.name;
          break;
        }
      }
    }

    // Fallbacks
    if (!avatarUrl && user.wallet?.address) {
      // Fallback to blockchain avatar
      avatarUrl = `https://effigy.im/a/${user.wallet.address}.svg`;
    }

    if (displayName === "User" && user.email?.address) {
      displayName = user.email.address.split('@')[0];
      
      // If we have an email but no avatar yet, use Gravatar
      if (!avatarUrl) {
        const emailHash = MD5(user.email.address.trim().toLowerCase()).toString();
        avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=200`;
      }
    }

    return { avatarUrl, displayName };
  };

  const { avatarUrl, displayName } = getProfileInfo();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // You might want to navigate to home or login page here
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle login
  const handleLogin = () => {
    login();
  };

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
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {ready ? (
              authenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center space-x-3 ${isInternalPage ? "bg-gray-50 hover:bg-gray-100" : "bg-white/10 hover:bg-white/20"} px-4 py-2 rounded-lg transition-colors`}>
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-100">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Profile" 
                            className="w-8 h-8 object-cover"
                            onError={(e) => {
                              // If image fails to load, replace with user icon
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const iconEl = document.createElement('div');
                                iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-blue-600"><path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle></svg>';
                                parent.appendChild(iconEl.firstChild as Node);
                              }
                            }}
                          />
                        ) : (
                          <UserCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <span className={`${isInternalPage ? "text-gray-700" : "text-white"} font-medium truncate max-w-[100px]`}>
                        {displayName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer flex w-full items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/medical-records" className="cursor-pointer flex w-full items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Medical Records
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleLogin} 
                    className={isInternalPage ? "text-gray-600 hover:text-gray-800 border-gray-300" : "text-white border-white/20 hover:bg-white/10"}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleLogin} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Register
                  </Button>
                </>
              )
            ) : (
              // Loading state
              <Button disabled variant="outline" className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}; 