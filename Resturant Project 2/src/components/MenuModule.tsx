import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Check, 
  Utensils, 
  Wine, 
  BedDouble,
  Package,
  Bike
} from 'lucide-react';
import { MenuItem, MenuCategory, OrderType } from '../types/restaurant';
import { useCart } from '../context/CartContext';

interface MenuModuleProps {
  menuItems: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  onBackToHome?: () => void;
}

export const MenuModule: React.FC<MenuModuleProps> = ({ menuItems, onSelectDish, onBackToHome }) => {
  const { 
    addToCart, 
    orderType, 
    setOrderType, 
    tableNumber, 
    setTableNumber, 
    deliveryAddress, 
    setDeliveryAddress 
  } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterIndianOnly, setFilterIndianOnly] = useState(false);
  const [filterChefSpecialOnly, setFilterChefSpecialOnly] = useState(false);
  const [filterBardhamanOnly, setFilterBardhamanOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories: { key: MenuCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'All Dishes', icon: '🍽️' },
    { key: 'bardhaman_heritage', label: 'Bardhaman Heritage Specials', icon: '🍲' },
    { key: 'indian_delicacies', label: 'Royal Indian Feasts', icon: '🍛' },
    { key: 'starters', label: 'Starters & Tandoor', icon: '🥗' },
    { key: 'mains', label: 'Wood Hearth Mains', icon: '🥩' },
    { key: 'pastas', label: 'Saffron Pastas', icon: '🍝' },
    { key: 'desserts', label: 'Royal Desserts & Phirni', icon: '🍮' },
    { key: 'drinks', label: 'Kesar Drinks & Spritz', icon: '🍷' },
  ];

  // Filtering & Sorting
  const filteredDishes = useMemo(() => {
    return menuItems.filter(dish => {
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      if (filterVegOnly && !dish.isVegetarian) return false;
      if (filterIndianOnly && !dish.isIndianSpecial) return false;
      if (filterChefSpecialOnly && !dish.isChefSpecial) return false;
      if (filterBardhamanOnly && !dish.isBardhamanSpecial) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesCategory = dish.category.toLowerCase().includes(query);
        const matchesPartner = dish.heritageSource?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesPartner) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isChefSpecial ? 1 : 0) - (a.isChefSpecial ? 1 : 0);
    });
  }, [menuItems, selectedCategory, filterVegOnly, filterIndianOnly, filterChefSpecialOnly, filterBardhamanOnly, searchQuery, sortBy]);

  const handleQuickAdd = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setAddedItemNotice(dish.id);
    setTimeout(() => setAddedItemNotice(null), 1200);
  };

  return (
    <div className="py-12 bg-[#0f1115] text-[#ede8de] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Back Option */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8a95a8] hover:text-[#d49e47] bg-[#141720] border border-[#272e3d] px-3.5 py-2 rounded-xl transition-all hover:-translate-x-1 cursor-pointer"
          >
            <span>← Back to Home Page</span>
          </button>
        )}
        
        {/* Module Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 text-[#d49e47] text-xs uppercase tracking-widest font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Royal Indian Handi &amp; Wood-Fired Gastronomy</span>
          </div>
          <h1 className="font-serif-title text-4xl sm:text-5xl font-normal text-[#ede8de]">
            Artisanal Dining &amp; Indian Menu
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#9ba4b4] leading-relaxed">
            From Awadhi Dum Biryanis and rich Butter Chicken to hand-rolled Saffron Tagliolini. All prices are in <strong className="text-emerald-400 font-bold">Indian Rupees (₹)</strong> with zero hidden charges.
          </p>
        </motion.div>

        {/* Service Type Selector Bar */}
        <div className="bg-[#151821] border border-[#262c3b] rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Mode selector pills (Dine-in, Room Service, Parcel, Delivery) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#0d0f14] p-1 rounded-xl border border-[#222733] w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
                  orderType === 'dine_in'
                    ? 'bg-[#d49e47] text-[#12141a] shadow-md'
                    : 'text-[#8e98aa] hover:text-[#ede8de]'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Dine-In</span>
              </button>
              
              <button
                type="button"
                onClick={() => setOrderType('room_service')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
                  orderType === 'room_service'
                    ? 'bg-emerald-500 text-[#12141a] font-bold shadow-md'
                    : 'text-[#8e98aa] hover:text-emerald-400'
                }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Room Service</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway_parcel')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
                  orderType === 'takeaway_parcel'
                    ? 'bg-[#d49e47] text-[#12141a] shadow-md'
                    : 'text-[#8e98aa] hover:text-[#ede8de]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Parcel Takeaway</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('home_delivery')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
                  orderType === 'home_delivery'
                    ? 'bg-[#d49e47] text-[#12141a] shadow-md'
                    : 'text-[#8e98aa] hover:text-[#ede8de]'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
            </div>

            {/* Context input: Table or Room Number or Address */}
            <div className="w-full lg:w-auto flex items-center space-x-3 text-xs">
              {orderType === 'dine_in' && (
                <div className="flex items-center space-x-2 w-full lg:w-auto">
                  <span className="text-[#8e98aa] shrink-0 font-medium">Bistro Table:</span>
                  <select
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    className="bg-[#1b1f2a] border border-[#2f3747] rounded-xl px-3 py-2 text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  >
                    <option value="Table 1 (Terrace Garden)">Table 1 (Terrace Garden)</option>
                    <option value="Table 2 (Terrace Garden)">Table 2 (Terrace Garden)</option>
                    <option value="Table 4 (Main Hall)">Table 4 (Main Hall)</option>
                    <option value="Table 7 (Grand Chandelier)">Table 7 (Grand Chandelier)</option>
                    <option value="Table 9 (Wine Cellar Vault)">Table 9 (Wine Cellar Vault)</option>
                    <option value="Bar Counter 2 (Hearthside)">Bar Counter 2 (Hearthside)</option>
                  </select>
                </div>
              )}

              {orderType === 'room_service' && (
                <div className="flex items-center space-x-2 w-full lg:w-auto">
                  <span className="text-emerald-400 shrink-0 font-bold">Stay Guest Room:</span>
                  <select
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    className="bg-[#1b1f2a] border border-emerald-500/50 rounded-xl px-3 py-2 text-[#ede8de] focus:outline-none focus:border-emerald-400 font-semibold"
                  >
                    <option value="Room 101 (Non-AC Standard)">Room 101 (Non-AC Standard)</option>
                    <option value="Room 102 (Non-AC Standard)">Room 102 (Non-AC Standard)</option>
                    <option value="Room 104 (Non-AC Deluxe)">Room 104 (Non-AC Deluxe)</option>
                    <option value="Room 201 (AC Executive)">Room 201 (AC Executive)</option>
                    <option value="Room 202 (AC Executive)">Room 202 (AC Executive)</option>
                    <option value="Room 301 (Royal Heritage Suite)">Room 301 (Royal Heritage Suite)</option>
                  </select>
                </div>
              )}

              {orderType !== 'dine_in' && orderType !== 'room_service' && (
                <div className="flex items-center space-x-2 w-full lg:w-80">
                  <span className="text-[#8e98aa] shrink-0 font-medium">Destination:</span>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="Enter pickup name or delivery address"
                    className="w-full bg-[#1b1f2a] border border-[#2f3747] rounded-xl px-3 py-2 text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8a94a5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dum Biryani, Butter Chicken, Naan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#141720] border border-[#272e3d] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#ede8de] placeholder-[#6b7688] focus:outline-none focus:border-[#d49e47]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a94a5] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFilterBardhamanOnly(!filterBardhamanOnly);
                if (!filterBardhamanOnly) setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center space-x-1 ${
                filterBardhamanOnly
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                  : 'bg-[#141720] border-[#293140] text-[#8e98aa] hover:border-[#3e485a]'
              }`}
            >
              <span>🍲 Bardhaman Specials</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterIndianOnly(!filterIndianOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filterIndianOnly
                  ? 'bg-amber-950/80 border-[#d49e47] text-[#d49e47]'
                  : 'bg-[#141720] border-[#293140] text-[#8e98aa] hover:border-[#3e485a]'
              }`}
            >
              🍛 Royal Indian Delicacies
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filterVegOnly
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-[#141720] border-[#293140] text-[#8e98aa] hover:border-[#3e485a]'
              }`}
            >
              🌱 Pure Veg
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterChefSpecialOnly(!filterChefSpecialOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filterChefSpecialOnly
                  ? 'bg-[#d49e47]/20 border-[#d49e47] text-[#d49e47]'
                  : 'bg-[#141720] border-[#293140] text-[#8e98aa] hover:border-[#3e485a]'
              }`}
            >
              ✨ Chef's Special
            </motion.button>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#141720] border border-[#293140] text-[#c7cedb] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#d49e47]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Navigation Pills with Motion */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <motion.button
              key={cat.key}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#d49e47] text-[#12141a] font-bold shadow-lg shadow-[#d49e47]/25 scale-105'
                  : 'bg-[#141720] text-[#939cae] border border-[#252c3a] hover:bg-[#1a1e29] hover:text-[#ede8de]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Bardhaman Heritage Spotlight Banner */}
        {(selectedCategory === 'all' || selectedCategory === 'bardhaman_heritage' || filterBardhamanOnly) && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-amber-950/40 via-[#181d28] to-[#141720] border border-amber-500/35 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-500 text-[#12141a] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow">
                    🍲 BARDHAMAN HERITAGE FEASTS
                  </span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
                    Authentic Recipes &amp; Transparent Indian Rupees (₹)
                  </span>
                </div>
                <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#ede8de]">
                  Bardhaman's Iconic Food &amp; Heritage Delicacies
                </h3>
                <p className="text-xs sm:text-sm text-[#9da9bd] max-w-3xl leading-relaxed">
                  Handcrafted traditional specialties: Royal Biryani with tender Aloo &amp; Egg (<span className="text-emerald-400 font-semibold">₹150</span>), GI-Certified Sitabhog &amp; Mihidana (<span className="text-emerald-400 font-semibold">₹90</span>), Double Egg Chicken Kathi Roll (<span className="text-emerald-400 font-semibold">₹80</span>), Mughlai Paratha (<span className="text-emerald-400 font-semibold">₹95</span>), and Bhetki Fish Fry with Kasundi (<span className="text-emerald-400 font-semibold">₹120</span>).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setSelectedCategory('bardhaman_heritage');
                    setFilterBardhamanOnly(false);
                  }}
                  className="text-xs font-bold bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#d49e47]/20 cursor-pointer"
                >
                  View All Bardhaman Delicacies ({menuItems.filter(m => m.isBardhamanSpecial).length})
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dish Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDishes.map((dish, idx) => {
              const isAdded = addedItemNotice === dish.id;

              return (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => onSelectDish(dish)}
                  className="bg-[#141720] border border-[#252c3a] rounded-2xl overflow-hidden hover:border-[#d49e47]/60 transition-all duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-2xl hover:shadow-[#d49e47]/5"
                >
                  {/* Dish Thumbnail */}
                  <div className="relative h-52 overflow-hidden bg-[#0d0f14]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141720] via-transparent to-transparent opacity-60" />

                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {dish.isBardhamanSpecial && (
                        <span className="bg-amber-500 text-[#12141a] text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                          <span>🍲 Bardhaman Heritage</span>
                        </span>
                      )}
                      {dish.isIndianSpecial && !dish.isBardhamanSpecial && (
                        <span className="bg-[#d49e47] text-[#12141a] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-[#12141a]" />
                          <span>Royal Indian</span>
                        </span>
                      )}
                      {dish.isChefSpecial && !dish.isIndianSpecial && (
                        <span className="bg-[#d49e47] text-[#12141a] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                          Chef's Pick
                        </span>
                      )}
                      {dish.isVegetarian && (
                        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Veg
                        </span>
                      )}
                    </div>

                    {/* Rating Pill */}
                    <span className="absolute bottom-3 right-3 bg-[#12141a]/90 backdrop-blur-sm text-[#ede8de] text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center space-x-1 border border-[#2f3747]">
                      <Star className="w-3.5 h-3.5 text-[#d49e47] fill-[#d49e47]" />
                      <span>{dish.rating}</span>
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#828c9e] mb-1">
                        <span className="capitalize">{dish.category.replace('_', ' ')}</span>
                        <span className="flex items-center text-[#8e98aa]">
                          <Clock className="w-3 h-3 mr-1" />
                          {dish.prepTime}
                        </span>
                      </div>

                      {dish.heritageSource && (
                        <div className="text-[11px] font-semibold text-amber-400/90 mb-1 flex items-center space-x-1 truncate">
                          <span>🏛️ {dish.heritageSource}</span>
                        </div>
                      )}

                      <h3 className="font-serif-title text-lg font-semibold text-[#ede8de] group-hover:text-[#d49e47] transition-colors line-clamp-1">
                        {dish.name}
                      </h3>

                      <p className="mt-2 text-xs text-[#959faa] line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-5 pt-4 border-t border-[#222835] flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#ede8de]">
                          ₹{dish.price}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onSelectDish(dish);
                          }}
                          className="text-xs text-[#959faa] hover:text-[#ede8de] px-2.5 py-1.5 rounded-lg border border-[#2c3444] hover:border-[#404c62] transition-colors cursor-pointer"
                        >
                          Customize
                        </button>

                        <button
                          type="button"
                          onClick={e => handleQuickAdd(dish, e)}
                          className={`p-2 rounded-xl transition-all shadow font-bold flex items-center justify-center cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] shadow-[#d49e47]/20'
                          }`}
                          title="Quick Add 1 to Order"
                        >
                          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
