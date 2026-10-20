/* ============================================
   PRODUCT DATA
   Add / edit / remove products here ONLY.
   Every page (home, all products, product details)
   reads from this single array — no more copy-pasting
   product cards into every HTML file.
   ============================================ */

const PRODUCTS = [
  {
    id: "white-flower-vase",
    name: "White Flower Vase",
    image: "Vase.jpg",
    price: 30.00,
    rating: 4, // out of 5
    category: "vases",
    featured: true,
    latest: true,
    description: "Give your home a simple white flower vase. It can be decorated with any kind of flower."
  },
  {
    id: "rope-light-lamp",
    name: "Rope Light Lamp",
    image: "Lamp.jpg",
    price: 32.00,
    rating: 5,
    category: "lighting",
    featured: true,
    latest: true,
    description: "A cozy rope light lamp that adds warm, ambient light to any room."
  },
  {
    id: "gold-wall-clock",
    name: "Sparkling Gold Wall Clock",
    image: "Clock.jpg",
    price: 45.00,
    rating: 5,
    category: "clocks",
    featured: true,
    latest: true,
    description: "An elegant gold wall clock that makes a statement on any wall."
  },
  {
    id: "led-bedside-clock",
    name: "LED Bedside Clock",
    image: "LED Clock.jpg",
    price: 25.00,
    rating: 5,
    category: "clocks",
    featured: true,
    latest: true,
    description: "A modern LED clock, perfect for your bedside table."
  },
  {
    id: "finian-decor",
    name: "Finian Decor Piece",
    image: "Finian.jpg",
    price: 38.00,
    rating: 4,
    category: "decor",
    featured: false,
    latest: true,
    description: "A striking decorative piece that completes any room."
  },
  {
    id: "gold-accent-vase",
    name: "Gold Accent Vase",
    image: "Vase.jpg",
    price: 34.00,
    rating: 4,
    category: "vases",
    featured: false,
    latest: true,
    description: "A gold-accented vase for a touch of everyday luxury."
  },
  {
    id: "classic-table-lamp",
    name: "Classic Table Lamp",
    image: "Lamp.jpg",
    price: 28.00,
    rating: 4,
    category: "lighting",
    featured: false,
    latest: true,
    description: "A classic table lamp with soft, warm lighting."
  },
  {
    id: "mini-desk-clock",
    name: "Mini Desk Clock",
    image: "Clock.jpg",
    price: 20.00,
    rating: 3,
    category: "clocks",
    featured: false,
    latest: true,
    description: "A compact desk clock that fits neatly on any workspace."
  },

  /* ----------------------------------------------------------
     Duplicates below — same image/price/everything as above,
     just with new ids so each still gets its own details page.
     Kept out of "featured"/"latest" so the homepage doesn't change;
     these only exist to fill out the All Products page/pagination.
     Swap these out for real products whenever you're ready.
     ---------------------------------------------------------- */
  {
    id: "white-flower-vase-2",
    name: "White Flower Vase",
    image: "Vase.jpg",
    price: 30.00,
    rating: 4,
    category: "vases",
    featured: false,
    latest: false,
    description: "Give your home a simple white flower vase. It can be decorated with any kind of flower."
  },
  {
    id: "rope-light-lamp-2",
    name: "Rope Light Lamp",
    image: "Lamp.jpg",
    price: 32.00,
    rating: 5,
    category: "lighting",
    featured: false,
    latest: false,
    description: "A cozy rope light lamp that adds warm, ambient light to any room."
  },
  {
    id: "gold-wall-clock-2",
    name: "Sparkling Gold Wall Clock",
    image: "Clock.jpg",
    price: 45.00,
    rating: 5,
    category: "clocks",
    featured: false,
    latest: false,
    description: "An elegant gold wall clock that makes a statement on any wall."
  },
  {
    id: "led-bedside-clock-2",
    name: "LED Bedside Clock",
    image: "LED Clock.jpg",
    price: 25.00,
    rating: 5,
    category: "clocks",
    featured: false,
    latest: false,
    description: "A modern LED clock, perfect for your bedside table."
  },
  {
    id: "finian-decor-2",
    name: "Finian Decor Piece",
    image: "Finian.jpg",
    price: 38.00,
    rating: 4,
    category: "decor",
    featured: false,
    latest: false,
    description: "A striking decorative piece that completes any room."
  },
  {
    id: "gold-accent-vase-2",
    name: "Gold Accent Vase",
    image: "Vase.jpg",
    price: 34.00,
    rating: 4,
    category: "vases",
    featured: false,
    latest: false,
    description: "A gold-accented vase for a touch of everyday luxury."
  },
  {
    id: "classic-table-lamp-2",
    name: "Classic Table Lamp",
    image: "Lamp.jpg",
    price: 28.00,
    rating: 4,
    category: "lighting",
    featured: false,
    latest: false,
    description: "A classic table lamp with soft, warm lighting."
  },
  {
    id: "mini-desk-clock-2",
    name: "Mini Desk Clock",
    image: "Clock.jpg",
    price: 20.00,
    rating: 3,
    category: "clocks",
    featured: false,
    latest: false,
    description: "A compact desk clock that fits neatly on any workspace."
  }
];

/* ============================================
   HELPERS
   ============================================ */

// Build the 5-star rating markup from a number 0-5
function starsHTML(rating) {
  let html = "";
  for (let i = 0; i < 5; i++) {
    html += i < rating ? '<i class="fa fa-star"></i>' : '<i class="fa fa-star-o"></i>';
  }
  return html;
}

// Build one product card (matches your existing .col-4 markup)
function productCardHTML(product) {
  return `
    <div class="col-4">
      <a href="products-details.html?id=${encodeURIComponent(product.id)}">
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <div class="rating">${starsHTML(product.rating)}</div>
        <p>₦${product.price.toFixed(2)}</p>
      </a>
    </div>
  `;
}

// Render a list of products into a container by id
function renderGrid(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCardHTML).join("");
}

// Find one product by id
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

// Read a query param from the current URL, e.g. ?id=white-flower-vase
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
