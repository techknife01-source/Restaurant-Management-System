import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ArrowRight, Clock, MapPin, Award, Wine, Flame, BedDouble } from 'lucide-react';
import heroImg from '../assets/images/bistro_hero_1790776488656.jpg';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onBookTable: () => void;
  onBookRoom: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onExploreMenu, 
  onBookTable,
  onBookRoom
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-[#0f1115]">
      {/* Background ambient glowing spheres */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#d49e47]/15 rounded-full blur-[140px] pointer-events-none" 
      />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#b46927]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Story & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Top Accolade Tag */}
            <div className="inline-flex items-center space-x-2 bg-[#1b1f28] border border-[#2f3747] px-3.5 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-4 h-4 text-[#d49e47]" />
              <span className="text-xs uppercase tracking-widest text-[#d49e47] font-semibold">
                Bardhaman Delicacies • Royal Indian Feasts • Boutique Stays
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-title text-4xl sm:text-5xl xl:text-6xl text-[#ede8de] leading-[1.15] font-normal tracking-tight">
              Royal Indian Feasts.{' '}
              <span className="italic font-serif text-[#d49e47] font-semibold block sm:inline">
                Honest Prices.
              </span>
            </h1>

            {/* Subtitle - Short, Magnetic, Customer-Attracting */}
            <div className="space-y-1.5">
              <p className="text-base sm:text-lg text-[#ede8de] font-medium leading-snug">
                Savor Bardhaman Dum Biryani with Aloo &amp; Egg (<span className="text-[#d49e47] font-bold">₹150</span>), GI Sitabhog (<span className="text-[#d49e47] font-bold">₹90</span>), and Old Delhi Butter Chicken at honest, pocket-friendly prices.
              </p>
              <p className="text-sm sm:text-base text-[#9fb0c6] font-light leading-relaxed">
                Stay in clean boutique rooms from <span className="text-emerald-400 font-semibold">₹499 (Non-AC)</span> &amp; <span className="text-emerald-400 font-semibold">₹799 (Split AC)</span> with 24/7 room service. Grand flavor, pocket-friendly luxury.
              </p>
            </div>

            {/* Interactive CTAs with Motion */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreMenu}
                className="flex items-center justify-center space-x-2.5 bg-[#d49e47] hover:bg-[#c38e39] text-[#12141a] px-6 py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-xl shadow-[#d49e47]/20 group cursor-pointer"
              >
                <span>Order Indian &amp; Bistro Menu</span>
                <ArrowRight className="w-4 h-4 text-[#12141a] group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBookRoom}
                className="flex items-center justify-center space-x-2 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 px-5 py-4 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer shadow-lg shadow-emerald-950/30"
              >
                <BedDouble className="w-4 h-4 text-emerald-400" />
                <span>Book a Room (from ₹499)</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBookTable}
                className="flex items-center justify-center space-x-2 bg-[#171a23] hover:bg-[#212633] text-[#ede8de] border border-[#31394b] px-5 py-4 rounded-xl font-medium text-sm sm:text-base transition-all hover:border-[#d49e47]/60 cursor-pointer shadow-md"
              >
                <Calendar className="w-4 h-4 text-[#d49e47]" />
                <span>Book Table</span>
              </motion.button>
            </div>

            {/* Feature Pills with Hover Animations */}
            <div className="pt-6 border-t border-[#222733] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.div whileHover={{ y: -3 }} className="flex items-center space-x-2.5 text-xs text-[#a0a8b9] p-1.5 rounded-lg transition-colors hover:text-white">
                <Flame className="w-4 h-4 text-[#d49e47] shrink-0 animate-pulse" />
                <span>Awadhi Dum Handi &amp; Tandoor</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="flex items-center space-x-2.5 text-xs text-[#a0a8b9] p-1.5 rounded-lg transition-colors hover:text-white">
                <Award className="w-4 h-4 text-[#d49e47] shrink-0" />
                <span>Grade-A Kashmiri Saffron</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="flex items-center space-x-2.5 text-xs text-[#a0a8b9] p-1.5 rounded-lg transition-colors hover:text-white">
                <BedDouble className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rooms ₹499 to ₹999/night</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="flex items-center space-x-2.5 text-xs text-[#a0a8b9] p-1.5 rounded-lg transition-colors hover:text-white">
                <Clock className="w-4 h-4 text-[#d49e47] shrink-0" />
                <span>24/7 In-Room Dining Service</span>
              </motion.div>
            </div>

          </motion.div>

          {/* Right Column: Hero Visual with Vignette Frame & Floating Bistro Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#d49e47]/40 via-[#b46927]/20 to-transparent blur-md"></div>

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-[#3a4356]/60 shadow-2xl bg-[#141720]">
                <img
                  src={heroImg}
                  alt="Saffron and Thyme Bistro Ambience"
                  className="w-full h-[400px] sm:h-[460px] object-cover scale-100 hover:scale-105 transition-transform duration-700"
                />
                
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-80" />

                {/* Floating Bottom Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 bg-[#141720]/95 backdrop-blur-md border border-[#303848] rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#d49e47] font-semibold">
                        Tonight's Royal Tasting &amp; Stay Special
                      </div>
                      <div className="text-sm font-serif-title font-semibold text-[#ede8de]">
                        Awadhi Saffron Feast + AC Heritage Room
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#d49e47]/20 text-[#d49e47] text-xs font-bold">
                      Special Combo
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-[#8f98ab] pt-2 border-t border-[#262c3a]">
                    <span className="flex items-center text-emerald-400 font-medium">
                      <BedDouble className="w-3.5 h-3.5 mr-1" />
                      AC Suites available from ₹799
                    </span>
                    <button
                      onClick={onBookRoom}
                      className="text-[#d49e47] hover:underline font-semibold"
                    >
                      Check Rooms &rarr;
                    </button>
                  </div>
                </motion.div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
