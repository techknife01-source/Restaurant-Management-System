import React, { useState } from 'react';
import { X, Star, Clock, Flame, Sparkles, Plus, Minus, Wine, Check } from 'lucide-react';
import { MenuItem } from '../types/restaurant';
import { useCart } from '../context/CartContext';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  const { addToCart } = useCart();

  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<string>(dish.spiceLevel || 'Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<{ label: string; price: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const toggleAddOn = (addon: { label: string; price: number }) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.label === addon.label);
      if (exists) {
        return prev.filter(a => a.label !== addon.label);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = dish.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(dish, quantity, selectedSpice, selectedAddOns, specialInstructions);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#141720] border border-[#2e3748] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#12141a]/80 text-[#ede8de] hover:text-white hover:bg-black flex items-center justify-center border border-[#2f3747] transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 w-full bg-[#0d0f14]">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141720] via-transparent to-transparent opacity-90" />

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-[#d49e47] text-[#12141a] inline-block mb-2 shadow">
                  {dish.category.replace('_', ' ').toUpperCase()}
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#ede8de] drop-shadow-md">
                  {dish.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#9aa4b4] block">Base Price</span>
                <span className="text-2xl font-bold text-[#ede8de]">₹{dish.price}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Meta Tags: Rating, Prep Time, Calories, Dietary */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#959faa]">
              <span className="flex items-center space-x-1 bg-[#1c202a] border border-[#2b3342] px-2.5 py-1 rounded-lg text-[#ede8de]">
                <Star className="w-3.5 h-3.5 text-[#d49e47] fill-[#d49e47]" />
                <span className="font-semibold">{dish.rating}</span>
                <span className="text-[#7c8697]">({dish.reviewsCount} reviews)</span>
              </span>

              <span className="flex items-center space-x-1 bg-[#1c202a] border border-[#2b3342] px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-[#d49e47]" />
                <span>{dish.prepTime}</span>
              </span>

              <span className="flex items-center space-x-1 bg-[#1c202a] border border-[#2b3342] px-2.5 py-1 rounded-lg">
                <Flame className="w-3.5 h-3.5 text-[#d49e47]" />
                <span>{dish.calories} kcal</span>
              </span>

              {dish.isVegetarian && (
                <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg font-medium">
                  🌱 Pure Veg
                </span>
              )}
              {dish.isIndianSpecial && (
                <span className="bg-amber-950/40 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-lg font-medium">
                  ✨ Royal Indian
                </span>
              )}
              {dish.isBardhamanSpecial && (
                <span className="bg-amber-950/60 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-lg font-semibold flex items-center space-x-1">
                  <span>🍲 Bardhaman Heritage Recipe</span>
                </span>
              )}
            </div>

            {/* Bardhaman Heritage Origin Banner */}
            {dish.isBardhamanSpecial && (
              <div className="bg-gradient-to-r from-amber-950/40 via-[#181c25] to-[#141720] border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Authentic Burdwan Heritage Culinary Tradition</span>
                  </div>
                  <p className="text-xs text-[#a3afc2]">
                    Kitchen Origin: <strong className="text-[#ede8de]">{dish.heritageSource || 'Bardhaman Heritage Hearth'}</strong> • Pure Handcrafted Quality: <strong className="text-emerald-400">₹{dish.price}</strong>
                  </p>
                </div>
                <span className="text-[11px] text-amber-300 bg-amber-900/30 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap">
                  100% Desi Ghee &amp; Wood-Fired
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-[#a8b3c5] leading-relaxed">
              {dish.description}
            </p>

            {/* Pairing Note */}
            {dish.pairingNote && (
              <div className="bg-[#181c25] border border-[#2a3242] rounded-xl p-3.5 flex items-start space-x-3">
                <Wine className="w-5 h-5 text-[#d49e47] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#ede8de] block">Chef's Recommended Pairing:</span>
                  <span className="text-[#96a0b1]">{dish.pairingNote}</span>
                </div>
              </div>
            )}

            {/* Spice / Heat Profile */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#d49e47] block">
                Select Spice &amp; Desi Heat Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Mild', 'Medium', 'Spicy', 'Desi Tikha'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedSpice(lvl)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      selectedSpice === lvl
                        ? 'bg-[#d49e47]/20 border-[#d49e47] text-[#ede8de] font-bold'
                        : 'bg-[#181c25] border-[#293140] text-[#8e98a8] hover:border-[#3d475c]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Gourmet Enhancements / Add-ons */}
            {dish.customizationOptions && dish.customizationOptions.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d49e47] block">
                  Add-Ons &amp; Accompaniments
                </label>
                <div className="space-y-2">
                  {dish.customizationOptions.flatMap(co => co.options).map((opt, i) => {
                    const isSelected = selectedAddOns.some(a => a.label === opt.label);
                    return (
                      <div
                        key={i}
                        onClick={() => toggleAddOn(opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#d49e47]/10 border-[#d49e47] text-[#ede8de]'
                            : 'bg-[#181c25] border-[#272f3e] text-[#939eae] hover:border-[#384357]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-[#d49e47] border-[#d49e47]' : 'border-[#424c5e]'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-[#12141a]" />}
                          </div>
                          <span>{opt.label}</span>
                        </div>
                        <span className="font-semibold text-[#d49e47]">+₹{opt.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#9aa4b5] block">
                Special Kitchen Note
              </label>
              <input
                type="text"
                placeholder="e.g. Less oil, extra onions, deliver hot to Room 202..."
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                className="w-full bg-[#181c25] border border-[#2b3344] rounded-xl px-3.5 py-2.5 text-xs text-[#ede8de] placeholder-[#657082] focus:outline-none focus:border-[#d49e47]"
              />
            </div>

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 sm:p-6 bg-[#11131a] border-t border-[#262c3a] flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 bg-[#181c25] border border-[#2c3444] rounded-xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-[#222734] hover:bg-[#2c3344] text-[#ede8de] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#ede8de]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#222734] hover:bg-[#2c3344] text-[#ede8de] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={addedSuccess}
            className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] shadow-[#d49e47]/20'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Order!</span>
              </>
            ) : (
              <>
                <span>Add to Order</span>
                <span>•</span>
                <span>₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
