# Security Specification - Saffron & Thyme Firestore Rules

## 1. Data Invariants
1. **User Identity & Isolation**: A user can only read and modify their own user document (`/users/{userId}`) unless an authorized admin (`isAdmin()`).
2. **Admin Authority**: Admin actions (such as updating order status to kitchen/served, viewing all reservations, deleting or modifying menu catalog items) are restricted to verified admins (either registered in `/admins/{uid}` or authenticated with bootstrapped owner email `kazi18296@gmail.com`).
3. **Reservation Integrity**: Diners can create reservations for themselves or as guests, but can only read/cancel their own reservations. Admins can view and update all reservations.
4. **Order Integrity**: A customer can create orders for dine-in or takeaway, view their own placed orders, and cancel only if the order is still in 'placed' status. Only admins/kitchen staff can advance order status to 'kitchen_preparing', 'ready_to_serve', 'completed'.
5. **Menu & Reviews**: Menu items are publicly readable by all diners; writable only by admins. Reviews can be read by all; created by verified/signed-in diners.

## 2. Dirty Dozen Threat Payloads
1. An unauthenticated attacker attempts to write an Admin record into `/admins/attacker_uid`.
2. A normal user attempts to change their own role to 'admin' inside `/users/{uid}`.
3. An attacker attempts to read another customer's private phone and order history in `/orders/{orderId}`.
4. An attacker submits an order with a negative totalAmount or fabricated discount injection.
5. A user attempts to update a reservation that is already in 'completed' state.
6. A customer tries to force status update on their order from 'placed' directly to 'completed' without admin privilege.
7. An attacker injects a 2MB string into `specialRequests` on reservation.
8. An unauthenticated attacker attempts to delete menu items from `/menu_items/{id}`.
9. A customer attempts to delete another customer's reservation record.
10. An attacker attempts to create a reservation with invalid ID pattern (e.g. `../../../etc/passwd`).
11. An attacker attempts to write review documents with a rating > 5 or negative rating.
12. An attacker attempts to modify `billNumber` or `createdAt` on an existing settled order.
