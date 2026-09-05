const categories = [
  { icon:'📱', name:'إلكترونيات' },
  { icon:'👕', name:'ملابس' },
  { icon:'🏠', name:'منزل وحديقة' },
  { icon:'💄', name:'جمال وعناية' },
  { icon:'📚', name:'كتب' },
  { icon:'⚽', name:'رياضة' },
  { icon:'🎮', name:'ألعاب' },
  { icon:'🚗', name:'سيارات' },
];

const products = [
  { id:1, name:'ساعة ذكية Galaxy Watch', cat:'إلكترونيات', price:499, oldPrice:699, img:'https://picsum.photos/seed/product1/400/400', rating:'⭐ 4.8', sale:true },
  { id:2, name:'سماعات لاسلكية AirPods Pro', cat:'إلكترونيات', price:349, oldPrice:450, img:'https://picsum.photos/seed/product2/400/400', rating:'⭐ 4.9', sale:true },
  { id:3, name:'كاميرا Sony Alpha', cat:'إلكترونيات', price:3299, img:'https://picsum.photos/seed/product3/400/400', rating:'⭐ 4.7', sale:false },
  { id:4, name:'قميص كلاسيكي أنيق', cat:'ملابس', price:129, oldPrice:180, img:'https://picsum.photos/seed/product4/400/400', rating:'⭐ 4.5', sale:true },
  { id:5, name:'حقيبة جلد فاخرة', cat:'ملابس', price:259, img:'https://picsum.photos/seed/product5/400/400', rating:'⭐ 4.6', sale:false },
  { id:6, name:'مصباح ذكي LED', cat:'منزل وحديقة', price:89, img:'https://picsum.photos/seed/product6/400/400', rating:'⭐ 4.4', sale:false },
  { id:7, name:'مجموعة عناية بالبشرة', cat:'جمال وعناية', price:199, oldPrice:280, img:'https://picsum.photos/seed/product7/400/400', rating:'⭐ 4.8', sale:true },
  { id:8, name:'كرة قدم Adidas', cat:'رياضة', price:149, img:'https://picsum.photos/seed/product8/400/400', rating:'⭐ 4.7', sale:false },
];

let cart = [];
let activeFilter = 'الكل';

function renderCategories() {
  document.getElementById('catGrid').innerHTML = categories.map(c =>
    `<div class="cat-card" onclick="filterProducts('${c.name}')"><span class="cat-icon">${c.icon}</span><span>${c.name}</span></div>`
  ).join('');
}

function renderFilters() {
  const cats = ['الكل', ...new Set(products.map(p => p.cat))];
  document.getElementById('filterBar').innerHTML = cats.map(c =>
    `<button class="filter-btn${c === activeFilter ? ' active' : ''}" onclick="filterProducts('${c}')">${c}</button>`
  ).join('');
}

function renderProducts() {
  const filtered = activeFilter === 'الكل' ? products : products.filter(p => p.cat === activeFilter);
  document.getElementById('productsGrid').innerHTML = filtered.map(p => `
    <div class="product-card fade-up">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.sale ? '<span class="badge-sale">خصم</span>' : ''}
      </div>
      <div class="product-body">
        <div class="rating">${p.rating} (128 تقييم)</div>
        <h3>${p.name}</h3>
        <div class="price-row">
          <div>
            <div class="price">${p.price} ر.س</div>
            ${p.oldPrice ? `<div class="old-price">${p.oldPrice} ر.س</div>` : ''}
          </div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">+ أضف للسلة</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(cat) {
  activeFilter = cat;
  renderFilters();
  renderProducts();
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCart();
  showToast(`تمت إضافة ${p.name}! 🛒`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCart();
}

function updateCart() {
  document.getElementById('cartCount').textContent = cart.reduce((s,x) => s + x.qty, 0);
  const total = cart.reduce((s,x) => s + x.price * x.qty, 0);
  document.getElementById('cartTotal').textContent = total + ' ر.س';
  const el = document.getElementById('cartItems');
  el.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <p>${item.name}</p>
        <div style="display:flex;align-items:center;gap:.5rem">
          <span class="item-price">${item.price * item.qty} ر.س</span>
          <span style="color:var(--muted);font-size:.8rem">×${item.qty}</span>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
    </div>
  `).join('') : '<p class="empty-cart">سلتك فارغة 🛍️</p>';
}

function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
function checkout() { showToast('جار تحويلك لصفحة الدفع...'); setTimeout(closeCart, 1000); }

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--accent);color:#000;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;z-index:999;opacity:0;transition:opacity .3s;pointer-events:none'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._t); t._t = setTimeout(() => t.style.opacity = '0', 2500);
}

window.openCart = openCart; window.closeCart = closeCart; window.filterProducts = filterProducts;
window.addToCart = addToCart; window.removeFromCart = removeFromCart; window.checkout = checkout;

renderCategories(); renderFilters(); renderProducts();