import React from 'react';
import { UtensilsCrossed, Sparkles, MapPin, Phone, Mail, Clock, Wine, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FooterProps {
  onNavigate: (view: string) => void;
  onBookTable: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onBookTable }) => {
  return (
    <footer className="bg-[#0b0c10] border-t border-[#1e2330] text-[#8c97aa] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1b202c]">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d49e47] to-[#753c15] p-0.5 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#12141a] flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-[#d49e47]" />
                </div>
              </div>
              <div>
                <span className="font-serif-title text-xl font-bold text-[#ede8de] block">
                  Saffron &amp; Thyme
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#d49e47]">
                  Artisanal Bistro &amp; Dining
                </span>
              </div>
            </div>

            <p className="text-xs text-[#828d9e] leading-relaxed max-w-sm">
              Celebrating wild Mediterranean flora, slow saffron infusions, and primitive wood-fired gastronomy in West End Belgrave Square.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-xs text-[#d49e47]">
              <Sparkles className="w-4 h-4" />
              <span>Michelin Guide Selected 2025/2026</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-title font-semibold text-sm text-[#ede8de]">
              Gastronomy &amp; Table
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#d49e47] transition-colors"
                >
                  Home &amp; Culinary Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d49e47] transition-colors"
                >
                  Artisanal Menu &amp; Ordering
                </button>
              </li>
              <li>
                <button
                  onClick={onBookTable}
                  className="hover:text-[#d49e47] transition-colors"
                >
                  Table Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hub')}
                  className="hover:text-[#d49e47] transition-colors"
                >
                  My Orders &amp; Invoices
                </button>
              </li>
            </ul>
          </div>

          {/* Ambience Zones */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-title font-semibold text-sm text-[#ede8de]">
              Dining Atmospheres
            </h4>
            <ul className="space-y-2 text-[#7e899b]">
              <li>Starlight Terrace Pergola</li>
              <li>Grand Hearth Dining Room</li>
              <li>The 400-Bin Botanical Cellar</li>
              <li>Hearthside Tasting Counter</li>
              <li>Private Wine Vault Bookings</li>
            </ul>
          </div>

          {/* Hours & Contact */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-title font-semibold text-sm text-[#ede8de]">
              Hours &amp; Location
            </h4>
            <div className="space-y-2 text-[#7e899b]">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#d49e47] shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#d49e47] shrink-0" />
                <span>{RESTAURANT_INFO.phone}</span>
              </p>
              <p className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#d49e47] shrink-0 mt-0.5" />
                <span>Lunch: 12pm – 3:30pm<br />Dinner: 5:30pm – 11pm</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#626d7f] gap-4">
          <div>
            &copy; {new Date().getFullYear()} Saffron &amp; Thyme Artisanal Bistro. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>100% Organic Sourcing</span>
            <span>•</span>
            <span>Zero Synthetic Preservatives</span>
            <span>•</span>
            <span>Sommelier Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
