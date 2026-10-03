import React from 'react';
import { motion } from 'motion/react';
import { Wine, Flame, Sparkles, MapPin, Calendar, Clock, Star, Quote } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface AmbienceStoryProps {
  onBookTable: () => void;
}

export const AmbienceStory: React.FC<AmbienceStoryProps> = ({ onBookTable }) => {
  const zones = [
    {
      name: 'Starlight Terrace Garden',
      tag: 'Open-Air & Pergola',
      desc: 'Dine under hanging wisteria and fairy lights with heated slate stone tables and natural herb planters.',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Grand Hearth Hall',
      tag: 'Main Dining Room',
      desc: 'Centred around our open white-oak wood grill, plush cognac leather booths, and warm candlelight.',
      img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'The Botanical Wine Vault',
      tag: 'Sommelier Reserve',
      desc: 'Historic exposed brick cellar holding rare vintages, artisanal orange wines, and private tasting tables.',
      img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: "Chef’s Hearth Counter",
      tag: 'Interactive Gastronomy',
      desc: 'Exclusive eight-seat bar overlooking flame searing, plating craftsmanship, and direct chef pairing stories.',
      img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const testimonials = [
    {
      quote: "The saffron tagliolini with Norwegian langoustines was one of the finest pasta dishes I have tasted in twenty years of culinary critique.",
      author: "Eleanor Vance",
      source: "London Gastronomy Weekly",
      rating: 5
    },
    {
      quote: "An extraordinary sensory atmosphere. The wood-fired ribeye infused with mountain thyme embers sets a new benchmark for West End dining.",
      author: "Marcus Sterling",
      source: "Epicurean Journal",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#0f1115] text-[#ede8de] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story & Philosophy Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 text-[#d49e47] text-xs uppercase tracking-widest font-semibold">
              <Flame className="w-4 h-4 animate-pulse" />
              <span>Our Culinary Hearth &amp; Heritage</span>
            </div>
            
            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              A Symphony of Wild Mountain Thyme &amp; Gold Threads
            </h2>

            <p className="text-sm sm:text-base text-[#a2abbc] leading-relaxed font-light">
              Founded by Executive Chef Julian Thorne, <strong className="text-[#ede8de]">Saffron &amp; Thyme</strong> was born from a deep reverence for slow botanical infusions and primitive hearth cooking. 
            </p>

            <p className="text-sm sm:text-base text-[#a2abbc] leading-relaxed font-light">
              Every morning, our team receives hand-harvested Grade-A Persian saffron, organic heritage grains milled in-house, and wild thyme foraged from coastal cliffs. Cooking over aged white oak wood allows delicate herbal bouquets to caramelize into unforgettable sauces.
            </p>

            <div className="pt-4 flex items-center space-x-6">
              <div>
                <div className="text-2xl font-serif-title font-bold text-[#d49e47]">100%</div>
                <div className="text-xs text-[#828c9e]">Organic Sourcing</div>
              </div>
              <div className="h-8 w-[1px] bg-[#2a303d]"></div>
              <div>
                <div className="text-2xl font-serif-title font-bold text-[#d49e47]">45 Days</div>
                <div className="text-xs text-[#828c9e]">Dry-Aged Prime Cuts</div>
              </div>
              <div className="h-8 w-[1px] bg-[#2a303d]"></div>
              <div>
                <div className="text-2xl font-serif-title font-bold text-[#d49e47]">400+</div>
                <div className="text-xs text-[#828c9e]">Reserve Cellar Bins</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-[#2b3242] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                  alt="Executive Chef preparing artisanal saffron dish"
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#161922] border border-[#2e3646] p-5 rounded-xl shadow-xl max-w-xs hidden sm:block">
                <p className="font-serif-title italic text-sm text-[#ede8de]">
                  "Cooking with wild thyme and saffron requires patience — the flame must coax, not force, their aromas."
                </p>
                <div className="mt-2 text-xs font-semibold text-[#d49e47]">— Julian Thorne, Executive Chef</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* The 4 Dining Ambience Zones */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-widest text-[#d49e47] font-semibold mb-2">
              Seating Atmospheres
            </div>
            <h3 className="font-serif-title text-3xl sm:text-4xl text-[#ede8de]">
              Four Distinctive Dining Spaces
            </h3>
            <p className="text-sm text-[#969fae] mt-2">
              Select your preferred table experience when making a reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {zones.map((zone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[#141720] border border-[#252c39] rounded-2xl overflow-hidden hover:border-[#d49e47]/60 transition-all flex flex-col group shadow-lg"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={zone.img}
                    alt={zone.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141720] via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#d49e47]/20 text-[#d49e47] border border-[#d49e47]/40">
                    {zone.tag}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-title font-semibold text-lg text-[#ede8de]">
                      {zone.name}
                    </h4>
                    <p className="text-xs text-[#8c96a7] mt-2 leading-relaxed">
                      {zone.desc}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={onBookTable}
                    className="mt-4 text-xs font-semibold text-[#d49e47] hover:text-[#f0ba65] flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Reserve in this zone</span>
                    <span>&rarr;</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials & Praise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#151821] border border-[#29303e] rounded-2xl p-7 relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-[#d49e47]/30 mb-3" />
              <p className="font-editorial text-lg sm:text-xl italic text-[#ede8de] leading-relaxed">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-[#242a36] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[#ede8de]">{t.author}</div>
                  <div className="text-xs text-[#858f9f]">{t.source}</div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#d49e47] fill-[#d49e47]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hours & Location Callout Banner */}
        <div className="bg-gradient-to-r from-[#181c25] via-[#1d222e] to-[#181c25] border border-[#2f3747] rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-[#d49e47] font-semibold">
              Location &amp; Table Inquiries
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl text-[#ede8de]">
              {RESTAURANT_INFO.address}
            </h3>
            <p className="text-sm text-[#969fae]">
              {RESTAURANT_INFO.openingHours.weekdays} • {RESTAURANT_INFO.openingHours.weekends}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="tel:+15557233766"
              className="px-6 py-3.5 rounded-xl border border-[#3b4456] text-[#ede8de] hover:border-[#d49e47] text-sm font-medium transition-colors"
            >
              Call Reservations (+1 555 723-3766)
            </a>
            <button
              onClick={onBookTable}
              className="px-7 py-3.5 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] text-sm font-bold transition-all shadow-lg shadow-[#d49e47]/20"
            >
              Book Your Table Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
