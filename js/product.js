const BASE_URL = "https://v2.api.noroff.dev/rainy-days";
const CART_KEY = "rainydays_cart_v1";

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product, quantity) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  const price = product.discountedPrice || product.price;

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: price,
      image: product.image?.url || "",
      quantity: quantity
    });
  }

  saveCart(cart);
}

function getId() {
  return new URLSearchParams(window.location.search).get("id");
}

async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  const json = await res.json();
  return json.data;
}

async function init() {
  const id = getId();

  const titleEl = document.querySelector(".productinfo-heading");
  const descEl = document.querySelector(".productinfo p");
  const imgEl = document.querySelector(".productinfo-image img");
  const addBtn = document.querySelector("button.add");
  const qtySelect = document.querySelector("#number");

  if (!id) {
    titleEl.textContent = "Product not found";
    return;
  }

  try {
    const product = await fetchProduct(id);

    titleEl.textContent = product.title;
    descEl.textContent = product.description;
    imgEl.src = product.image?.url || "";

    addBtn.addEventListener("click", () => {
      const qty = Number(qtySelect?.value || 1);
      addToCart(product, qty);
      addBtn.textContent = "Added!";
      setTimeout(() => addBtn.textContent = "Add", 800);
    });
  } catch (error) {
    titleEl.textContent = "Error loading product";
  }
}

init();