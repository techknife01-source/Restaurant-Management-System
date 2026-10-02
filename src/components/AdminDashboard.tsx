import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Flame, 
  Calendar, 
  BedDouble,
  CheckCircle2, 
  Printer, 
  Sliders, 
  Receipt,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderRecord, ReservationRecord, RoomBookingRecord, OrderStatus, MenuItem } from '../types/restaurant';
import { 
  subscribeToUserOrders, 
  subscribeToUserReservations, 
  subscribeToUserRoomBookings,
  updateOrderStatus, 
  updateReservationStatus,
  updateRoomBookingStatus
} from '../services/restaurantService';
import { BillInvoiceModal } from './BillInvoiceModal';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  onToggleMenuItemAvailability: (dishId: string) => void;
  onBackToHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  menuItems,
  onToggleMenuItemAvailability,
  onBackToHome
}) => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'kds' | 'rooms' | 'reservations' | 'bills' | 'menu'>('kds');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBookingRecord[]>([]);
  const [kdsFilter, setKdsFilter] = useState<'all' | 'dine_in' | 'room_service' | 'takeaway_parcel'>('all');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<OrderRecord | null>(null);

  useEffect(() => {
    const unsubOrders = subscribeToUserOrders(
      currentUser?.uid || 'guest',
      true,
      (data) => setOrders(data)
    );

    const unsubRes = subscribeToUserReservations(
      currentUser?.uid || 'guest',
      true,
      (data) => setReservations(data)
    );

    const unsubRooms = subscribeToUserRoomBookings(
      currentUser?.uid || 'guest',
      true,
      (data) => setRoomBookings(data)
    );

    return () => {
      unsubOrders();
      unsubRes();
      unsubRooms();
    };
  }, [currentUser]);

  // Operational metrics in INR
  const totalFoodRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalRoomRevenue = roomBookings.reduce((sum, r) => sum + (r.status !== 'cancelled' ? r.totalAmount : 0), 0);
  const combinedGrossRevenue = totalFoodRevenue + totalRoomRevenue;
  const activeOrdersCount = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'kitchen_preparing' || o.orderStatus === 'ready_to_serve').length;
  const activeRoomsCount = roomBookings.filter(r => r.status === 'confirmed' || r.status === 'checked_in').length;

  const kdsOrders = orders.filter(o => {
    if (kdsFilter === 'dine_in') return o.orderType === 'dine_in';
    if (kdsFilter === 'room_service') return o.orderType === 'room_service';
    if (kdsFilter === 'takeaway_parcel') return o.orderType === 'takeaway_parcel' || o.orderType === 'home_delivery';
    return true;
  });

  const handleAdvanceOrderStatus = async (order: OrderRecord) => {
    let nextStatus: OrderStatus = 'kitchen_preparing';
    if (order.orderStatus === 'placed') nextStatus = 'kitchen_preparing';
    else if (order.orderStatus === 'kitchen_preparing') nextStatus = 'ready_to_serve';
    else if (order.orderStatus === 'ready_to_serve') nextStatus = 'completed';

    try {
      await updateOrderStatus(order.id, nextStatus);
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Cancel this kitchen order ticket?')) {
      try {
        await updateOrderStatus(orderId, 'cancelled');
      } catch (err) {
        console.error('Cancel order error:', err);
      }
    }
  };

  const handleUpdateResStatus = async (resId: string, status: 'seated' | 'completed' | 'cancelled') => {
    try {
      await updateReservationStatus(resId, status);
    } catch (err) {
      console.error('Reservation update error:', err);
    }
  };

  const handleUpdateRoomStatus = async (roomId: string, status: 'checked_in' | 'completed' | 'cancelled') => {
    try {
      await updateRoomBookingStatus(roomId, status);
    } catch (err) {
      console.error('Room status error:', err);
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
            <span>← Back to Home Page</span>
          </button>
        )}

        {/* Top Operational Bar */}
        <div className="bg-[#141720] border border-[#272e3d] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs uppercase tracking-widest font-semibold">
              <ChefHat className="w-4 h-4" />
              <span>Bistro &amp; Hotel Management Console</span>
            </div>
            <h1 className="font-serif-title text-3xl font-bold text-[#ede8de]">
              Saffron &amp; Thyme Operations
            </h1>
            <p className="text-xs text-[#8a94a6]">
              Authorized Manager: <strong className="text-[#ede8de]">{currentUser?.email || 'kazi18296@gmail.com'}</strong>
            </p>
          </div>

          {/* Quick Metrics in INR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#181c25] border border-[#2b3343] p-3.5 rounded-2xl">
              <span className="text-[10px] text-[#8590a3] uppercase font-bold tracking-wider block">Combined Gross</span>
              <span className="text-xl font-bold text-[#d49e47]">₹{combinedGrossRevenue.toFixed(0)}</span>
            </div>
            <div className="bg-[#181c25] border border-[#2b3343] p-3.5 rounded-2xl">
              <span className="text-[10px] text-[#8590a3] uppercase font-bold tracking-wider block">Kitchen Tickets</span>
              <span className="text-xl font-bold text-amber-400">{activeOrdersCount}</span>
            </div>
            <div className="bg-[#181c25] border border-[#2b3343] p-3.5 rounded-2xl">
              <span className="text-[10px] text-[#8590a3] uppercase font-bold tracking-wider block">Active Room Stays</span>
              <span className="text-xl font-bold text-emerald-400">{activeRoomsCount}</span>
            </div>
            <div className="bg-[#181c25] border border-[#2b3343] p-3.5 rounded-2xl">
              <span className="text-[10px] text-[#8590a3] uppercase font-bold tracking-wider block">Table Bookings</span>
              <span className="text-xl font-bold text-blue-400">{reservations.length}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#232837] pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('kds')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'kds'
                ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20'
                : 'bg-[#151821] text-[#8a94a6] hover:text-[#ede8de]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Kitchen Display (KDS)</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'rooms'
                ? 'bg-emerald-500 text-[#12141a] font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-[#151821] text-[#8a94a6] hover:text-emerald-400'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Room Stays ({roomBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'reservations'
                ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20'
                : 'bg-[#151821] text-[#8a94a6] hover:text-[#ede8de]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Floor Bookings ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'bills'
                ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20'
                : 'bg-[#151821] text-[#8a94a6] hover:text-[#ede8de]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Invoices &amp; GST Archive</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#d49e47] text-[#12141a] shadow-lg shadow-[#d49e47]/20'
                : 'bg-[#151821] text-[#8a94a6] hover:text-[#ede8de]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Menu Item Stock</span>
          </button>
        </div>

        {/* Tab 1: KDS */}
        {activeTab === 'kds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-[#141720] p-1 rounded-xl border border-[#242a38]">
                <button
                  onClick={() => setKdsFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    kdsFilter === 'all' ? 'bg-[#d49e47] text-[#12141a]' : 'text-[#8792a4]'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setKdsFilter('room_service')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    kdsFilter === 'room_service' ? 'bg-emerald-500 text-[#12141a]' : 'text-[#8792a4]'
                  }`}
                >
                  Room Service
                </button>
                <button
                  onClick={() => setKdsFilter('dine_in')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    kdsFilter === 'dine_in' ? 'bg-[#d49e47] text-[#12141a]' : 'text-[#8792a4]'
                  }`}
                >
                  Dine-In
                </button>
                <button
                  onClick={() => setKdsFilter('takeaway_parcel')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    kdsFilter === 'takeaway_parcel' ? 'bg-[#d49e47] text-[#12141a]' : 'text-[#8792a4]'
                  }`}
                >
                  Parcel
                </button>
              </div>

              <span className="text-xs text-[#7e899b]">
                Real-time Firebase listener active
              </span>
            </div>

            {kdsOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#141720] border border-[#232937] rounded-3xl">
                <ChefHat className="w-12 h-12 text-[#353d4e] mx-auto mb-2" />
                <h3 className="font-serif-title text-xl text-[#ede8de]">No active kitchen tickets</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {kdsOrders.map(order => {
                  const isPlaced = order.orderStatus === 'placed';
                  const isPreparing = order.orderStatus === 'kitchen_preparing';
                  const isReady = order.orderStatus === 'ready_to_serve';
                  const isDone = order.orderStatus === 'completed' || order.orderStatus === 'served_or_dispatched';
                  const isCancelled = order.orderStatus === 'cancelled';

                  return (
                    <div
                      key={order.id}
                      className={`bg-[#141720] border rounded-2xl p-5 shadow-lg flex flex-col justify-between ${
                        isPlaced
                          ? 'border-amber-500/50 shadow-amber-500/5'
                          : isPreparing
                          ? 'border-[#d49e47] shadow-[#d49e47]/10'
                          : isReady
                          ? 'border-blue-500/50 shadow-blue-500/5'
                          : 'border-[#252b38]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-[#242a38] pb-3 mb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-[#ede8de]">
                                Bill #{order.billNumber}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1e2330] text-[#a0a9b8]">
                                {order.orderType.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7d889b] mt-0.5">
                              {order.customerName} {order.tableNumber ? `• ${order.tableNumber}` : ''}
                            </p>
                          </div>

                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isPlaced
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                              : isPreparing
                              ? 'bg-[#d49e47]/20 text-[#d49e47] border border-[#d49e47]/40'
                              : isReady
                              ? 'bg-blue-950/80 text-blue-400 border border-blue-500/40'
                              : isDone
                              ? 'bg-emerald-950/80 text-emerald-400'
                              : 'bg-red-950/80 text-red-400'
                          }`}>
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {order.specialInstructions && (
                          <div className="mb-3 p-2 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                            <strong>Note: </strong> {order.specialInstructions}
                          </div>
                        )}

                        <div className="space-y-2 text-xs divide-y divide-[#1e2431]">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="pt-1.5 first:pt-0">
                              <div className="flex justify-between font-semibold text-[#ede8de]">
                                <span>{it.quantity}x {it.name}</span>
                                <span>₹{(it.price * it.quantity).toFixed(0)}</span>
                              </div>
                              {it.selectedAddOns && it.selectedAddOns.length > 0 && (
                                <div className="text-[10px] text-[#7d8798]">
                                  + {it.selectedAddOns.map(a => a.label).join(', ')}
                                </div>
                              )}
                              {it.spiceLevel && (
                                <div className="text-[10px] text-[#d49e47]">
                                  Spice: {it.spiceLevel}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#242a38] flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedOrderForBill(order)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#1c202a] hover:bg-[#252b38] text-[11px] font-semibold text-[#9ba4b6] flex items-center space-x-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Bill</span>
                        </button>

                        <div className="flex items-center space-x-1.5">
                          {!isDone && !isCancelled && (
                            <button
                              onClick={() => handleAdvanceOrderStatus(order)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-xs transition-colors shadow cursor-pointer"
                            >
                              {isPlaced && 'Tandoor / Fire →'}
                              {isPreparing && 'Mark Plated →'}
                              {isReady && 'Deliver ✓'}
                            </button>
                          )}
                          {!isDone && !isCancelled && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="p-1.5 text-xs text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Hotel Room Stays */}
        {activeTab === 'rooms' && (
          <div className="bg-[#141720] border border-[#272e3d] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#242a38] flex items-center justify-between">
              <div>
                <h3 className="font-serif-title font-semibold text-base text-[#ede8de]">
                  Guest Rooms &amp; Inn Stays
                </h3>
                <p className="text-xs text-[#8792a4]">Non-AC (₹499–₹599) &amp; AC (₹799–₹999) occupancy management</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8792a4]">Stay Revenue: </span>
                <strong className="text-sm font-bold text-emerald-400">₹{totalRoomRevenue}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#171a24] text-[#858f9f] uppercase text-[10px] tracking-wider border-b border-[#242a38]">
                  <tr>
                    <th className="p-3.5">Ref / Room</th>
                    <th className="p-3.5">Lead Guest</th>
                    <th className="p-3.5">Dates</th>
                    <th className="p-3.5">Stay Type</th>
                    <th className="p-3.5">Total (₹)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222837]">
                  {roomBookings.map(rb => (
                    <tr key={rb.id} className="hover:bg-[#181c26] transition-colors">
                      <td className="p-3.5">
                        <strong className="text-sm text-[#d49e47] block">Room #{rb.roomNumber}</strong>
                        <span className="text-[#7d8798]">{rb.bookingNumber}</span>
                      </td>
                      <td className="p-3.5">
                        <strong className="text-[#ede8de] block">{rb.guestName}</strong>
                        <span className="text-[#7d8798]">{rb.guestPhone}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-[#ede8de]">{rb.checkInDate} &rarr; {rb.checkOutDate}</div>
                        <div className="text-[#8e98aa]">{rb.nightsCount} Nights ({rb.guestsCount} Guests)</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-[#ede8de] block">{rb.roomName}</span>
                        <span className="text-[10px] text-emerald-400">{rb.paymentMethod}</span>
                      </td>
                      <td className="p-3.5 font-bold text-sm text-[#d49e47]">
                        ₹{rb.totalAmount}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rb.status === 'confirmed'
                            ? 'bg-blue-950/60 text-blue-400'
                            : rb.status === 'checked_in'
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : 'bg-[#222735] text-[#858f9f]'
                        }`}>
                          {rb.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {rb.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateRoomStatus(rb.id, 'checked_in')}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            Check In
                          </button>
                        )}
                        {rb.status === 'checked_in' && (
                          <button
                            onClick={() => handleUpdateRoomStatus(rb.id, 'completed')}
                            className="px-2.5 py-1 rounded bg-[#d49e47] text-[#12141a] font-bold cursor-pointer"
                          >
                            Check Out
                          </button>
                        )}
                        {rb.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateRoomStatus(rb.id, 'cancelled')}
                            className="px-2 py-1 text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Table Reservations */}
        {activeTab === 'reservations' && (
          <div className="bg-[#141720] border border-[#272e3d] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#242a38] flex items-center justify-between">
              <h3 className="font-serif-title font-semibold text-base text-[#ede8de]">
                Diner Reservations Schedule
              </h3>
              <span className="text-xs text-[#8792a4]">
                Total: {reservations.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#171a24] text-[#858f9f] uppercase text-[10px] tracking-wider border-b border-[#242a38]">
                  <tr>
                    <th className="p-3.5">Guest</th>
                    <th className="p-3.5">Date &amp; Time</th>
                    <th className="p-3.5">Party</th>
                    <th className="p-3.5">Atmosphere &amp; Table</th>
                    <th className="p-3.5">Occasion</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222837]">
                  {reservations.map(res => (
                    <tr key={res.id} className="hover:bg-[#181c26] transition-colors">
                      <td className="p-3.5">
                        <strong className="text-sm text-[#ede8de] block">{res.customerName}</strong>
                        <span className="text-[#7d8798]">{res.customerPhone}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#ede8de]">{res.bookingDate}</div>
                        <div className="text-[#d49e47]">{res.timeSlot}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#ede8de]">{res.guestsCount} Diners</span>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize block text-[#ede8de]">{res.seatingZone.replace('_', ' ')}</span>
                        <span className="text-[#8e98aa]">{res.tableNumber}</span>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <span className="capitalize font-semibold text-[#d49e47] block">{res.occasion}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : res.status === 'seated'
                            ? 'bg-[#d49e47]/20 text-[#d49e47]'
                            : 'bg-[#222735] text-[#858f9f]'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'seated')}
                            className="px-2.5 py-1 rounded bg-[#d49e47] text-[#12141a] font-bold hover:bg-[#c28d38] cursor-pointer"
                          >
                            Seat
                          </button>
                        )}
                        {res.status === 'seated' && (
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'completed')}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            Finish
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateResStatus(res.id, 'cancelled')}
                            className="px-2 py-1 text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Bills & GST Invoices */}
        {activeTab === 'bills' && (
          <div className="bg-[#141720] border border-[#272e3d] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#242a38] flex items-center justify-between">
              <div>
                <h3 className="font-serif-title font-semibold text-base text-[#ede8de]">
                  Tax Invoices &amp; Hospitality Register
                </h3>
                <p className="text-xs text-[#8792a4]">GSTIN: 07AAAAA0000A1Z5</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8792a4]">Food Sales: </span>
                <strong className="text-sm font-bold text-[#d49e47]">₹{totalFoodRevenue.toFixed(0)}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#171a24] text-[#858f9f] uppercase text-[10px] tracking-wider border-b border-[#242a38]">
                  <tr>
                    <th className="p-3.5">Bill Number</th>
                    <th className="p-3.5">Guest &amp; Contact</th>
                    <th className="p-3.5">Service Type</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Payment Method</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5 text-right">Invoice Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222837]">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-[#181c26] transition-colors">
                      <td className="p-3.5 font-bold text-[#ede8de]">
                        #{order.billNumber}
                      </td>
                      <td className="p-3.5">
                        <strong className="text-[#ede8de] block">{order.customerName}</strong>
                        <span className="text-[#7d8798]">{order.customerPhone}</span>
                      </td>
                      <td className="p-3.5 uppercase font-medium text-[#a0a9b8]">
                        {order.orderType.replace('_', ' ')}
                      </td>
                      <td className="p-3.5">
                        {order.items.reduce((s, it) => s + it.quantity, 0)} items
                      </td>
                      <td className="p-3.5 uppercase text-[#a0a9b8]">
                        {order.paymentMethod.replace(/_/g, ' ')}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : 'bg-amber-950/60 text-amber-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-sm text-[#d49e47]">
                        ₹{order.totalAmount.toFixed(0)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrderForBill(order)}
                          className="px-3 py-1.5 rounded-lg bg-[#1c202a] hover:bg-[#252b38] text-xs font-semibold text-[#ede8de] border border-[#2b3343] inline-flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#d49e47]" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Menu Stock */}
        {activeTab === 'menu' && (
          <div className="bg-[#141720] border border-[#272e3d] rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-serif-title font-semibold text-lg text-[#ede8de]">
                Menu Inventory &amp; 86'd Dishes
              </h3>
              <p className="text-xs text-[#8792a4]">
                Instantly toggle dishes in or out of stock based on kitchen inventory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {menuItems.map(dish => (
                <div
                  key={dish.id}
                  className="bg-[#181c25] border border-[#262c3b] rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#0d0f14] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-[#ede8de] truncate">{dish.name}</div>
                      <div className="text-[11px] text-[#d49e47]">₹{dish.price}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleMenuItemAvailability(dish.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      dish.available
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-950/60 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {dish.available ? 'In Stock' : '86’d (Out)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <BillInvoiceModal
        order={selectedOrderForBill}
        onClose={() => setSelectedOrderForBill(null)}
      />
    </div>
  );
};
