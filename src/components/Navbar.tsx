import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Calendar, 
  ShoppingBag, 
  User as UserIcon, 
  Sparkles, 
  Menu, 
  X, 
  LogOut, 
  Receipt,
  Wine,
  Phone,
  ChefHat,
  BedDouble,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenBooking
}) => {
  const { currentUser, isAdmin, isStaffMode, setIsStaffMode, loginWithGoogle, logout } = useAuth();
  const { totalItemCount, totalAmount, setIsCartOpen, orderType } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f1115]/90 backdrop-blur-md border-b border-[#262b36] transition-all">
      {/* Top micro-bar */}
      <div className="bg-[#15181f] border-b border-[#222731] py-1.5 px-4 text-xs text-[#9ba3b4] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-[#d49e47]">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
              Bardhaman Heritage Delicacies &amp; Royal Hearth
            </span>
            <span className="hidden lg:flex items-center text-amber-300/90 font-medium">
              <Flame className="w-3.5 h-3.5 mr-1 text-[#d49e47] animate-bounce" />
              Handcrafted Awadhi Dum &amp; Tandoor
            </span>
            <span className="flex items-center text-emerald-400 font-medium">
              <BedDouble className="w-3.5 h-3.5 mr-1.5" />
              Affordable Stays: Non-AC ₹499-₹599 | AC ₹799-₹999/night
            </span>
            <span className="hidden xl:inline text-[#8a92a2]">
              FSSAI Lic: 10021011000492 • GST Registered
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="tel:+919876543210" className="flex items-center hover:text-[#d49e47] transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1 text-[#d49e47]" />
              +91 98765 43210
            </a>
            {/* Quick staff mode toggle for preview/evaluation */}
            <button
              onClick={() => setIsStaffMode(!isStaffMode)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 ${
                isStaffMode || isAdmin
                  ? 'bg-[#d49e47]/20 text-[#d49e47] border border-[#d49e47]/40'
                  : 'bg-[#222731] text-[#9ba3b4] hover:text-white'
              }`}
              title="Toggle Manager & Kitchen KDS mode"
            >
              <ChefHat className="w-3 h-3 mr-1" />
              <span>{isStaffMode || isAdmin ? 'Manager View Active' : 'Staff Access'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 group text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d49e47] via-[#b46927] to-[#753c15] p-0.5 flex items-center justify-center shadow-lg shadow-[#d49e47]/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#12141a] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#d49e47]" />
              </div>
            </div>
            <div>
              <div className="font-serif-title text-xl sm:text-2xl font-bold tracking-wider text-[#ede8de] group-hover:text-[#d49e47] transition-colors">
                Saffron &amp; Thyme
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#d49e47]/80 font-medium -mt-1">
                Artisanal Bistro &amp; Boutique Stay
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-[#d49e47] bg-[#d49e47]/10'
                  : 'text-[#c6cbd6] hover:text-white hover:bg-[#1c202a]'
              }`}
            >
              Home &amp; Story
            </button>

            <button
              onClick={() => handleNavClick('menu')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentView === 'menu'
                  ? 'text-[#d49e47] bg-[#d49e47]/10'
                  : 'text-[#c6cbd6] hover:text-white hover:bg-[#1c202a]'
              }`}
            >
              <span>Menu &amp; Indian Feasts</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-500/30">
                ₹ INR
              </span>
            </button>

            <button
              onClick={onOpenBooking}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentView === 'booking'
                  ? 'text-[#d49e47] bg-[#d49e47]/10'
                  : 'text-[#c6cbd6] hover:text-white hover:bg-[#1c202a]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#d49e47]" />
              <span>Book Table</span>
            </button>

            {/* Affordable Room Booking Nav Button */}
            <button
              onClick={() => handleNavClick('rooms')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                currentView === 'rooms'
                  ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 shadow-sm'
                  : 'text-[#c6cbd6] hover:text-emerald-300 hover:bg-[#1c202a]'
              }`}
            >
              <BedDouble className="w-4 h-4 text-emerald-400" />
              <span>Rooms (from ₹499)</span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">
                AC / Non-AC
              </span>
            </button>

            <button
              onClick={() => handleNavClick('hub')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentView === 'hub'
                  ? 'text-[#d49e47] bg-[#d49e47]/10'
                  : 'text-[#c6cbd6] hover:text-white hover:bg-[#1c202a]'
              }`}
            >
              <Receipt className="w-4 h-4 text-[#d49e47]" />
              <span>My Hub</span>
            </button>

            {(isAdmin || isStaffMode) && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  currentView === 'admin'
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-950/20'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Manager KDS</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons: Cart & Auth */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Quick Order Type Badge */}
            <div className="hidden md:flex items-center bg-[#171a22] border border-[#2b313e] px-2.5 py-1 rounded-full text-xs text-[#a0a8b9]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              <span className="font-medium text-[#ede8de]">
                {orderType === 'dine_in' ? 'Dine-In' : orderType === 'room_service' ? 'Room Service' : orderType === 'takeaway_parcel' ? 'Parcel' : 'Delivery'}
              </span>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-[#1b1e27] hover:bg-[#252a36] border border-[#2e3444] text-[#ede8de] px-3.5 py-2 rounded-xl transition-all shadow-md group cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#d49e47] group-hover:scale-110 transition-transform" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d49e47] text-[#12141a] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] uppercase tracking-wider text-[#9199aa]">Order Cart</div>
                <div className="text-xs font-semibold text-[#ede8de]">
                  ₹{totalAmount > 0 ? totalAmount.toFixed(0) : '0'}
                </div>
              </div>
            </button>

            {/* User Account / Google Sign-in */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full border border-[#333a4c] hover:border-[#d49e47] transition-colors focus:outline-none cursor-pointer"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#d49e47]/20 text-[#d49e47] flex items-center justify-center text-xs font-bold">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'G'}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#171a22] border border-[#2a303e] rounded-xl shadow-2xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-[#262c38]">
                      <p className="font-medium text-[#ede8de] truncate">{currentUser.displayName || 'Guest Diner'}</p>
                      <p className="text-xs text-[#8a92a2] truncate">{currentUser.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#d49e47]/20 text-[#d49e47]">
                          Restaurant &amp; Hotel Manager
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('hub');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#202531] text-[#c6cbd6] flex items-center space-x-2"
                    >
                      <Receipt className="w-4 h-4 text-[#d49e47]" />
                      <span>My Orders &amp; Room Passes</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('rooms');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#202531] text-emerald-400 flex items-center space-x-2"
                    >
                      <BedDouble className="w-4 h-4" />
                      <span>Book a Room (from ₹499)</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('admin');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#202531] text-[#c6cbd6] flex items-center space-x-2"
                    >
                      <ChefHat className="w-4 h-4 text-[#d49e47]" />
                      <span>Manager / Kitchen KDS</span>
                    </button>

                    <div className="border-t border-[#262c38] my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-950/20 text-red-400 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-2 bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#d49e47]/15 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Guest Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#c6cbd6] hover:text-white hover:bg-[#1e222d]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#13151c] border-b border-[#262c38] px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium ${
              currentView === 'home' ? 'text-[#d49e47] bg-[#d49e47]/10' : 'text-[#c6cbd6]'
            }`}
          >
            Home &amp; Story
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
              currentView === 'menu' ? 'text-[#d49e47] bg-[#d49e47]/10' : 'text-[#c6cbd6]'
            }`}
          >
            <span>Artisanal Menu &amp; Indian Feasts</span>
            <span className="text-xs bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
              ₹ INR
            </span>
          </button>
          <button
            onClick={() => handleNavClick('rooms')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
              currentView === 'rooms' ? 'text-emerald-400 bg-emerald-950/40' : 'text-[#c6cbd6]'
            }`}
          >
            <span className="flex items-center space-x-2">
              <BedDouble className="w-4 h-4 text-emerald-400" />
              <span>Affordable Rooms (from ₹499)</span>
            </span>
            <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-bold">
              AC/Non-AC
            </span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-[#c6cbd6] flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-[#d49e47]" />
            <span>Table Reservation</span>
          </button>
          <button
            onClick={() => handleNavClick('hub')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-[#c6cbd6] flex items-center space-x-2"
          >
            <Receipt className="w-4 h-4 text-[#d49e47]" />
            <span>My Orders &amp; Stay Passes</span>
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-emerald-400 bg-emerald-950/30 flex items-center space-x-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen &amp; Hotel Manager KDS</span>
          </button>
        </div>
      )}
    </header>
  );
};
