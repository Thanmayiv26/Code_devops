const products = [
  {
    title: "Smartphone Pro",
    description: "OLED display, AI camera, ultra-fast charging.",
    price: 59999,
    rating: 4.6,
    category: "Phones",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Wireless Headphones",
    description: "Noise-cancelling, 35hr battery, premium sound.",
    price: 9999,
    rating: 4.7,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable, waterproof, deep bass, 24hr playtime.",
    price: 4499,
    rating: 4.5,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Smart Watch X",
    description: "AMOLED display, ECG, GPS, 7-day battery.",
    price: 14999,
    rating: 4.3,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Ergo Laptop Stand",
    description: "Adjustable, lightweight, aluminum build.",
    price: 2299,
    rating: 4.4,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1472437774355-71ab6752b434?auto=format&fit=crop&w=400&q=80"
  }
];

// Utility
function num(n) {
  return Number(n).toLocaleString('en-IN');
}
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) {
    return (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
    );
  });
}

// Modal index tracking
let currentModalIndex = 0;
let currentProductList = products;

// Render Featured Banner
function renderFeatured() {
  const featured = [...products].sort((a, b) => b.rating - a.rating)[0];
  document.getElementById('featured').innerHTML = `
    <section class="featured-banner-unique">
      <div class="featured-image-wrapper">
        <img src="${featured.image}" alt="${escapeHtml(featured.title)}" class="featured-image" loading="lazy" />
        <div class="featured-gradient"></div>
      </div>
      <div class="featured-details">
        <h2>🌟 Featured: ${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(featured.description)}</p>
        <strong>₹${num(featured.price)} | ★ ${featured.rating.toFixed(1)}</strong>
      </div>
    </section>
  `;
}

// Render Products Grid
function renderGrid(prodList = products) {
  currentProductList = prodList;
  document.getElementById('grid').innerHTML = prodList.map((prod, idx) => `
    <div class="card" tabindex="0" data-idx="${idx}">
      <div class="thumb">
        <img src="${prod.image}" alt="${escapeHtml(prod.title)}" />
      </div>
      <div class="info">
        <h3 class="title">${escapeHtml(prod.title)}</h3>
        <p class="desc">${escapeHtml(prod.description)}</p>
        <div class="meta">
          <span class="price">₹${num(prod.price)}</span>
          <span class="rating">★ ${prod.rating.toFixed(1)}</span>
          <span class="category">${escapeHtml(prod.category)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Show Modal
function showModal(idx) {
  const prod = currentProductList[idx];
  currentModalIndex = idx;
  document.getElementById('modalImg').src = prod.image;
  document.getElementById('modalTitle').textContent = prod.title;
  document.getElementById('modalDesc').textContent = prod.description;
  document.getElementById('modalPrice').textContent = `₹${num(prod.price)}`;
  document.getElementById('modalRating').textContent = `★ ${prod.rating.toFixed(1)}`;
  document.getElementById('modalCategory').textContent = prod.category;
  document.getElementById('modal').setAttribute('aria-hidden', 'false');
}

// Modal logic
function setupModal() {
  document.querySelectorAll('.card').forEach((card) => {
    card.onclick = function() {
      const idx = Number(card.getAttribute('data-idx'));
      showModal(idx);
    };
  });
  document.getElementById('closeModal').onclick =
  document.getElementById('modalClose').onclick = function() {
    document.getElementById('modal').setAttribute('aria-hidden', 'true');
  };
  document.getElementById('modalNext').onclick = function() {
    currentModalIndex = (currentModalIndex + 1) % currentProductList.length;
    showModal(currentModalIndex);
  };
  document.getElementById('modalPrev').onclick = function() {
    currentModalIndex = (currentModalIndex - 1 + currentProductList.length) % currentProductList.length;
    showModal(currentModalIndex);
  };
}

// Filters
function setupFilters() {
  document.getElementById('categoryFilter').onchange = function() {
    const val = this.value;
    let filtered = val === 'all' ? products : products.filter(p => p.category.toLowerCase() === val);
    renderGrid(filtered);
    setupModal();
  };
  document.getElementById('priceFilter').oninput = function() {
    document.getElementById('priceValue').textContent = `₹${num(this.value)}`;
    let filtered = products.filter(p => p.price <= this.value);
    renderGrid(filtered);
    setupModal();
  };
}

// Initial render
window.onload = function() {
  renderFeatured();
  renderGrid();
  setupModal();
  setupFilters();
  document.getElementById('year').textContent = new Date().getFullYear();
};