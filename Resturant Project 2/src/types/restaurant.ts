export type MenuCategory = 
  | 'all' 
  | 'bardhaman_heritage'
  | 'indian_delicacies' 
  | 'starters' 
  | 'mains' 
  | 'pastas' 
  | 'specials' 
  | 'desserts' 
  | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number; // in Indian Rupees (₹)
  image: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isIndianSpecial?: boolean;
  isBardhamanSpecial?: boolean;
  heritageSource?: string;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories: number;
  allergens: string[];
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Desi Tikha' | 'None';
  available: boolean;
  pairingNote?: string;
  customizationOptions?: {
    name: string;
    options: { label: string; price: number }[];
  }[];
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  spiceLevel?: string;
  selectedAddOns?: { label: string; price: number }[];
  specialInstructions?: string;
  category: string;
}

export type OrderType = 'dine_in' | 'takeaway_parcel' | 'home_delivery' | 'room_service';

export type PaymentMethod = 'pay_now_card' | 'pay_now_upi' | 'postpaid_cash' | 'pay_at_counter';

export type PaymentStatus = 'paid' | 'pending' | 'pay_at_counter';

export type OrderStatus = 'placed' | 'kitchen_preparing' | 'ready_to_serve' | 'served_or_dispatched' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: string;
  billNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  items: CartItem[];
  subtotal: number;
  tax: number; // 5% GST
  serviceCharge: number;
  discount: number;
  tip: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  estimatedMinutes: number;
  specialInstructions?: string;
  createdAt: string;
}

export type SeatingZone = 'terrace' | 'wine_cellar' | 'main_hall' | 'chefs_counter';

export type DiningOccasion = 'casual' | 'date' | 'birthday' | 'anniversary' | 'business';

export interface ReservationRecord {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestsCount: number;
  bookingDate: string;
  timeSlot: string;
  seatingZone: SeatingZone;
  tableNumber: string;
  occasion: DiningOccasion;
  specialRequests?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  depositAmount: number;
  createdAt: string;
}

// Floor Plan visual layout interface
export interface TableInfo {
  id: string;
  zone: SeatingZone;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
  label: string;
  description: string;
  shape: 'round' | 'rect' | 'booth' | 'counter';
  x: number; // SVG coordinate percentage (0-100)
  y: number; // SVG coordinate percentage (0-100)
  width?: number;
  height?: number;
  features: string[];
}

// Room Booking System (Non-AC ₹499-₹599 / AC ₹799-₹999)
export type RoomType = 
  | 'non_ac_standard' 
  | 'non_ac_solo'
  | 'non_ac_deluxe' 
  | 'non_ac_courtyard'
  | 'non_ac_balcony'
  | 'ac_executive' 
  | 'ac_botanical'
  | 'ac_business'
  | 'ac_teakwood'
  | 'ac_royal_suite'
  | 'ac_presidential';

export interface HotelRoom {
  id: string;
  type: RoomType;
  name: string;
  categoryLabel: 'Non-AC Budget' | 'Non-AC Deluxe' | 'AC Executive' | 'AC Luxury Suite';
  pricePerNight: number; // ₹499, ₹599, ₹799, ₹899, ₹999
  capacity: number;
  bedType: string;
  isAC: boolean;
  floor: string;
  image: string;
  description: string;
  amenities: string[];
  roomNumbers: string[];
  popular?: boolean;
}

export interface RoomBookingRecord {
  id: string;
  bookingNumber: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  roomName: string;
  roomNumber: string;
  pricePerNight: number;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  guestsCount: number;
  extraBedAdded: boolean;
  breakfastIncluded: boolean;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pay_at_checkin';
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  createdAt: string;
}

export type ReviewCategory = 'dining' | 'room_stay' | 'overall';

export interface ReviewRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 - 5
  category: ReviewCategory;
  itemReviewed?: string; // e.g. "Awadhi Shahi Dum Biryani" or "Deluxe Non-AC Room (₹599)"
  title: string;
  comment: string;
  stayOrDineDate?: string;
  createdAt: string;
  likesCount?: number;
  verifiedStayOrDine?: boolean;
}
