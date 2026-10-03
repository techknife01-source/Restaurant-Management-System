import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Clock, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Receipt,
  BedDouble,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, PaymentStatus, OrderRecord } from '../types/restaurant';
import { createOrderInFirestore } from '../services/restaurantService';
import { fireSuccessConfetti } from '../utils/confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const {
    cart,
    orderType,
    tableNumber,
    deliveryAddress,
    subtotal,
    tax,
    serviceCharge,
    tipAmount,
    totalAmount,
    couponCode,
    appliedDiscount,
    clearCart
  } = useCart();
  const { currentUser } = useAuth();

  const [customerName, setCustomerName] = useState(currentUser?.displayName || 'Distinguished Guest');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'guest@saffronthyme.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_now_upi');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const now = new Date();
    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const billNumber = `ST-IN-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isPrepaid = paymentMethod === 'pay_now_card' || paymentMethod === 'pay_now_upi';
    const paymentStatus: PaymentStatus = isPrepaid ? 'paid' : paymentMethod === 'postpaid_cash' ? 'pending' : 'pay_at_counter';

    const newOrder: OrderRecord = {
      id: orderId,
      billNumber,
      userId: currentUser?.uid || 'guest',
      customerName: customerName.trim() || 'Guest Diner',
      customerEmail: customerEmail.trim() || 'guest@saffronthyme.com',
      customerPhone: customerPhone.trim() || '+91 98765 43210',
      orderType,
      tableNumber: (orderType === 'dine_in' || orderType === 'room_service') ? tableNumber : undefined,
      deliveryAddress: (orderType !== 'dine_in' && orderType !== 'room_service') ? deliveryAddress : undefined,
      items: cart,
      subtotal,
      tax,
      serviceCharge,
      discount: subtotal * appliedDiscount,
      tip: tipAmount,
      couponCode: couponCode || undefined,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: 'placed',
      estimatedMinutes: orderType === 'room_service' ? 20 : orderType === 'dine_in' ? 18 : 30,
      specialInstructions: specialInstructions.trim() || undefined,
      createdAt: now.toISOString()
    };

    try {
      await createOrderInFirestore(newOrder);
      fireSuccessConfetti();
      setConfirmedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      setConfirmedOrder(newOrder);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (confirmedOrder) {
      onOrderCompleted(confirmedOrder);
    }
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-[#141720] border border-[#2b3342] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252b39] flex items-center justify-between bg-[#11131a]">
          <div className="flex items-center space-x-2.5">
            <Receipt className="w-5 h-5 text-[#d49e47]" />
            <h3 className="font-serif-title text-xl font-bold text-[#ede8de]">
              {confirmedOrder ? 'Order Confirmation & Bill' : 'Confirm Order & Settlement'}
            </h3>
          </div>
          <button
            onClick={confirmedOrder ? handleFinish : onClose}
            className="w-8 h-8 rounded-lg bg-[#191c26] text-[#8e98aa] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {confirmedOrder ? (
            /* Confirmation Pass */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center py-4 bg-[#181c25] border border-emerald-500/30 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif-title text-2xl font-bold text-[#ede8de]">
                  Order Placed Successfully!
                </h4>
                <p className="text-xs text-[#95a0b2] mt-1">
                  The kitchen hearth has started preparing your order.
                </p>
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-[#d49e47]/15 text-[#d49e47] text-xs font-semibold border border-[#d49e47]/30">
                  Bill #{confirmedOrder.billNumber}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-[#181c25] border border-[#272e3d] rounded-xl p-4 text-xs space-y-3">
                <div className="flex justify-between border-b border-[#242a38] pb-2">
                  <span className="text-[#8792a5]">Service Type:</span>
                  <span className="font-bold text-[#ede8de] uppercase">
                    {confirmedOrder.orderType.replace('_', ' ')}
                  </span>
                </div>
                {confirmedOrder.tableNumber && (
                  <div className="flex justify-between border-b border-[#242a38] pb-2">
                    <span className="text-[#8792a5]">Target Location:</span>
                    <span className="font-bold text-[#d49e47]">
                      {confirmedOrder.tableNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b border-[#242a38] pb-2">
                  <span className="text-[#8792a5]">Estimated Preparation:</span>
                  <span className="font-bold text-[#ede8de] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#d49e47]" />
                    <span>~{confirmedOrder.estimatedMinutes} minutes</span>
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#242a38] pb-2">
                  <span className="text-[#8792a5]">Payment Mode:</span>
                  <span className="font-bold text-[#ede8de] uppercase">
                    {confirmedOrder.paymentMethod.replace(/_/g, ' ')} ({confirmedOrder.paymentStatus})
                  </span>
                </div>

                {/* Items */}
                <div className="pt-2">
                  <div className="font-semibold text-[#8792a5] mb-2 uppercase text-[10px] tracking-wider">
                    Ordered Dishes
                  </div>
                  <div className="space-y-1.5">
                    {confirmedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[#d3d9e4]">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-medium">₹{(it.price * it.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grand Total in INR */}
                <div className="pt-3 border-t border-[#242a38] flex justify-between font-bold text-sm text-[#ede8de]">
                  <span>Total Amount</span>
                  <span className="text-[#d49e47] text-base">₹{confirmedOrder.totalAmount.toFixed(0)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Track Live Order in My Hub</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d49e47] flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Guest Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-[#8e98aa] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#8e98aa] block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#8e98aa] block mb-1">Mobile (+91)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                    />
                  </div>
                </div>
              </div>

              {/* Service Destination */}
              <div className="bg-[#181c25] border border-[#282f3d] rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8892a4] font-medium">Service Requested:</span>
                  <span className="font-bold text-[#ede8de] uppercase">
                    {orderType.replace('_', ' ')}
                  </span>
                </div>
                {(orderType === 'dine_in' || orderType === 'room_service') ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[#8892a4]">Service Destination:</span>
                    <span className="font-semibold text-[#d49e47]">{tableNumber}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[#8892a4]">Delivery Address:</span>
                    <span className="font-semibold text-[#ede8de]">{deliveryAddress}</span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d49e47] flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Prepaid &amp; Postpaid Settlement</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Instant UPI (GPay / PhonePe / Paytm) */}
                  <div
                    onClick={() => setPaymentMethod('pay_now_upi')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'pay_now_upi'
                        ? 'bg-[#d49e47]/15 border-[#d49e47] text-[#ede8de]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8c96a7] hover:border-[#3a4457]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1.5 text-[#ede8de]">
                        <QrCode className="w-4 h-4 text-[#d49e47]" />
                        <span>Instant UPI QR</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400">
                        GPay / PhonePe
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8691a2]">One-click scan with any UPI app</p>
                  </div>

                  {/* Option 2: Card (Prepaid) */}
                  <div
                    onClick={() => setPaymentMethod('pay_now_card')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'pay_now_card'
                        ? 'bg-[#d49e47]/15 border-[#d49e47] text-[#ede8de]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8c96a7] hover:border-[#3a4457]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1.5 text-[#ede8de]">
                        <CreditCard className="w-4 h-4 text-[#d49e47]" />
                        <span>Credit / Debit Card</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#d49e47]/20 text-[#d49e47]">
                        Visa / Rupay
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8691a2]">Pay securely via card</p>
                  </div>

                  {/* Option 3: Postpaid Cash on Delivery / Parcel */}
                  <div
                    onClick={() => setPaymentMethod('postpaid_cash')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'postpaid_cash'
                        ? 'bg-[#d49e47]/15 border-[#d49e47] text-[#ede8de]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8c96a7] hover:border-[#3a4457]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1.5 text-[#ede8de]">
                        <Banknote className="w-4 h-4 text-[#d49e47]" />
                        <span>Cash on Delivery / Room</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#202534] text-[#8e98aa]">
                        Postpaid
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8691a2]">Hand cash upon parcel delivery or room delivery</p>
                  </div>

                  {/* Option 4: Pay at Table / Counter */}
                  <div
                    onClick={() => setPaymentMethod('pay_at_counter')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'pay_at_counter'
                        ? 'bg-[#d49e47]/15 border-[#d49e47] text-[#ede8de]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8c96a7] hover:border-[#3a4457]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center space-x-1.5 text-[#ede8de]">
                        <Receipt className="w-4 h-4 text-[#d49e47]" />
                        <span>Pay at Counter / Table</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#202534] text-[#8e98aa]">
                        Dine-In
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8691a2]">Server brings printed physical bill after dining</p>
                  </div>
                </div>

                {/* Sub-preview for UPI / QR */}
                {paymentMethod === 'pay_now_upi' && (
                  <div className="bg-[#181c25] border border-[#2b3342] rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-[#141720] rounded flex flex-col items-center justify-center text-[8px] text-[#d49e47] font-mono text-center">
                        <QrCode className="w-8 h-8 text-[#d49e47]" />
                        <span>UPI SCAN</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#95a0b2] space-y-1">
                      <div className="font-semibold text-[#ede8de]">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </div>
                      <div>UPI ID: <strong className="text-[#ede8de]">saffronthyme@upi</strong></div>
                      <div className="text-[#d49e47] font-bold text-sm">Pay: ₹{totalAmount.toFixed(0)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div>
                <label className="text-[11px] text-[#8e98aa] block mb-1">
                  Delivery or Kitchen Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ring room doorbell twice, extra cutlery set..."
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#181c25] border border-[#2b3342] rounded-xl px-3 py-2 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                />
              </div>

              {/* Total & Submit */}
              <div className="pt-4 border-t border-[#252b39] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8892a4]">Amount Payable</div>
                  <div className="text-2xl font-bold text-[#d49e47]">
                    ₹{totalAmount.toFixed(0)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3.5 px-8 rounded-xl bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] font-bold text-sm transition-all shadow-xl shadow-[#d49e47]/20 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Ticket...</span>
                  ) : (
                    <>
                      <span>Place Order Ticket</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
