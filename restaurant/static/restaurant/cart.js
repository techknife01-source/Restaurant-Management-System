

const CART_KEY = "restro_cart";

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(itemId, qty = 1, extra = "") {
  const cart = getCart();
  const item = MENU_ITEMS.find(m => m.id === Number(itemId));
  const lockedRestaurantId = getCartRestaurantId();

  if (!item) {
    return { success: false, message: "This item is not available." };
  }

  if (lockedRestaurantId && lockedRestaurantId !== item.restaurantId) {
    const lockedRestaurant = RESTAURANTS.find(r => r.id === lockedRestaurantId);
    return {
      success: false,
      message: `Your cart already has items from ${lockedRestaurant ? lockedRestaurant.name : "another restaurant"}. Please checkout or remove them before adding from a different restaurant.`
    };
  }

  const existing = cart[itemId];

  if (existing && typeof existing === "object") {
    cart[itemId] = {
      qty: existing.qty + qty,
      extra: existing.extra || extra,
      restaurantId: item.restaurantId
    };
  } else {
    cart[itemId] = { qty: qty, extra: extra, restaurantId: item.restaurantId };
  }

  saveCart(cart);
  return { success: true };
}

function setQuantity(itemId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[itemId];
  } else if (cart[itemId] && typeof cart[itemId] === "object") {
    cart[itemId] = { ...cart[itemId], qty: qty };
  } else {
    const item = MENU_ITEMS.find(m => m.id === Number(itemId));
    cart[itemId] = { qty: qty, extra: "", restaurantId: item ? item.restaurantId : null };
  }
  saveCart(cart);
}

function updateExtra(itemId, extra) {
  const cart = getCart();
  if (cart[itemId] && typeof cart[itemId] === "object") {
    cart[itemId] = { ...cart[itemId], extra: extra };
    saveCart(cart);
  }
}

function removeFromCart(itemId) {
  const cart = getCart();
  delete cart[itemId];
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartRestaurantId() {
  const cart = getCart();
  for (const [id, entry] of Object.entries(cart)) {
    if (entry && typeof entry === "object" && entry.restaurantId) {
      return entry.restaurantId;
    }

    const item = MENU_ITEMS.find(m => m.id === Number(id));
    if (item) return item.restaurantId;
  }
  return null;
}

function getCartRestaurant() {
  const restaurantId = getCartRestaurantId();
  return RESTAURANTS.find(r => r.id === restaurantId) || getSelectedRestaurant();
}

function canAddItemToCart(itemId) {
  const item = MENU_ITEMS.find(m => m.id === Number(itemId));
  const lockedRestaurantId = getCartRestaurantId();
  return !item || !lockedRestaurantId || lockedRestaurantId === item.restaurantId;
}

function cartItemCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, entry) => {
    const qty = (entry && typeof entry === "object") ? entry.qty : entry;
    return sum + (qty || 0);
  }, 0);
}

function getCartDetails() {
  const cart = getCart();
  return Object.entries(cart).map(([id, entry]) => {
    const item = MENU_ITEMS.find(m => m.id === Number(id));
    if (!item) return null;
    const qty = (entry && typeof entry === "object") ? entry.qty : entry;
    const extra = (entry && typeof entry === "object") ? entry.extra : "";
    return {
      id: item.id,
      restaurantId: item.restaurantId,
      name: item.name,
      price: item.price,
      qty: qty,
      extra: extra,
      lineTotal: item.price * qty
    };
  }).filter(Boolean);
}

function getCartTotal() {
  return getCartDetails().reduce((sum, line) => sum + line.lineTotal, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = cartItemCount();
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
