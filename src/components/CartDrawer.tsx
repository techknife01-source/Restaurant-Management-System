import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Utensils, 
  Bike, 
  Package, 
  BedDouble,
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    tableNumber,
    deliveryAddress,
    couponCode,
    appliedDiscount,
    couponError,
    applyCoupon,
    removeCoupon,
    tipPercentage,
    setTipPercentage,
    subtotal,
    tax,
    serviceCharge,
    tipAmount,
    totalAmount,
    totalItemCount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (ok) setInputCoupon('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#13151d] border-l border-[#262c3b] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#232837] flex items-center justify-between bg-[#101218]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#d49e47]/20 border border-[#d49e47]/30 flex items-center justify-center text-[#d49e47]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title text-lg font-bold text-[#ede8de]">
                  Your Order Cart
                </h3>
                <p className="text-xs text-[#8a94a6]">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#8a94a6] hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#1a1d27] text-[#9ba4b5] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dining / Service Mode Selection */}
          <div className="px-5 py-3 bg-[#161822] border-b border-[#232837]">
            <div className="text-[11px] uppercase tracking-wider text-[#9aa4b5] font-semibold mb-2">
              Service Delivery Mode
            </div>
            <div className="grid grid-cols-4 gap-1 bg-[#0d0f14] p-1 rounded-xl border border-[#202533]">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all ${
                  orderType === 'dine_in'
                    ? 'bg-[#d49e47] text-[#12141a] font-semibold'
                    : 'text-[#8792a4] hover:text-white'
                }`}
              >
                <Utensils className="w-3 h-3" />
                <span>Dine-In</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('room_service')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all ${
                  orderType === 'room_service'
                    ? 'bg-emerald-500 text-[#12141a] font-bold'
                    : 'text-[#8792a4] hover:text-emerald-400'
                }`}
              >
                <BedDouble className="w-3 h-3" />
                <span>Room</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeaway_parcel')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all ${
                  orderType === 'takeaway_parcel'
                    ? 'bg-[#d49e47] text-[#12141a] font-semibold'
                    : 'text-[#8792a4] hover:text-white'
                }`}
              >
                <Package className="w-3 h-3" />
                <span>Parcel</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('home_delivery')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all ${
                  orderType === 'home_delivery'
                    ? 'bg-[#d49e47] text-[#12141a] font-semibold'
                    : 'text-[#8792a4] hover:text-white'
                }`}
              >
                <Bike className="w-3 h-3" />
                <span>Delivery</span>
              </button>
            </div>

            {/* Target indicator */}
            <div className="mt-2 text-xs text-[#8f99ab] flex items-center justify-between">
              {orderType === 'dine_in' && (
                <span>Table: <strong className="text-[#ede8de]">{tableNumber}</strong></span>
              )}
              {orderType === 'room_service' && (
                <span>Delivering to: <strong className="text-emerald-400 font-bold">{tableNumber}</strong></span>
              )}
              {orderType !== 'dine_in' && orderType !== 'room_service' && (
                <span className="truncate">Destination: <strong className="text-[#ede8de]">{deliveryAddress}</strong></span>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#7e889b] py-12">
                <ShoppingBag className="w-12 h-12 text-[#353e50] mb-3" />
                <h4 className="font-serif-title text-base font-semibold text-[#ede8de]">
                  Your order cart is empty
                </h4>
                <p className="text-xs text-[#838e9f] mt-1 max-w-xs">
                  Explore our royal Awadhi Biryanis, Butter Chicken, and wood-fired delicacies.
                </p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="bg-[#181b24] border border-[#272d3b] rounded-xl p-3.5 flex items-start space-x-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#0d0f14]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#ede8de] truncate pr-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6d7789] hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#8a95a6] mt-0.5 space-y-0.5">
                      {item.spiceLevel && <span>Seasoning: {item.spiceLevel}</span>}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div>
                          + {item.selectedAddOns.map(a => `${a.label} (₹${a.price})`).join(', ')}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <div className="italic text-[#7b8595]">
                          Note: "{item.specialInstructions}"
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Stepper in INR */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#ede8de]">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>

                      <div className="flex items-center space-x-2 bg-[#12141a] border border-[#29303e] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-[#959faa] hover:text-white hover:bg-[#222733] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-[#ede8de]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-[#959faa] hover:text-white hover:bg-[#222733] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary & Checkout Section */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#101218] border-t border-[#232837] space-y-4">
              
              {/* Promo Coupon Form */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-300">
                    <span className="flex items-center space-x-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{couponCode} Applied ({(appliedDiscount * 100).toFixed(0)}% Off)</span>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-400 hover:text-white text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Coupon: WELCOME15 or BISTRO20"
                      value={inputCoupon}
                      onChange={e => setInputCoupon(e.target.value)}
                      className="flex-1 bg-[#161822] border border-[#2b3342] rounded-xl px-3 py-1.5 text-xs text-[#ede8de] placeholder-[#6b7688] focus:outline-none focus:border-[#d49e47]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#252a37] hover:bg-[#32394a] rounded-xl text-xs font-medium text-[#ede8de] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Tipping Selector */}
              <div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8b95a7] font-semibold mb-1.5">
                  <span>Chef &amp; Staff Gratuity</span>
                  <span className="text-[#ede8de] font-bold">₹{tipAmount.toFixed(0)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 15, 20].map(tip => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipPercentage(tip)}
                      className={`py-1 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        tipPercentage === tip
                          ? 'bg-[#d49e47]/20 border-[#d49e47] text-[#d49e47]'
                          : 'bg-[#161822] border-[#252c39] text-[#7d8798] hover:border-[#384357]'
                      }`}
                    >
                      {tip === 0 ? 'None' : `${tip}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculations in INR */}
              <div className="space-y-1.5 text-xs text-[#8f99ab] pt-2 border-t border-[#202534]">
                <div className="flex justify-between">
                  <span>F&amp;B Subtotal</span>
                  <span className="text-[#ede8de]">₹{subtotal.toFixed(0)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span>-₹{(subtotal * appliedDiscount).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5.00%)</span>
                  <span className="text-[#ede8de]">₹{tax.toFixed(0)}</span>
                </div>
                {orderType === 'dine_in' && (
                  <div className="flex justify-between">
                    <span>Hospitality Service (5.00%)</span>
                    <span className="text-[#ede8de]">₹{serviceCharge.toFixed(0)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Gratuity Tip ({tipPercentage}%)</span>
                    <span className="text-[#ede8de]">₹{tipAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#ede8de] pt-2 border-t border-[#242938]">
                  <span>Total Amount</span>
                  <span className="text-[#d49e47] text-base">₹{totalAmount.toFixed(0)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-sm transition-all shadow-xl shadow-[#d49e47]/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
