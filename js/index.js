const BASE_URL = "https://v2.api.noroff.dev/rainy-days";
const CART_KEY = "rainydays_cart_v1";

const container = document.querySelector(".card-container");
const searchInput = document.querySelector(".search-input");
const nav = document.querySelector(".main-nav");
const heading = document.querySelector("main h2");

let allProducts = [];
let currentGender = "all";
let currentSearch = "";
let currentTag = "all";
let currentLabel = "Bestsellers!";

//cart

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  const price = product.discountedPrice || product.price;

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: price,
      image: product.image?.url || "",
      quantity: 1
    });
  }

  saveCart(cart);
}

function showLoading() {
  container.innerHTML = "<p>Loading products...</p>";
}

function showError(message) {
  container.innerHTML = `<p>Error: ${message}</p>`;
}

function renderProducts(list) {
  container.innerHTML = "";

  list.forEach(product => {
    const price = product.discountedPrice || product.price;

    container.innerHTML += `
      <div class="card">
        <a href="/product/index.html?id=${product.id}" class="jacket">
          <img src="${product.image?.url || ""}" alt="${product.title}" class="jacket">
        </a>
        <div class="card-content">
          <h3>${product.title}</h3>
          <p class="price">${price} NOK</p>
          <button class="card-button" data-id="${product.id}">Buy now</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".card-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = allProducts.find(p => p.id === btn.dataset.id);
      addToCart(product);
      btn.textContent = "Added!";
      setTimeout(() => btn.textContent = "Buy now", 800);
    });
  });
}
function updateHeading() {
  if (!heading) return;
  heading.textContent = currentLabel;
}
function applyFilters() {
  let list = [...allProducts];
  if (currentGender !== "all") {
    list = list.filter((p) => (p.gender || "").toLowerCase() === currentGender);
  }
  if (currentTag !== "all") {
    list = list.filter((p) => Array.isArray(p.tags) && p.tags.includes(currentTag));
  }
  if (currentSearch.trim()) {
    const s = currentSearch.trim().toLowerCase();
    list = list.filter((p) => (p.title || "").toLowerCase().includes(s));
  }

  updateHeading();
  renderProducts(list);
}

async function fetchProducts() {
  showLoading();

  try {
    const res = await fetch(BASE_URL);
    const json = await res.json();
    allProducts = json.data;
    applyFilters();
  } catch (error) {
    showError(error.message);
  }
}

if (nav) {
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const txt = link.textContent.trim().toLowerCase();
    e.preventDefault();
    if (txt === "male" || txt === "female") {
      currentGender = txt;
      currentTag = "all";
      currentLabel = txt === "male" ? "Male jackets" : "Female jackets";
      applyFilters();
      return;
    }
    if (txt === "outlet" || txt === "sales" || txt === "news") {
      currentGender = "all";
      currentTag = txt; 
      currentLabel = txt.charAt(0).toUpperCase() + txt.slice(1);
      applyFilters();
      return;
    }

    currentGender = "all";
    currentTag = "all";
    currentLabel = "Bestsellers!";
    applyFilters();
  });
}

fetchProducts();