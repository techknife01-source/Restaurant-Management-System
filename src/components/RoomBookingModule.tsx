import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bed, 
  Wind, 
  Sparkles, 
  Tv, 
  Wifi, 
  Users, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  ChevronRight, 
  CreditCard, 
  Banknote,
  UtensilsCrossed,
  ArrowLeft,
  Building,
  Check
} from 'lucide-react';
import { HOTEL_ROOMS } from '../data/menuData';
import { HotelRoom, RoomBookingRecord } from '../types/restaurant';
import { createRoomBookingInFirestore } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';
import { fireSuccessConfetti } from '../utils/confetti';

interface RoomBookingModuleProps {
  onBackToHome?: () => void;
  onOrderRoomService?: () => void;
  onNavigateToHub?: () => void;
}

export const RoomBookingModule: React.FC<RoomBookingModuleProps> = ({
  onBackToHome,
  onOrderRoomService,
  onNavigateToHub
}) => {
  const { currentUser } = useAuth();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Search & Booking parameters
  const [filterType, setFilterType] = useState<'all' | 'non_ac' | 'ac'>('all');
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>(HOTEL_ROOMS[0]);
  const [checkInDate, setCheckInDate] = useState<string>(todayStr);
  const [checkOutDate, setCheckOutDate] = useState<string>(tomorrowStr);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>(HOTEL_ROOMS[0].roomNumbers[0]);
  const [extraBed, setExtraBed] = useState<boolean>(false);
  const [breakfast, setBreakfast] = useState<boolean>(true);
  const [paymentOption, setPaymentOption] = useState<'pay_now' | 'pay_at_checkin'>('pay_now');

  // Guest details
  const [guestName, setGuestName] = useState<string>(currentUser?.displayName || 'Distinguished Guest');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser?.email || 'guest@saffronthyme.com');
  const [guestPhone, setGuestPhone] = useState<string>('+91 98765 43210');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<RoomBookingRecord | null>(null);

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.max(1, d2.getTime() - d1.getTime());
  const nightsCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Financials
  const baseRoomTotal = selectedRoom.pricePerNight * nightsCount;
  const extraBedTotal = extraBed ? 199 * nightsCount : 0;
  const breakfastTotal = breakfast ? 149 * guestsCount * nightsCount : 0;
  const totalAmount = baseRoomTotal + extraBedTotal + breakfastTotal;

  const filteredRooms = HOTEL_ROOMS.filter(r => {
    if (filterType === 'non_ac') return !r.isAC;
    if (filterType === 'ac') return r.isAC;
    return true;
  });

  const handleRoomSelect = (room: HotelRoom) => {
    setSelectedRoom(room);
    setSelectedRoomNumber(room.roomNumbers[0]);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingId = `rm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const bookingNumber = `ST-STAY-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: RoomBookingRecord = {
      id: bookingId,
      bookingNumber,
      userId: currentUser?.uid || 'guest',
      guestName: guestName.trim() || 'Guest Traveler',
      guestEmail: guestEmail.trim() || 'guest@saffronthyme.com',
      guestPhone: guestPhone.trim() || '+91 98765 43210',
      roomType: selectedRoom.type,
      roomName: selectedRoom.name,
      roomNumber: selectedRoomNumber,
      pricePerNight: selectedRoom.pricePerNight,
      checkInDate,
      checkOutDate,
      nightsCount,
      guestsCount,
      extraBedAdded: extraBed,
      breakfastIncluded: breakfast,
      totalAmount,
      paymentMethod: paymentOption === 'pay_now' ? 'Prepaid UPI / Card' : 'Pay at Check-In',
      paymentStatus: paymentOption === 'pay_now' ? 'paid' : 'pay_at_checkin',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      await createRoomBookingInFirestore(newBooking);
      fireSuccessConfetti();
      setConfirmedBooking(newBooking);
    } catch (err) {
      console.error('Room booking error:', err);
      setConfirmedBooking(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-[#0f1115] text-[#ede8de] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Back Option */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8a95a8] hover:text-[#d49e47] bg-[#141720] border border-[#272e3d] px-3.5 py-2 rounded-xl transition-all hover:-translate-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home Page</span>
          </button>
        )}

        {/* Animated Banner Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-[#1b1f29] border border-[#2e3747] px-3.5 py-1.5 rounded-full mb-3 shadow">
            <Sparkles className="w-4 h-4 text-[#d49e47] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#d49e47] font-semibold">
              Boutique Bistro Stay • 11 Themed Rooms
            </span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-5xl font-normal text-[#ede8de] leading-tight">
            Affordable Heritage Room Stays
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#9ba4b4] leading-relaxed">
            Choose from our expanded collection of Non-AC rooms <strong className="text-[#d49e47]">(₹499 to ₹599)</strong> and Split AC rooms &amp; suites <strong className="text-emerald-400">(₹799 to ₹999)</strong>. All rooms include free high-speed Wi-Fi, 24/7 hot water, and in-room dining from our tandoor &amp; hearth.
          </p>

          {/* Pricing Highlight Pill Ticker */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="bg-[#181c25] border border-[#2b3343] px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span className="text-[#8e98aa]">5 Non-AC Room Options:</span>
              <strong className="text-[#ede8de]">₹499 to ₹599/night</strong>
            </div>
            <div className="bg-[#181c25] border border-[#2b3343] px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[#8e98aa]">6 AC Room &amp; Suite Options:</span>
              <strong className="text-[#d49e47]">₹799 to ₹999/night</strong>
            </div>
          </div>
        </motion.div>

        {confirmedBooking ? (
          /* Animated Room Booking Confirmation & Key Card Pass */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-[#141720] border border-[#2b3343] rounded-3xl overflow-hidden shadow-2xl space-y-6"
          >
            <div className="bg-gradient-to-r from-[#d49e47] via-[#c68f38] to-[#99621b] p-6 text-[#12141a] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded">
                  Boutique Stay Reservation Pass
                </span>
                <h2 className="font-serif-title text-2xl font-bold mt-1">
                  Saffron &amp; Thyme Inn
                </h2>
                <p className="text-xs text-[#1f170e]">
                  Booking Reference: <strong>#{confirmedBooking.bookingNumber}</strong>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-black/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#12141a]" />
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[#848fa1] block">Primary Guest</span>
                  <strong className="text-sm text-[#ede8de]">{confirmedBooking.guestName}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Assigned Room</span>
                  <strong className="text-sm text-[#d49e47]">Room #{confirmedBooking.roomNumber}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Check-In Date</span>
                  <strong className="text-sm text-[#ede8de]">{confirmedBooking.checkInDate} (12:00 PM)</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Check-Out Date</span>
                  <strong className="text-sm text-[#ede8de]">{confirmedBooking.checkOutDate} (11:00 AM)</strong>
                </div>
              </div>

              <div className="p-4 bg-[#181c25] rounded-2xl border border-[#282f3d] grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#848fa1] block">Room Type:</span>
                  <strong className="text-[#ede8de]">{confirmedBooking.roomName}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Duration &amp; Guests:</span>
                  <strong className="text-[#ede8de]">{confirmedBooking.nightsCount} Nights • {confirmedBooking.guestsCount} Guests</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Settlement:</span>
                  <strong className="text-emerald-400 capitalize">{confirmedBooking.paymentMethod}</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-[#2b3343] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-[#12141a]" />
                  </div>
                  <div>
                    <div className="text-[#848fa1]">Total Stay Amount:</div>
                    <div className="text-2xl font-bold text-[#d49e47]">₹{confirmedBooking.totalAmount}</div>
                    <span className="text-[#7d8798]">Show pass at reception desk upon arrival</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#323a4b] hover:border-[#d49e47] text-xs font-semibold text-[#ede8de] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#d49e47]" />
                    <span>Print Pass</span>
                  </button>

                  {onOrderRoomService && (
                    <button
                      onClick={onOrderRoomService}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Order Food to Room</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            <div className="text-center pb-6">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="text-xs text-[#8e98aa] hover:text-[#ede8de] underline cursor-pointer"
              >
                Book Another Stay
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Room Catalog & Booking Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Room Options Cards */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Filter Tabs with Motion */}
              <div className="flex items-center space-x-2 bg-[#141720] p-1.5 rounded-2xl border border-[#252c39]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-[#d49e47] text-[#12141a] shadow-md font-bold'
                      : 'text-[#8e98aa] hover:text-[#ede8de]'
                  }`}
                >
                  All Rooms ({HOTEL_ROOMS.length})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setFilterType('non_ac')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterType === 'non_ac'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-[#8e98aa] hover:text-blue-300'
                  }`}
                >
                  Non-AC Rooms (5 options • ₹499–₹599)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setFilterType('ac')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterType === 'ac'
                      ? 'bg-[#d49e47] text-[#12141a] shadow-md font-bold'
                      : 'text-[#8e98aa] hover:text-[#ede8de]'
                  }`}
                >
                  AC Comfort &amp; Suites (6 options • ₹799–₹999)
                </motion.button>
              </div>

              {/* Room Cards List */}
              <div className="space-y-4">
                {filteredRooms.map((room, idx) => {
                  const isSelected = selectedRoom.id === room.id;

                  return (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      onClick={() => handleRoomSelect(room)}
                      className={`relative bg-[#141720] border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl ${
                        isSelected
                          ? 'border-[#d49e47] ring-2 ring-[#d49e47]/30 shadow-[#d49e47]/10'
                          : 'border-[#262c3b] hover:border-[#384357]'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        
                        {/* Room Photo */}
                        <div className="sm:col-span-5 relative h-48 sm:h-full overflow-hidden bg-[#0d0f14]">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141720] sm:from-transparent via-transparent to-transparent opacity-60" />

                          {/* AC / Non-AC tag */}
                          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 ${
                            room.isAC
                              ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                              : 'bg-blue-950/90 text-blue-400 border border-blue-500/40'
                          }`}>
                            <Wind className="w-3 h-3" />
                            <span>{room.isAC ? 'Split AC Cooled' : 'Non-AC Budget'}</span>
                          </span>

                          <span className="absolute bottom-3 left-3 text-[10px] text-[#cfd7e5] bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                            {room.floor}
                          </span>
                        </div>

                        {/* Room Details */}
                        <div className="sm:col-span-7 p-5 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#d49e47] tracking-wider block">
                                  {room.categoryLabel}
                                </span>
                                <h3 className="font-serif-title text-lg font-bold text-[#ede8de]">
                                  {room.name}
                                </h3>
                              </div>

                              <div className="text-right">
                                <span className="text-xl font-bold text-[#ede8de]">
                                  ₹{room.pricePerNight}
                                </span>
                                <span className="text-[10px] text-[#818c9e] block">/ night</span>
                              </div>
                            </div>

                            <p className="text-xs text-[#8f9aab] mt-1.5 line-clamp-2">
                              {room.description}
                            </p>

                            <div className="flex items-center space-x-3 text-xs text-[#7d889b] mt-2.5">
                              <span className="flex items-center space-x-1 text-[#ede8de]">
                                <Bed className="w-3.5 h-3.5 text-[#d49e47]" />
                                <span>{room.bedType}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Users className="w-3.5 h-3.5 text-[#d49e47]" />
                                <span>Max {room.capacity} Guests</span>
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {room.amenities.slice(0, 4).map((am, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-[#181c25] border border-[#262c39] px-2 py-0.5 rounded-lg text-[#9da7b8]"
                                >
                                  {am}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#232837] flex items-center justify-between text-xs">
                            <span className="text-[#7e899b]">
                              Rooms: #{room.roomNumbers.join(', #')}
                            </span>

                            <button
                              type="button"
                              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#d49e47] text-[#12141a]'
                                  : 'bg-[#1e2330] text-[#8e98aa] hover:text-[#ede8de]'
                              }`}
                            >
                              {isSelected ? '✓ Selected' : 'Select Room'}
                            </button>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* Right 5 Cols: Reservation Form */}
            <div className="lg:col-span-5 sticky top-24">
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleBookingSubmit}
                className="bg-[#141720] border border-[#2b3342] rounded-3xl p-6 shadow-2xl space-y-5"
              >
                
                {/* Header */}
                <div className="border-b border-[#252c39] pb-4">
                  <span className="text-[10px] uppercase font-bold text-[#d49e47] tracking-wider block">
                    Instant Room Reservation
                  </span>
                  <h3 className="font-serif-title text-xl font-bold text-[#ede8de]">
                    Book {selectedRoom.name}
                  </h3>
                  <div className="text-xs text-[#8e98aa] mt-0.5">
                    Floor: <strong>{selectedRoom.floor}</strong> • Rate: <strong className="text-[#d49e47]">₹{selectedRoom.pricePerNight}</strong>/night
                  </div>
                </div>

                {/* Dates & Guests */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[#848fa1] block mb-1">Check-In Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={checkInDate}
                      onChange={e => setCheckInDate(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                  </div>

                  <div>
                    <label className="text-[#848fa1] block mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      min={checkInDate || todayStr}
                      value={checkOutDate}
                      onChange={e => setCheckOutDate(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                  </div>

                  <div>
                    <label className="text-[#848fa1] block mb-1">Total Guests</label>
                    <select
                      value={guestsCount}
                      onChange={e => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    >
                      <option value={1}>1 Guest (Solo)</option>
                      <option value={2}>2 Guests (Double)</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests (Family)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#848fa1] block mb-1">Room Assignment</label>
                    <select
                      value={selectedRoomNumber}
                      onChange={e => setSelectedRoomNumber(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    >
                      {selectedRoom.roomNumbers.map(rn => (
                        <option key={rn} value={rn}>Room #{rn} ({selectedRoom.floor})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Value Add-ons */}
                <div className="space-y-2 pt-2 border-t border-[#232837]">
                  <span className="text-[11px] uppercase font-bold text-[#8e98aa] tracking-wider block">
                    Optional Stay Enhancements
                  </span>

                  <label className="flex items-center justify-between p-2.5 bg-[#181c25] border border-[#262c39] rounded-xl text-xs cursor-pointer hover:border-[#3d475c] transition-colors">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={extraBed}
                        onChange={e => setExtraBed(e.target.checked)}
                        className="rounded text-[#d49e47] focus:ring-0"
                      />
                      <span className="text-[#ede8de]">Extra Foldable Mattress / Bed</span>
                    </div>
                    <span className="font-semibold text-[#d49e47]">+₹199/night</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-[#181c25] border border-[#262c39] rounded-xl text-xs cursor-pointer hover:border-[#3d475c] transition-colors">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={breakfast}
                        onChange={e => setBreakfast(e.target.checked)}
                        className="rounded text-[#d49e47] focus:ring-0"
                      />
                      <span className="text-[#ede8de]">Bistro Morning Breakfast &amp; Kesar Chai</span>
                    </div>
                    <span className="font-semibold text-[#d49e47]">+₹149/person</span>
                  </label>
                </div>

                {/* Guest Contact Information */}
                <div className="space-y-2.5 pt-2 border-t border-[#232837]">
                  <span className="text-[11px] uppercase font-bold text-[#8e98aa] tracking-wider block">
                    Lead Guest Details
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone (+91)"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div className="space-y-2 pt-2 border-t border-[#232837]">
                  <span className="text-[11px] uppercase font-bold text-[#8e98aa] tracking-wider block">
                    Payment Choice
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentOption('pay_now')}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                        paymentOption === 'pay_now'
                          ? 'bg-[#d49e47]/20 border-[#d49e47] text-[#ede8de]'
                          : 'bg-[#181c25] border-[#262c39] text-[#7d8798]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#d49e47]" />
                      <span>Prepaid UPI / Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentOption('pay_at_checkin')}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                        paymentOption === 'pay_at_checkin'
                          ? 'bg-[#d49e47]/20 border-[#d49e47] text-[#ede8de]'
                          : 'bg-[#181c25] border-[#262c39] text-[#7d8798]'
                      }`}
                    >
                      <Banknote className="w-4 h-4 mx-auto mb-1 text-[#d49e47]" />
                      <span>Pay at Check-In</span>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-[#232837] space-y-1.5 text-xs text-[#8a95a6]">
                  <div className="flex justify-between">
                    <span>Room ({nightsCount} nights @ ₹{selectedRoom.pricePerNight})</span>
                    <span className="text-[#ede8de]">₹{baseRoomTotal}</span>
                  </div>
                  {extraBed && (
                    <div className="flex justify-between">
                      <span>Extra Mattress</span>
                      <span className="text-[#ede8de]">₹{extraBedTotal}</span>
                    </div>
                  )}
                  {breakfast && (
                    <div className="flex justify-between">
                      <span>Bistro Breakfast Buffet</span>
                      <span className="text-[#ede8de]">₹{breakfastTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[#232837] font-bold text-sm text-[#ede8de]">
                    <span>Total Stay Amount</span>
                    <span className="text-[#d49e47] text-lg">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-sm transition-all shadow-xl shadow-[#d49e47]/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Stay...</span>
                  ) : (
                    <>
                      <span>Confirm Reservation (₹{totalAmount})</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </motion.form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
