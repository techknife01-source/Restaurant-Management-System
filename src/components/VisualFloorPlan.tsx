import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Check, 
  Wine, 
  Flame, 
  TreePine, 
  Info, 
  CheckCircle2, 
  Lock,
  Heart,
  Eye
} from 'lucide-react';
import { TableInfo, SeatingZone } from '../types/restaurant';
import { RESTAURANT_TABLES } from '../data/menuData';

interface VisualFloorPlanProps {
  selectedTableId: string;
  onSelectTable: (table: TableInfo) => void;
  bookingDate: string;
  timeSlot: string;
  guestsCount: number;
}

export const VisualFloorPlan: React.FC<VisualFloorPlanProps> = ({
  selectedTableId,
  onSelectTable,
  bookingDate,
  timeSlot,
  guestsCount
}) => {
  const [hoveredTable, setHoveredTable] = useState<TableInfo | null>(null);
  const [activePreference, setActivePreference] = useState<string>('all');
  const [viewZone, setViewZone] = useState<string>('all');

  // Simulated occupied tables based on time (e.g. dinner peak slot has a couple occupied for realism)
  const isTableOccupied = (tableId: string): boolean => {
    // Deterministic simulation so it feels real-time without breaking user choices
    if (tableId === selectedTableId) return false;
    if (timeSlot === '20:00' && (tableId === 'T-02' || tableId === 'M-03')) return true;
    if (timeSlot === '19:30' && (tableId === 'C-02')) return true;
    return false;
  };

  const selectedTable = RESTAURANT_TABLES.find(t => t.id === selectedTableId) || RESTAURANT_TABLES[0];

  const preferences = [
    { key: 'all', label: 'All Tables' },
    { key: 'romantic', label: '💕 Romantic Booths (2p)' },
    { key: 'garden', label: '🌿 Garden & Starlight' },
    { key: 'hearth', label: '🔥 Fireplace & Hearth' },
    { key: 'wine', label: '🍷 Sommelier Wine Vault' },
    { key: 'party', label: '👥 Large Groups (4–8p)' },
  ];

  const matchesPreference = (table: TableInfo): boolean => {
    if (activePreference === 'all') return true;
    if (activePreference === 'romantic') return table.capacity === 2 && (table.features.includes('Romantic Candlelight') || table.features.includes('Plush Leather Booth') || table.features.includes('Quiet Corner'));
    if (activePreference === 'garden') return table.zone === 'terrace';
    if (activePreference === 'hearth') return table.features.includes('Fireplace Warmth') || table.features.includes('Flame Action View') || table.zone === 'chefs_counter';
    if (activePreference === 'wine') return table.zone === 'wine_cellar';
    if (activePreference === 'party') return table.capacity >= 4;
    return true;
  };

  return (
    <div className="bg-[#11131a] border border-[#262c3b] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* Top Header & Preference Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#d49e47] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Floor Plan</span>
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[#ede8de]">
            Select Your Dining Table
          </h3>
          <p className="text-xs text-[#828d9f]">
            Click any available table directly on the floor plan for {bookingDate} ({timeSlot}).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#d49e47] border border-[#f5c369] shadow-sm"></span>
            <span className="text-[#ede8de] font-semibold">Selected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1b2230] border border-emerald-500/60"></span>
            <span className="text-[#8c97aa]">Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-950 border border-red-500/40"></span>
            <span className="text-[#8c97aa]">Reserved</span>
          </div>
        </div>
      </div>

      {/* Preference Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {preferences.map(pref => (
          <button
            key={pref.key}
            type="button"
            onClick={() => setActivePreference(pref.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activePreference === pref.key
                ? 'bg-[#d49e47] text-[#12141a] shadow-md'
                : 'bg-[#181c25] text-[#8a95a6] border border-[#272d3b] hover:text-[#ede8de]'
            }`}
          >
            {pref.label}
          </button>
        ))}
      </div>

      {/* Main Floor Plan Map Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#0c0d12] border border-[#222735] rounded-2xl overflow-hidden shadow-inner select-none">
        
        {/* Subtle architectural floor grids */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#d49e47 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Zone Boundaries & Labels */}
        {/* Left Zone: Terrace Garden */}
        <div className="absolute left-0 top-0 bottom-0 w-[36%] border-r border-dashed border-[#2b3548] p-3 pointer-events-none">
          <div className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400/80">
            <TreePine className="w-3.5 h-3.5" />
            <span>Starlight Terrace Garden</span>
          </div>
          <div className="absolute bottom-3 left-3 text-[9px] text-[#556073]">
            Open Air Pergola • Herb Planters
          </div>
        </div>

        {/* Center Zone: Main Hall */}
        <div className="absolute left-[36%] top-0 bottom-0 w-[40%] border-r border-dashed border-[#2b3548] p-3 pointer-events-none">
          <div className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-[#d49e47]/80">
            <Flame className="w-3.5 h-3.5" />
            <span>Grand Hearth Dining Hall</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-[#343d4f] font-serif uppercase tracking-widest text-center">
            Grand Chandelier &amp; Fireplace
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-[#161a24] text-[9px] text-[#717c91] border border-[#262c3a]">
            Entrance &amp; Reception Doorway
          </div>
        </div>

        {/* Top-Right Zone: Wine Cellar Vault */}
        <div className="absolute right-0 top-0 w-[24%] h-[50%] border-b border-dashed border-[#2b3548] p-2.5 pointer-events-none">
          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-purple-300/80">
            <Wine className="w-3.5 h-3.5" />
            <span>Wine Cellar Vault</span>
          </div>
          <div className="text-[9px] text-[#596377] mt-0.5">Historic Brick Arches</div>
        </div>

        {/* Bottom-Right Zone: Chef's Counter */}
        <div className="absolute right-0 bottom-0 w-[24%] h-[50%] p-2.5 pointer-events-none">
          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
            <Flame className="w-3.5 h-3.5" />
            <span>Chef's Hearth Counter</span>
          </div>
          <div className="text-[9px] text-[#596377] mt-0.5">Tandoor &amp; Wood Hearth Pass</div>
        </div>

        {/* Render Tables on Floor Plan */}
        {RESTAURANT_TABLES.map(table => {
          const isSelected = selectedTableId === table.id;
          const isOccupied = isTableOccupied(table.id);
          const isHighlighted = matchesPreference(table);
          const isHovered = hoveredTable?.id === table.id;

          return (
            <motion.div
              key={table.id}
              onClick={() => {
                if (!isOccupied) {
                  onSelectTable(table);
                }
              }}
              onMouseEnter={() => setHoveredTable(table)}
              onMouseLeave={() => setHoveredTable(null)}
              whileHover={{ scale: isOccupied ? 1 : 1.1 }}
              whileTap={{ scale: isOccupied ? 1 : 0.95 }}
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 ${
                !isHighlighted ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Table representation based on shape */}
              <div className="relative group">
                
                {/* Visual table shape */}
                {table.shape === 'round' && (
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
                      isSelected
                        ? 'bg-[#d49e47] border-[#fff] text-[#12141a] ring-4 ring-[#d49e47]/40 shadow-xl'
                        : isOccupied
                        ? 'bg-red-950/40 border-red-700/50 text-red-400 cursor-not-allowed'
                        : 'bg-[#181d28] border-emerald-500/50 hover:border-[#d49e47] text-[#ede8de]'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-bold leading-none">
                      {table.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] opacity-80 mt-0.5">
                      {table.capacity}p
                    </span>
                  </div>
                )}

                {table.shape === 'rect' && (
                  <div
                    className={`w-16 h-11 sm:w-20 sm:h-13 rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
                      isSelected
                        ? 'bg-[#d49e47] border-[#fff] text-[#12141a] ring-4 ring-[#d49e47]/40 shadow-xl'
                        : isOccupied
                        ? 'bg-red-950/40 border-red-700/50 text-red-400 cursor-not-allowed'
                        : 'bg-[#181d28] border-emerald-500/50 hover:border-[#d49e47] text-[#ede8de]'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-bold leading-none">
                      {table.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] opacity-80 mt-0.5">
                      {table.capacity} Guests
                    </span>
                  </div>
                )}

                {table.shape === 'booth' && (
                  <div
                    className={`w-16 h-12 sm:w-22 sm:h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
                      isSelected
                        ? 'bg-[#d49e47] border-[#fff] text-[#12141a] ring-4 ring-[#d49e47]/40 shadow-xl'
                        : isOccupied
                        ? 'bg-red-950/40 border-red-700/50 text-red-400 cursor-not-allowed'
                        : 'bg-[#1b1926] border-purple-500/50 hover:border-[#d49e47] text-[#ede8de]'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-bold leading-none">
                      {table.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] opacity-80 mt-0.5">
                      Booth ({table.capacity}p)
                    </span>
                  </div>
                )}

                {table.shape === 'counter' && (
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
                      isSelected
                        ? 'bg-[#d49e47] border-[#fff] text-[#12141a] ring-4 ring-[#d49e47]/40 shadow-xl'
                        : isOccupied
                        ? 'bg-red-950/40 border-red-700/50 text-red-400 cursor-not-allowed'
                        : 'bg-[#181d28] border-amber-500/50 hover:border-[#d49e47] text-[#ede8de]'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-bold leading-none">
                      {table.label}
                    </span>
                    <span className="text-[8px] opacity-80 mt-0.5">
                      Bar
                    </span>
                  </div>
                )}

                {/* Status indicator badge */}
                {isSelected && (
                  <>
                    <span className="absolute -inset-1 rounded-full border border-amber-300 animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute -top-2 -right-2 bg-white text-[#12141a] w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg animate-bounce z-30">
                      ✓
                    </span>
                  </>
                )}

                {isOccupied && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shadow">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}

              </div>
            </motion.div>
          );
        })}

      </div>

      {/* Selected Table Preview & Confirmation Pill */}
      <div className="bg-[#181c25] border border-[#272e3d] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#d49e47] text-[#12141a] flex flex-col items-center justify-center font-bold shadow-md shrink-0">
            <span className="text-xs uppercase leading-none">Table</span>
            <span className="text-base">{selectedTable.label}</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif-title font-bold text-sm sm:text-base text-[#ede8de]">
                Table {selectedTable.label} ({selectedTable.zone.replace('_', ' ').toUpperCase()})
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Capacity: {selectedTable.capacity} Diners
              </span>
            </div>
            <p className="text-xs text-[#8c97aa] mt-0.5">
              {selectedTable.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {selectedTable.features.map((feat, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-[#12141a] border border-[#2b3342] px-2 py-0.5 rounded text-[#d49e47]"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto text-right">
          <span className="text-[11px] text-emerald-400 font-semibold block">
            Confirmed Table for Your Reservation
          </span>
          <span className="text-xs text-[#828d9e]">
            {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'} • {bookingDate}
          </span>
        </div>
      </div>

    </div>
  );
};
