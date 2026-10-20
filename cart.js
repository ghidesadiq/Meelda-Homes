/* ============================================
   CART LOGIC
   Cart is stored in the browser's localStorage as
   a simple array of { id, qty }. Actual product
   details (name/price/image) always come fresh
   from PRODUCTS in products-data.js — the cart only
   ever remembers "which id, how many".
   Include this AFTER products-data.js on every page.
   ============================================ */

const CART_KEY = "meelda_cart";

function getCart() {
  try {
    var raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty) {
  qty = qty || 1;
  var cart = getCart();
  var existing = cart.find(function (item) { return item.id === productId; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  var cart = getCart().filter(function (item) { return item.id !== productId; });
  saveCart(cart);
}

function setCartQty(productId, qty) {
  qty = parseInt(qty) || 1;
  if (qty < 1) qty = 1;
  var cart = getCart();
  var item = cart.find(function (i) { return i.id === productId; });
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
}

function getCartCount() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

// Merge stored {id, qty} with live product info from PRODUCTS
function getCartDetailed() {
  return getCart().map(function (item) {
    var product = getProductById(item.id);
    if (!product) return null; // product removed from catalog since being added
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: item.qty,
      subtotal: product.price * item.qty
    };
  }).filter(Boolean);
}

function getCartTotal() {
  return getCartDetailed().reduce(function (sum, item) { return sum + item.subtotal; }, 0);
}

// Call this on every page after the nav renders, to keep the badge accurate
function updateCartBadge() {
  var badge = document.getElementById("cart-count");
  if (!badge) return;
  var count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}
