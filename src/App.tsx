import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedDishes } from './components/FeaturedDishes';
import { AmbienceStory } from './components/AmbienceStory';
import { GuestReviews } from './components/GuestReviews';
import { MenuModule } from './components/MenuModule';
import { DishDetailModal } from './components/DishDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TableBookingModule } from './components/TableBookingModule';
import { RoomBookingModule } from './components/RoomBookingModule';
import { OrdersAndBookingsHub } from './components/OrdersAndBookingsHub';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { INITIAL_MENU_ITEMS } from './data/menuData';
import { MenuItem, OrderRecord } from './types/restaurant';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'rooms' | 'booking' | 'hub' | 'admin'>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const handleToggleDishStock = (dishId: string) => {
    setMenuItems(prev =>
      prev.map(dish =>
        dish.id === dishId ? { ...dish, available: !dish.available } : dish
      )
    );
  };

  const handleOrderCompleted = (order: OrderRecord) => {
    setCurrentView('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#0f1115] text-[#ede8de] flex flex-col font-sans selection:bg-[#d49e47] selection:text-[#12141a]">
          
          {/* Navigation Bar */}
          <Navbar
            currentView={currentView}
            setCurrentView={(v: any) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={() => {
              setCurrentView('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Main View Router */}
          <main className="flex-1">
            {currentView === 'home' && (
              <>
                <HeroSection
                  onExploreMenu={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBookTable={() => {
                    setCurrentView('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBookRoom={() => {
                    setCurrentView('rooms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                <FeaturedDishes
                  dishes={menuItems}
                  onSelectDish={(dish) => setSelectedDish(dish)}
                  onExploreFullMenu={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                <AmbienceStory
                  onBookTable={() => {
                    setCurrentView('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                <GuestReviews
                  onExploreMenu={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBookRoom={() => {
                    setCurrentView('rooms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}

            {currentView === 'menu' && (
              <MenuModule
                menuItems={menuItems}
                onSelectDish={(dish) => setSelectedDish(dish)}
                onBackToHome={handleBackToHome}
              />
            )}

            {currentView === 'rooms' && (
              <RoomBookingModule
                onBackToHome={handleBackToHome}
                onOrderRoomService={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToHub={() => {
                  setCurrentView('hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'booking' && (
              <TableBookingModule
                onBackToHome={handleBackToHome}
                onNavigateToHub={() => {
                  setCurrentView('hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'hub' && (
              <OrdersAndBookingsHub
                onBackToHome={handleBackToHome}
                onNavigateToMenu={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToBooking={() => {
                  setCurrentView('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToRooms={() => {
                  setCurrentView('rooms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'admin' && (
              <AdminDashboard
                menuItems={menuItems}
                onToggleMenuItemAvailability={handleToggleDishStock}
                onBackToHome={handleBackToHome}
              />
            )}
          </main>

          {/* Footer */}
          <Footer
            onNavigate={(v: any) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookTable={() => {
              setCurrentView('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Slide-over Shopping Cart Drawer */}
          <CartDrawer
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />

          {/* Dish Detail & Customization Modal */}
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
          />

          {/* Checkout & Bill Payment Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderCompleted={handleOrderCompleted}
          />

        </div>
      </CartProvider>
    </AuthProvider>
  );
}
