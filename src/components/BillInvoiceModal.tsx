import React from 'react';
import { X, Printer, Receipt } from 'lucide-react';
import { OrderRecord } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/menuData';

interface BillInvoiceModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const BillInvoiceModal: React.FC<BillInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-[#ffffff] text-[#12141a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Action Bar (No Print) */}
        <div className="no-print p-4 bg-[#141720] text-[#ede8de] flex items-center justify-between border-b border-[#242b38]">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-[#d49e47]" />
            <span className="font-serif-title font-semibold text-sm">Official Tax Invoice (GST)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#d49e47] hover:bg-[#c28d38] text-[#12141a] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-[#222835] hover:bg-[#2e3748] text-[#8e98aa] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 overflow-y-auto font-mono text-xs leading-relaxed space-y-5 bg-[#ffffff] text-[#1a1b1e]">
          
          {/* Restaurant Header */}
          <div className="text-center space-y-1 pb-4 border-b border-dashed border-[#a0a8b4]">
            <h2 className="font-serif text-2xl font-bold tracking-wider uppercase text-[#1a1309]">
              Saffron &amp; Thyme
            </h2>
            <p className="text-[11px] text-[#555d6b] tracking-wider uppercase font-sans">
              Artisanal Bistro, Royal Tandoor &amp; Boutique Stay
            </p>
            <p className="text-[10px] text-[#6b7280]">
              {RESTAURANT_INFO.address}
            </p>
            <p className="text-[10px] text-[#6b7280]">
              Tel: {RESTAURANT_INFO.phone} • GSTIN: {RESTAURANT_INFO.gstin}
            </p>
            <p className="text-[10px] text-[#6b7280]">
              FSSAI Lic No: {RESTAURANT_INFO.fssai}
            </p>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-dashed border-[#a0a8b4]">
            <div>
              <span className="text-[#6b7280] block">BILL NUMBER:</span>
              <strong className="text-sm font-bold text-[#111827]">{order.billNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#6b7280] block">DATE &amp; TIME:</span>
              <strong>{formattedDate}</strong>
            </div>
            <div>
              <span className="text-[#6b7280] block">GUEST:</span>
              <strong>{order.customerName}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#6b7280] block">SERVICE TYPE:</span>
              <strong className="uppercase">{order.orderType.replace('_', ' ')}</strong>
            </div>
            {order.tableNumber && (
              <div className="col-span-2 bg-[#f3f4f6] p-1.5 rounded text-center font-bold text-[#111827]">
                LOCATION: {order.tableNumber}
              </div>
            )}
          </div>

          {/* Itemized Dish List */}
          <div>
            <div className="grid grid-cols-12 font-bold pb-1 text-[10px] text-[#4b5563] border-b border-[#a0a8b4]">
              <span className="col-span-6">ITEM / PARTICULARS</span>
              <span className="col-span-2 text-center">QTY</span>
              <span className="col-span-2 text-right">RATE</span>
              <span className="col-span-2 text-right">TOTAL</span>
            </div>

            <div className="divide-y divide-[#e5e7eb] pt-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 text-[11px]">
                  <div className="grid grid-cols-12 font-medium">
                    <span className="col-span-6 font-sans font-semibold text-[#111827]">
                      {item.name}
                    </span>
                    <span className="col-span-2 text-center">{item.quantity}</span>
                    <span className="col-span-2 text-right">₹{item.price}</span>
                    <span className="col-span-2 text-right font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <div className="text-[10px] text-[#6b7280] pl-2 mt-0.5">
                      + {item.selectedAddOns.map(a => `${a.label} (₹${a.price})`).join(', ')}
                    </div>
                  )}
                  {item.spiceLevel && (
                    <div className="text-[10px] text-[#6b7280] pl-2">
                      Style: {item.spiceLevel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Taxes Breakdown */}
          <div className="pt-3 border-t-2 border-[#111827] space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#4b5563]">F&amp;B Subtotal:</span>
              <span>₹{order.subtotal.toFixed(0)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Special Promo Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                <span>-₹{order.discount.toFixed(0)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-[#4b5563]">GST (CGST 2.5% + SGST 2.5%):</span>
              <span>₹{order.tax.toFixed(0)}</span>
            </div>

            {order.serviceCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-[#4b5563]">Hospitality Service (5.00%):</span>
                <span>₹{order.serviceCharge.toFixed(0)}</span>
              </div>
            )}

            {order.tip > 0 && (
              <div className="flex justify-between">
                <span className="text-[#4b5563]">Staff Gratuity:</span>
                <span>₹{order.tip.toFixed(0)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#111827] flex justify-between font-bold text-base text-[#111827]">
              <span>TOTAL INVOICE AMOUNT:</span>
              <span>₹{order.totalAmount.toFixed(0)}</span>
            </div>
          </div>

          {/* Settlement Method */}
          <div className="pt-4 border-t border-dashed border-[#a0a8b4] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#6b7280] block">SETTLEMENT METHOD:</span>
              <strong className="uppercase font-bold text-[#111827]">
                {order.paymentMethod.replace(/_/g, ' ')}
              </strong>
            </div>
            <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
              order.paymentStatus === 'paid'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {order.paymentStatus === 'paid' ? 'PAID IN FULL' : 'POSTPAID / PENDING'}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 text-[10px] text-[#6b7280] space-y-1">
            <p className="font-serif italic text-xs text-[#1a1309]">
              "Thank you for dining with Saffron &amp; Thyme."
            </p>
            <p>Please retain this tax receipt for your records.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
