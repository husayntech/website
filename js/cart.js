// ============================================
// Shopping Cart Module
// Husayn ProHerbal Medicine
// ============================================

const CART_STORAGE_KEY = 'herbal-cart';
const CART_OPEN_KEY = 'herbal-cart-open';

// ============================================
// Cart CRUD
// ============================================

export function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  dispatchCartEvent();
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const price = parseFloat(item.priceRaw || 0);
    return sum + price * (item.quantity || 1);
  }, 0);
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      priceRaw: product.priceRaw || extractPrice(product.price),
      image_url: product.image_url || './image/proherbal.jpg',
      quantity: 1
    });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  if (quantity <= 0) return removeFromCart(productId);
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}

function extractPrice(priceStr) {
  if (!priceStr) return 0;
  // Extract the first number from a price string like "₦5,000 / bottle"
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// ============================================
// Cart Events
// ============================================

function dispatchCartEvent() {
  window.dispatchEvent(new CustomEvent('cart-updated', {
    detail: { count: getCartCount(), total: getCartTotal() }
  }));
}

// ============================================
// Cart UI Component
// ============================================

export function renderCartSidebar() {
  // Create cart overlay if it doesn't exist
  if (document.getElementById('cart-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cart-overlay';
  overlay.className = 'cart-overlay';
  overlay.innerHTML = `
    <div class="cart-backdrop"></div>
    <div class="cart-sidebar">
      <div class="cart-header">
        <h2><i class="fas fa-shopping-cart"></i> Your Cart</h2>
        <button class="cart-close-btn" id="cart-close-btn" aria-label="Close cart">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cart-items" id="cart-items">
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is empty</p>
          <p class="cart-empty-sub">Browse our products and add items you'd like to order.</p>
        </div>
      </div>
      <div class="cart-footer" id="cart-footer" style="display:none;">
        <div class="cart-total-row">
          <span>Total</span>
          <span class="cart-total-amount" id="cart-total-amount">₦0</span>
        </div>
        <button class="button_1 cart-checkout-btn" id="cart-checkout-btn">
          <i class="fas fa-credit-card"></i> Proceed to Checkout
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close on backdrop click
  overlay.querySelector('.cart-backdrop').addEventListener('click', closeCart);
  document.getElementById('cart-close-btn').addEventListener('click', closeCart);

  // Checkout button
  document.getElementById('cart-checkout-btn').addEventListener('click', () => {
    closeCart();
    openCheckoutModal();
  });

  // Update cart display
  updateCartDisplay();
}

function openCheckoutModal() {
  const existing = document.getElementById('checkout-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'checkout-modal';
  modal.innerHTML = `
    <div class="checkout-backdrop"></div>
    <div class="checkout-panel">
      <div class="checkout-header">
        <h2><i class="fas fa-credit-card"></i> Place Your Order</h2>
        <button class="cart-close-btn" id="checkout-close-btn" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="checkout-body">
        <div class="checkout-order-summary" id="checkout-order-summary"></div>
        <form id="checkout-form" class="checkout-form">
          <div class="form-row">
            <div class="form-group">
              <label for="checkout-name">Full Name *</label>
              <input type="text" id="checkout-name" placeholder="Your full name" required>
            </div>
            <div class="form-group">
              <label for="checkout-email">Email *</label>
              <input type="email" id="checkout-email" placeholder="your@email.com" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="checkout-phone">Phone Number</label>
              <input type="tel" id="checkout-phone" placeholder="+234 800 000 0000">
            </div>
            <div class="form-group">
              <label for="checkout-address">Delivery Address</label>
              <input type="text" id="checkout-address" placeholder="Your address for delivery">
            </div>
          </div>
          <div class="form-group">
            <label for="checkout-notes">Order Notes (optional)</label>
            <textarea id="checkout-notes" placeholder="Any special instructions..." rows="3"></textarea>
          </div>
          <div class="checkout-total-bar">
            <span>Order Total:</span>
            <span class="checkout-total-amount" id="checkout-total-amount">₦0</span>
          </div>
          <div id="checkout-error" class="error-message"></div>
          <button type="submit" class="button_1 checkout-submit-btn" id="checkout-submit-btn">
            <i class="fas fa-check-circle"></i> Place Order
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Show order summary
  updateCheckoutSummary();
  document.getElementById('checkout-total-amount').textContent = formatPrice(getCartTotal());

  // Close handlers
  modal.querySelector('.checkout-backdrop').addEventListener('click', closeCheckoutModal);
  document.getElementById('checkout-close-btn').addEventListener('click', closeCheckoutModal);

  // Submit handler
  document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);

  // Show modal with animation
  requestAnimationFrame(() => modal.classList.add('active'));
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

function updateCheckoutSummary() {
  const cart = getCart();
  const container = document.getElementById('checkout-order-summary');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    return;
  }

  container.innerHTML = `
    <h3><i class="fas fa-receipt"></i> Order Summary (${cart.length} items)</h3>
    <div class="checkout-items">
      ${cart.map(item => `
        <div class="checkout-item">
          <img src="${escapeHtml(item.image_url || './image/proherbal.jpg')}" alt="${escapeHtml(item.name)}" class="checkout-item-img">
          <div class="checkout-item-info">
            <span class="checkout-item-name">${escapeHtml(item.name)}</span>
            <span class="checkout-item-qty">Qty: ${item.quantity}</span>
          </div>
          <span class="checkout-item-price">${escapeHtml(item.price)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

let isSubmitting = false;

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  if (isSubmitting) return;
  isSubmitting = true;

  const cart = getCart();
  if (!cart.length) {
    showCheckoutError('Your cart is empty.');
    isSubmitting = false;
    return;
  }

  const name = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const notes = document.getElementById('checkout-notes').value.trim();

  if (!name || !email) {
    showCheckoutError('Please provide your name and email.');
    isSubmitting = false;
    return;
  }

  const submitBtn = document.getElementById('checkout-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';

  try {
    const { supabaseClient } = await import('./supabase-config.js');

    const { error } = await supabaseClient
      .from('orders')
      .insert([{
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        customer_address: address || null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: formatPrice(getCartTotal()),
        status: 'pending',
        notes: notes || null
      }]);

    if (error) throw error;

    // Success!
    clearCart();
    closeCheckoutModal();
    closeCart();
    showSuccessMessage(name);
  } catch (err) {
    showCheckoutError('Failed to place order: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    isSubmitting = false;
  }
}

function showSuccessMessage(customerName) {
  // Remove any existing success message
  const existing = document.getElementById('order-success-msg');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.id = 'order-success-msg';
  msg.className = 'order-success-msg';
  msg.innerHTML = `
    <div class="success-content">
      <div class="success-icon"><i class="fas fa-check-circle"></i></div>
      <h3>Order Placed Successfully!</h3>
      <p>Thank you, <strong>${escapeHtml(customerName)}</strong>! We have received your order.</p>
      <p>We will contact you via email or phone to confirm your order and arrange delivery.</p>
      <button class="button_1" onclick="this.closest('.order-success-msg').remove()">
        <i class="fas fa-arrow-left"></i> Continue Shopping
      </button>
    </div>
  `;
  document.body.appendChild(msg);
}

function showCheckoutError(msg) {
  const el = document.getElementById('checkout-error');
  if (el) el.textContent = msg;
}

// ============================================
// Cart Display / Rendering
// ============================================

export function updateCartDisplay() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-amount');

  if (!container) return;

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
        <p class="cart-empty-sub">Browse our products and add items you'd like to order.</p>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${escapeHtml(item.id)}">
      <img src="${escapeHtml(item.image_url || './image/proherbal.jpg')}" alt="${escapeHtml(item.name)}" class="cart-item-img">
      <div class="cart-item-details">
        <span class="cart-item-name">${escapeHtml(item.name)}</span>
        <span class="cart-item-price">${escapeHtml(item.price)}</span>
        <div class="cart-item-qty">
          <button class="qty-btn qty-minus" data-id="${escapeHtml(item.id)}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-plus" data-id="${escapeHtml(item.id)}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${escapeHtml(item.id)}" title="Remove item">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  if (footer) {
    footer.style.display = 'flex';
    totalEl.textContent = formatPrice(getCartTotal());
  }

  // Attach event listeners
  container.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) updateQuantity(id, item.quantity - 1);
      updateCartDisplay();
    });
  });

  container.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) updateQuantity(id, (item.quantity || 1) + 1);
      updateCartDisplay();
    });
  });

  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id);
      updateCartDisplay();
    });
  });
}

// ============================================
// Open / Close Cart
// ============================================

export function openCart() {
  renderCartSidebar();
  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    requestAnimationFrame(() => overlay.classList.add('active'));
  }
}

export function closeCart() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// ============================================
// Cart Badge (floating cart icon)
// ============================================

export function createCartFAB() {
  if (document.getElementById('cart-fab')) return;

  const fab = document.createElement('div');
  fab.id = 'cart-fab';
  fab.className = 'cart-fab';
  fab.innerHTML = `
    <button class="cart-fab-btn" id="cart-fab-btn" aria-label="Open cart">
      <i class="fas fa-shopping-cart"></i>
      <span class="cart-fab-badge" id="cart-fab-badge">0</span>
    </button>
  `;

  document.body.appendChild(fab);

  document.getElementById('cart-fab-btn').addEventListener('click', openCart);

  // Update badge on cart changes
  window.addEventListener('cart-updated', (e) => {
    const badge = document.getElementById('cart-fab-badge');
    if (badge) {
      badge.textContent = e.detail.count;
      badge.style.display = e.detail.count > 0 ? 'flex' : 'none';
    }
  });

  // Initial badge update
  const count = getCartCount();
  const badge = document.getElementById('cart-fab-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ============================================
// Add to Cart Button Helper
// ============================================

export function createAddToCartHandler(product) {
  return function(e) {
    e.preventDefault();
    addToCart(product);
    openCart();
  };
}

// ============================================
// Utilities
// ============================================

function formatPrice(amount) {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createCartFAB();
  renderCartSidebar();
});
