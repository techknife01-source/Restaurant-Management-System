import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  ChevronRight,
  Heart,
  Briefcase,
  Cake,
  GlassWater,
  ArrowLeft
} from 'lucide-react';
import { RESTAURANT_TABLES } from '../data/menuData';
import { SeatingZone, DiningOccasion, ReservationRecord, TableInfo } from '../types/restaurant';
import { createReservationInFirestore } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';
import { fireSuccessConfetti } from '../utils/confetti';
import { VisualFloorPlan } from './VisualFloorPlan';

interface TableBookingModuleProps {
  onBackToHome?: () => void;
  onReservationComplete?: (res: ReservationRecord) => void;
  onNavigateToHub?: () => void;
}

export const TableBookingModule: React.FC<TableBookingModuleProps> = ({
  onBackToHome,
  onReservationComplete,
  onNavigateToHub
}) => {
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('19:30');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [seatingZone, setSeatingZone] = useState<SeatingZone>('main_hall');
  const [selectedTableId, setSelectedTableId] = useState<string>('M-01');
  const [occasion, setOccasion] = useState<DiningOccasion>('date');
  const [specialRequests, setSpecialRequests] = useState<string>('Corner table with floral candlelight.');

  // Diner info
  const [customerName, setCustomerName] = useState(currentUser?.displayName || 'Distinguished Guest');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'guest@saffronthyme.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationRecord | null>(null);

  const occasions: { key: DiningOccasion; label: string; icon: any }[] = [
    { key: 'casual', label: 'Casual Bistro Dining', icon: GlassWater },
    { key: 'date', label: 'Romantic Date Night', icon: Heart },
    { key: 'birthday', label: 'Birthday Celebration', icon: Cake },
    { key: 'anniversary', label: 'Anniversary Dinner', icon: Sparkles },
    { key: 'business', label: 'Executive Dinner', icon: Briefcase },
  ];

  const lunchSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
  const dinnerSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const handleTableSelectedFromFloorPlan = (table: TableInfo) => {
    setSelectedTableId(table.id);
    setSeatingZone(table.zone);
  };

  const handleBookTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const resId = `res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const chosenTable = RESTAURANT_TABLES.find(t => t.id === selectedTableId);

    const newRes: ReservationRecord = {
      id: resId,
      userId: currentUser?.uid || 'guest',
      customerName: customerName.trim() || 'Guest Diner',
      customerEmail: customerEmail.trim() || 'guest@saffronthyme.com',
      customerPhone: customerPhone.trim() || '+91 98765 43210',
      guestsCount,
      bookingDate,
      timeSlot,
      seatingZone,
      tableNumber: chosenTable ? `Table ${chosenTable.label} (${chosenTable.zone.replace('_', ' ')})` : 'Assigned Upon Arrival',
      occasion,
      specialRequests: specialRequests.trim() || undefined,
      status: 'confirmed',
      depositAmount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await createReservationInFirestore(newRes);
      fireSuccessConfetti();
      setConfirmedReservation(newRes);
      if (onReservationComplete) {
        onReservationComplete(newRes);
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setConfirmedReservation(newRes);
      if (onReservationComplete) {
        onReservationComplete(newRes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-[#0f1115] text-[#ede8de] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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

        {/* Module Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-[#d49e47] text-xs uppercase tracking-widest font-semibold mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Interactive Floor Plan &amp; Table Booking</span>
          </div>
          <h1 className="font-serif-title text-4xl sm:text-5xl font-normal text-[#ede8de]">
            Reserve Your Specific Table
          </h1>
          <p className="mt-2 text-sm text-[#9aa4b6]">
            Select your preferred time, date, and click directly on our interactive restaurant floor plan below to choose your seat.
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation Pass */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-[#141720] border border-[#2b3343] rounded-3xl overflow-hidden shadow-2xl space-y-6"
          >
            <div className="bg-gradient-to-r from-[#d49e47] via-[#c48d37] to-[#9c631b] p-6 text-[#12141a] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded">
                  Official Table Reservation Pass
                </span>
                <h2 className="font-serif-title text-2xl font-bold mt-1">
                  Saffron &amp; Thyme Bistro
                </h2>
                <p className="text-xs font-medium text-[#1e170e]">
                  Confirmed Booking Ref: <strong>#{confirmedReservation.id}</strong>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-black/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#12141a]" />
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[#848fa1] block">Guest Name</span>
                  <strong className="text-sm text-[#ede8de]">{confirmedReservation.customerName}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Reservation Date</span>
                  <strong className="text-sm text-[#ede8de]">{confirmedReservation.bookingDate}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Time Slot</span>
                  <strong className="text-sm text-[#d49e47]">{confirmedReservation.timeSlot}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Party Size</span>
                  <strong className="text-sm text-[#ede8de]">{confirmedReservation.guestsCount} Guests</strong>
                </div>
              </div>

              <div className="p-4 bg-[#181c25] rounded-2xl border border-[#262c39] grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#848fa1] block">Atmosphere:</span>
                  <strong className="text-[#ede8de] capitalize">{confirmedReservation.seatingZone.replace('_', ' ')}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Assigned Table:</span>
                  <strong className="text-emerald-400 font-bold">{confirmedReservation.tableNumber}</strong>
                </div>
                <div>
                  <span className="text-[#848fa1] block">Occasion:</span>
                  <strong className="text-[#ede8de] capitalize">{confirmedReservation.occasion}</strong>
                </div>
              </div>

              {confirmedReservation.specialRequests && (
                <div className="bg-[#181c25] p-3 rounded-xl text-xs text-[#8e98aa]">
                  <span className="text-[#adb8cb] font-medium">Notes: </span>
                  <span>"{confirmedReservation.specialRequests}"</span>
                </div>
              )}

              <div className="pt-4 border-t border-dashed border-[#2b3343] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-[#12141a]" />
                  </div>
                  <div className="text-[#8c97a9]">
                    <div>Show this digital pass at the entrance desk</div>
                    <span className="text-[11px] text-[#717c8f]">Table held for 20 mins past seating time</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#323a4b] hover:border-[#d49e47] text-xs font-semibold text-[#ede8de] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#d49e47]" />
                    <span>Print Ticket</span>
                  </button>
                  {onNavigateToHub && (
                    <button
                      onClick={onNavigateToHub}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>View My Hub</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center pb-6">
              <button
                onClick={() => setConfirmedReservation(null)}
                className="text-xs text-[#8e98aa] hover:text-[#ede8de] underline cursor-pointer"
              >
                Make Another Table Reservation
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Booking Flow */
          <form onSubmit={handleBookTable} className="space-y-8">
            
            {/* Step 1: Date, Guests & Time Slots */}
            <div className="bg-[#141720] border border-[#252c39] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#8e98aa] block mb-1.5">Number of Guests</label>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
                    {[1, 2, 3, 4, 6, 8].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          guestsCount === num
                            ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20 scale-105'
                            : 'bg-[#181c25] border border-[#282f3e] text-[#8e98aa] hover:border-[#384357]'
                        }`}
                      >
                        {num}p
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#8e98aa] block mb-1.5">Reservation Date</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full bg-[#181c25] border border-[#282f3e] rounded-xl px-4 py-2.5 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8e98aa] block mb-1.5">Dining Occasion</label>
                  <select
                    value={occasion}
                    onChange={e => setOccasion(e.target.value as any)}
                    className="w-full bg-[#181c25] border border-[#282f3e] rounded-xl px-3 py-2.5 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  >
                    {occasions.map(occ => (
                      <option key={occ.key} value={occ.key}>{occ.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-3 pt-4 border-t border-[#222835]">
                <div className="text-xs text-[#8e98aa]">
                  Select Seating Time ({bookingDate}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...lunchSlots, ...dinnerSlots].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        timeSlot === slot
                          ? 'bg-[#d49e47] text-[#12141a] font-bold border-[#d49e47] shadow'
                          : 'bg-[#181c25] border-[#272e3d] text-[#8e98aa] hover:border-[#384357]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Interactive Visual Floor Plan Component */}
            <VisualFloorPlan
              selectedTableId={selectedTableId}
              onSelectTable={handleTableSelectedFromFloorPlan}
              bookingDate={bookingDate}
              timeSlot={timeSlot}
              guestsCount={guestsCount}
            />

            {/* Step 3: Guest Contact & Submit */}
            <div className="bg-[#141720] border border-[#252c39] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#d49e47]">
                Guest Contact &amp; Confirmation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#8e98aa] block mb-1">Lead Guest Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-[#181c25] border border-[#282f3e] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#8e98aa] block mb-1">Email for Pass</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#181c25] border border-[#282f3e] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#8e98aa] block mb-1">Mobile Phone (+91)</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#181c25] border border-[#282f3e] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#8e98aa] block mb-1">
                  Special Seating Notes or Dietary Requests
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Quiet corner, anniversary cake, wheelchair accessible..."
                  className="w-full bg-[#181c25] border border-[#282f3e] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                />
              </div>

              <div className="pt-4 border-t border-[#222835] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#8792a4]">
                  Selected Table: <strong className="text-[#d49e47]">Table {selectedTableId}</strong> • Free Cancellation
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-sm transition-all shadow-xl shadow-[#d49e47]/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Table...</span>
                  ) : (
                    <>
                      <span>Confirm Table Reservation</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
