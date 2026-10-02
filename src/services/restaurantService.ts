import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { OrderRecord, ReservationRecord, OrderStatus, RoomBookingRecord, ReviewRecord } from '../types/restaurant';

export async function createOrderInFirestore(order: OrderRecord): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function createReservationInFirestore(res: ReservationRecord): Promise<void> {
  const path = `reservations/${res.id}`;
  try {
    const docRef = doc(db, 'reservations', res.id);
    await setDoc(docRef, res);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function createRoomBookingInFirestore(booking: RoomBookingRecord): Promise<void> {
  const path = `room_bookings/${booking.id}`;
  try {
    const docRef = doc(db, 'room_bookings', booking.id);
    await setDoc(docRef, booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { orderStatus: status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateReservationStatus(
  resId: string,
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled'
): Promise<void> {
  const path = `reservations/${resId}`;
  try {
    const docRef = doc(db, 'reservations', resId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateRoomBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled'
): Promise<void> {
  const path = `room_bookings/${bookingId}`;
  try {
    const docRef = doc(db, 'room_bookings', bookingId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToUserOrders(
  userId: string,
  isAdmin: boolean,
  callback: (orders: OrderRecord[]) => void,
  errorCallback?: (error: Error) => void
) {
  const path = 'orders';
  try {
    const colRef = collection(db, 'orders');
    const q = isAdmin
      ? query(colRef)
      : query(colRef, where('userId', '==', userId));

    return onSnapshot(
      q,
      (snapshot) => {
        const results: OrderRecord[] = [];
        snapshot.forEach((d) => {
          results.push(d.data() as OrderRecord);
        });
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(results);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (errorCallback) errorCallback(error as Error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeToUserReservations(
  userId: string,
  isAdmin: boolean,
  callback: (reservations: ReservationRecord[]) => void,
  errorCallback?: (error: Error) => void
) {
  const path = 'reservations';
  try {
    const colRef = collection(db, 'reservations');
    const q = isAdmin
      ? query(colRef)
      : query(colRef, where('userId', '==', userId));

    return onSnapshot(
      q,
      (snapshot) => {
        const results: ReservationRecord[] = [];
        snapshot.forEach((d) => {
          results.push(d.data() as ReservationRecord);
        });
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(results);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (errorCallback) errorCallback(error as Error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export function subscribeToUserRoomBookings(
  userId: string,
  isAdmin: boolean,
  callback: (bookings: RoomBookingRecord[]) => void,
  errorCallback?: (error: Error) => void
) {
  const path = 'room_bookings';
  try {
    const colRef = collection(db, 'room_bookings');
    const q = isAdmin
      ? query(colRef)
      : query(colRef, where('userId', '==', userId));

    return onSnapshot(
      q,
      (snapshot) => {
        const results: RoomBookingRecord[] = [];
        snapshot.forEach((d) => {
          results.push(d.data() as RoomBookingRecord);
        });
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(results);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (errorCallback) errorCallback(error as Error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function createReviewInFirestore(review: ReviewRecord): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    const docRef = doc(db, 'reviews', review.id);
    await setDoc(docRef, review);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToReviews(
  callback: (reviews: ReviewRecord[]) => void,
  errorCallback?: (error: Error) => void
) {
  const path = 'reviews';
  try {
    const colRef = collection(db, 'reviews');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const results: ReviewRecord[] = [];
        snapshot.forEach((d) => {
          results.push(d.data() as ReviewRecord);
        });
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(results);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (errorCallback) errorCallback(error as Error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}
