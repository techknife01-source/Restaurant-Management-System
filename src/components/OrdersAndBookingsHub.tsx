import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Calendar, 
  Clock, 
  Printer, 
  CheckCircle2, 
  BedDouble, 
  UtensilsCrossed, 
  LogIn, 
  Sparkles,
  ChevronRight,
  Wind
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderRecord, ReservationRecord, RoomBookingRecord, OrderStatus } from '../types/restaurant';
import { 
  subscribeToUserOrders, 
  subscribeToUserReservations, 
  subscribeToUserRoomBookings,
  updateOrderStatus, 
  updateReservationStatus,
  updateRoomBookingStatus
} from '../services/restaurantService';
import { BillInvoiceModal } from './BillInvoiceModal';

interface OrdersAndBookingsHubProps {
  onNavigateToMenu: () => void;
  onNavigateToBooking: () => void;
  onNavigateToRooms?: () => void;
  onBackToHome?: () => void;
}

export const OrdersAndBookingsHub: React.FC<OrdersAndBookingsHubProps> = ({
  onNavigateToMenu,
  onNavigateToBooking,
  onNavigateToRooms,
  onBackToHome
}) => {
  const { currentUser, loginWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'rooms'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBookingRecord[]>([]);
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<OrderRecord | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    const userId = currentUser?.uid || 'guest';

    const unsubOrders = subscribeToUserOrders(
      userId,
      false,
      (data) => setOrders(data)
    );

    const unsubRes = subscribeToUserReservations(
      userId,
      false,
      (data) => setReservations(data)
    );

    const unsubRooms = subscribeToUserRoomBookings(
      userId,
      false,
      (data) => setRoomBookings(data)
    );

    return () => {
      unsubOrders();
      unsubRes();
      unsubRooms();
    };
  }, [currentUser]);

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Are you sure you wish to cancel this dining order?')) {
      try {
        await updateOrderStatus(orderId, 'cancelled');
      } catch (err) {
        console.error('Cancel order error:', err);
      }
    }
  };

  const handleCancelReservation = async (resId: string) => {
    if (confirm('Are you sure you wish to cancel this table reservation?')) {
      try {
        await updateReservationStatus(resId, 'cancelled');
      } catch (err) {
        console.error('Cancel reservation error:', err);
      }
    }
  };

  const handleCancelRoom = async (roomId: string) => {
    if (confirm('Cancel this room reservation?')) {
      try {
        await updateRoomBookingStatus(roomId, 'cancelled');
      } catch (err) {
        console.error('Cancel room booking error:', err);
      }
    }
  };

  const getOrderStatusProgress = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Order Queued', color: 'text-amber-400', progress: '25%' };
      case 'kitchen_preparing':
        return { label: 'Tandoor & Hearth Cooking', color: 'text-[#d49e47]', progress: '55%' };
      case 'ready_to_serve':
        return { label: 'Plated & Ready to Deliver', color: 'text-blue-400', progress: '85%' };
      case 'served_or_dispatched':
      case 'completed':
        return { label: 'Delivered / Completed', color: 'text-emerald-400', progress: '100%' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-red-400', progress: '0%' };
      default:
        return { label: 'Processing', color: 'text-[#d49e47]', progress: '30%' };
    }
  };

  return (
    <div className="py-12 bg-[#0f1115] text-[#ede8de] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Back Option */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8a95a8] hover:text-[#d49e47] bg-[#141720] border border-[#272e3d] px-3.5 py-2 rounded-xl transition-all hover:-translate-x-1 cursor-pointer"
          >
            <span>← Back to Home Page</span>
          </button>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#d49e47] text-xs uppercase tracking-widest font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Diner &amp; Hotel Stay Portal</span>
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#ede8de]">
              My Orders, Bookings &amp; Stays
            </h1>
            <p className="text-xs sm:text-sm text-[#8c97aa] mt-1">
              Live kitchen tracking, room passes, and printable Indian tax invoices.
            </p>
          </div>

          {!currentUser && (
            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1b1f2a] border border-[#2f3747] hover:border-[#d49e47] text-xs text-[#ede8de] transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#d49e47]" />
              <span>Sign in with Google to sync all devices</span>
            </button>
          )}
        </div>

        {/* Tab Switcher (3 Tabs: Orders, Table Bookings, Room Stays) */}
        <div className="flex items-center space-x-3 border-b border-[#222735] pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20'
                : 'bg-[#151821] text-[#8e98aa] border border-[#252b38] hover:text-[#ede8de]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Food Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'rooms'
                ? 'bg-emerald-500 text-[#12141a] font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-[#151821] text-[#8e98aa] border border-[#252b38] hover:text-emerald-400'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Room Stays ({roomBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20'
                : 'bg-[#151821] text-[#8e98aa] border border-[#252b38] hover:text-[#ede8de]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#141720] border border-[#232937] rounded-3xl p-8">
                <Receipt className="w-12 h-12 text-[#3c4658] mx-auto mb-3" />
                <h3 className="font-serif-title text-xl text-[#ede8de]">No dining orders yet</h3>
                <p className="text-xs text-[#828d9e] mt-1 max-w-sm mx-auto">
                  Order royal Awadhi Biryani, Butter Chicken, or wood-fired steaks for dine-in or room delivery.
                </p>
                <button
                  onClick={onNavigateToMenu}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Order from Indian &amp; Bistro Menu
                </button>
              </div>
            ) : (
              orders.map(order => {
                const progress = getOrderStatusProgress(order.orderStatus);
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={order.id}
                    className="bg-[#141720] border border-[#262c3b] rounded-2xl p-6 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212634] pb-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-[#ede8de]">
                            Bill #{order.billNumber}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1e2330] text-[#9ba5b6] border border-[#2c3444]">
                            {order.orderType.replace('_', ' ')}
                          </span>
                          {order.tableNumber && (
                            <span className="text-[10px] font-semibold text-[#d49e47] bg-[#d49e47]/15 px-2 py-0.5 rounded">
                              {order.tableNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7f8a9c]">{formattedDate}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-bold uppercase tracking-wider ${progress.color}`}>
                          {progress.label}
                        </span>

                        <button
                          onClick={() => setSelectedOrderForBill(order)}
                          className="px-3 py-1.5 rounded-xl bg-[#1c202a] hover:bg-[#262c3b] text-xs font-semibold text-[#ede8de] border border-[#2d3546] flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#d49e47]" />
                          <span>View Tax Invoice</span>
                        </button>

                        {order.orderStatus === 'placed' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.orderStatus !== 'cancelled' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] text-[#8692a5]">
                          <span>Ticket Placed</span>
                          <span>Tandoor &amp; Hearth Cooking</span>
                          <span>Plated &amp; Ready</span>
                          <span>Served / Delivered</span>
                        </div>
                        <div className="w-full h-2 bg-[#1b1f29] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#b46927] to-[#d49e47] transition-all duration-500 rounded-full"
                            style={{ width: progress.progress }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Ordered Items */}
                    <div className="pt-2 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#9da7b8]">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between bg-[#181c25] p-2 rounded-lg">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-semibold text-[#ede8de]">
                              ₹{(it.price * it.quantity).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total in INR */}
                    <div className="pt-3 border-t border-[#212634] flex items-center justify-between text-xs">
                      <span className="text-[#8490a2]">
                        Payment: <strong className="text-[#ede8de] uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong> ({order.paymentStatus})
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#ede8de]">
                          Total: <span className="text-[#d49e47]">₹{order.totalAmount.toFixed(0)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Room Stays */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            {roomBookings.length === 0 ? (
              <div className="text-center py-16 bg-[#141720] border border-[#232937] rounded-3xl p-8">
                <BedDouble className="w-12 h-12 text-[#3c4658] mx-auto mb-3" />
                <h3 className="font-serif-title text-xl text-[#ede8de]">No room stays reserved yet</h3>
                <p className="text-xs text-[#828d9e] mt-1 max-w-sm mx-auto">
                  Book an affordable room starting from ₹499/night (Non-AC) or ₹799/night (AC) with 24/7 in-room dining.
                </p>
                {onNavigateToRooms && (
                  <button
                    onClick={onNavigateToRooms}
                    className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#12141a] font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    View Rooms (₹499 – ₹999)
                  </button>
                )}
              </div>
            ) : (
              roomBookings.map(rb => (
                <div
                  key={rb.id}
                  className="bg-[#141720] border border-[#262c3b] rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212634] pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-[#ede8de]">
                          {rb.roomName} — Room #{rb.roomNumber}
                        </h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          {rb.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#7f8a9c] mt-0.5">
                        Ref: <code className="text-[#d49e47] font-mono">{rb.bookingNumber}</code>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-xl bg-[#1c202a] text-xs font-semibold text-[#ede8de] border border-[#2b3343] flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#d49e47]" />
                        <span>Print Stay Pass</span>
                      </button>

                      {rb.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelRoom(rb.id)}
                          className="text-xs text-red-400 hover:text-red-300 underline"
                        >
                          Cancel Stay
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[#7f8a9c] block">Check-In</span>
                      <strong className="text-[#ede8de]">{rb.checkInDate} (12 PM)</strong>
                    </div>
                    <div>
                      <span className="text-[#7f8a9c] block">Check-Out</span>
                      <strong className="text-[#ede8de]">{rb.checkOutDate} (11 AM)</strong>
                    </div>
                    <div>
                      <span className="text-[#7f8a9c] block">Stay Duration</span>
                      <strong className="text-[#ede8de]">{rb.nightsCount} Nights ({rb.guestsCount} Guests)</strong>
                    </div>
                    <div>
                      <span className="text-[#7f8a9c] block">Total Amount</span>
                      <strong className="text-base text-[#d49e47]">₹{rb.totalAmount}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#212634]">
                    <span className="text-[#8490a2]">
                      Settlement: <strong className="text-[#ede8de]">{rb.paymentMethod}</strong>
                    </span>
                    <button
                      onClick={onNavigateToMenu}
                      className="text-[#d49e47] font-semibold hover:underline flex items-center space-x-1"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Order Food to Room #{rb.roomNumber}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Table Reservations */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-[#141720] border border-[#232937] rounded-3xl p-8">
                <Calendar className="w-12 h-12 text-[#3c4658] mx-auto mb-3" />
                <h3 className="font-serif-title text-xl text-[#ede8de]">No table reservations booked</h3>
                <p className="text-xs text-[#828d9e] mt-1 max-w-sm mx-auto">
                  Book a table in our Terrace Garden, Wine Cellar, or Grand Hearth Room.
                </p>
                <button
                  onClick={onNavigateToBooking}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Book a Table
                </button>
              </div>
            ) : (
              reservations.map(res => (
                <div
                  key={res.id}
                  className="bg-[#141720] border border-[#262c3b] rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212634] pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-[#ede8de]">
                          Reservation for {res.guestsCount} Guests
                        </h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#222735] text-[#8692a4]'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#7f8a9c] mt-0.5">
                        Pass ID: <code className="text-[#d49e47] font-mono">{res.id}</code>
                      </p>
                    </div>

                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[#7f8a9c] block">Date</span>
                      <strong className="text-[#ede8de]">{res.bookingDate}</strong>
                    </div>
                    <div>
                      <span className="text-[#7f8a9c] block">Time Slot</span>
                      <strong className="text-[#d49e47]">{res.timeSlot}</strong>
                    </div>
                    <div>
                      <span className="text-[#7f8a9c] block">Zone</span>
                      <strong className="text-[#ede8de] capitalize">{res.seatingZone.replace('_', ' ')}</strong>
                    </div>
                    <div>
                      <span className="text-[#7f8a9c] block">Table</span>
                      <strong className="text-[#ede8de]">{res.tableNumber}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Bill Invoice Modal */}
      <BillInvoiceModal
        order={selectedOrderForBill}
        onClose={() => setSelectedOrderForBill(null)}
      />
    </div>
  );
};
