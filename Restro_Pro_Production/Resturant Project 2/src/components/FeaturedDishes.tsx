import React from 'react';
import { motion } from 'motion/react';
import { Star, Plus, Sparkles, Clock, ArrowRight, Flame } from 'lucide-react';
import { MenuItem } from '../types/restaurant';
import { useCart } from '../context/CartContext';
import indianFeastImg from '../assets/images/indian_food_feast_1790777131203.jpg';

interface FeaturedDishesProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
  onExploreFullMenu: () => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  dishes,
  onSelectDish,
  onExploreFullMenu
}) => {
  const { addToCart } = useCart();

  // Highlight top 4 creations (featuring Bardhaman Heritage & Royal Indian specialties)
  const featured = dishes.filter(d => d.isChefSpecial || d.isBardhamanSpecial || d.isIndianSpecial).slice(0, 4);

  return (
    <section className="py-20 bg-[#12141a] border-t border-b border-[#212633] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-[#d49e47] text-xs uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Bardhaman Delicacies &amp; Royal Hearth</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#ede8de] font-normal">
              Chef’s Handpicked Creations
            </h2>
            <p className="mt-2 text-sm text-[#9ba3b4] max-w-xl">
              Authentic Bardhaman Dum Biryani, GI-Tagged Sitabhog &amp; Mihidana, Butter Chicken, and wood-fired artisanal delicacies.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreFullMenu}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-[#d49e47] hover:text-[#e5b364] font-semibold text-sm group cursor-pointer"
          >
            <span>Explore Full Indian &amp; Bistro Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Featured Dish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((dish, idx) => {
            const displayImage = dish.image || indianFeastImg;

            return (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-[#171a23] border border-[#29303e] rounded-2xl overflow-hidden hover:border-[#d49e47]/60 transition-all duration-300 flex flex-col group shadow-lg hover:shadow-2xl hover:shadow-[#d49e47]/10"
              >
                {/* Image Container with Badges */}
                <div
                  className="relative h-52 overflow-hidden cursor-pointer bg-[#0f1115]"
                  onClick={() => onSelectDish(dish)}
                >
                  <img
                    src={displayImage}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171a23] via-transparent to-transparent opacity-60" />

                  {/* Chef / Indian / Heritage Special Badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 ${
                    dish.isBardhamanSpecial
                      ? 'bg-amber-500 text-[#12141a]'
                      : 'bg-[#d49e47] text-[#12141a]'
                  }`}>
                    {dish.isBardhamanSpecial ? (
                      <span>🍲 Bardhaman Heritage</span>
                    ) : dish.isIndianSpecial ? (
                      <>
                        <Flame className="w-3 h-3 text-[#12141a]" />
                        <span>Royal Indian</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#12141a]" />
                        <span>Chef's Pick</span>
                      </>
                    )}
                  </span>

                  {/* Rating Tag */}
                  <span className="absolute bottom-3 right-3 bg-[#12141a]/90 backdrop-blur-sm text-[#ede8de] text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center space-x-1 border border-[#2f3747]">
                    <Star className="w-3.5 h-3.5 text-[#d49e47] fill-[#d49e47]" />
                    <span>{dish.rating}</span>
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8a93a5] mb-1.5">
                      <span className="capitalize">{dish.category.replace('_', ' ')}</span>
                      <span className="flex items-center text-[#9ea8ba]">
                        <Clock className="w-3 h-3 mr-1" />
                        {dish.prepTime}
                      </span>
                    </div>

                    {dish.heritageSource && (
                      <div className="text-[11px] font-semibold text-amber-400/90 mb-1 truncate">
                        <span>🏛️ {dish.heritageSource}</span>
                      </div>
                    )}

                    <h3
                      onClick={() => onSelectDish(dish)}
                      className="font-serif-title text-lg font-semibold text-[#ede8de] group-hover:text-[#d49e47] transition-colors cursor-pointer line-clamp-1"
                    >
                      {dish.name}
                    </h3>

                    <p className="mt-2 text-xs text-[#959faa] line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Price in INR & Order Action */}
                  <div className="mt-5 pt-4 border-t border-[#262c39] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#7e889a] block">Price</span>
                      <span className="text-xl font-bold text-[#ede8de]">₹{dish.price}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectDish(dish)}
                        className="text-xs text-[#a9b3c4] hover:text-[#ede8de] px-2.5 py-1.5 rounded-lg border border-[#2b3342] hover:border-[#404b60] transition-colors cursor-pointer"
                      >
                        Customize
                      </button>

                      <button
                        onClick={() => addToCart(dish, 1)}
                        className="bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] p-2 rounded-xl transition-all shadow shadow-[#d49e47]/20 flex items-center justify-center font-bold cursor-pointer"
                        title="Add to Order"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
