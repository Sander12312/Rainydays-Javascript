"use strict";

const apiUrl = "https://v2.api.noroff.dev/rainy-days";
const apiCart = "rainydays_cart_v1";

// --- Cart ---
function getCart() {
  const storedCart = localStorage.getItem(apiCart);
  if (storedCart) {
    return JSON.parse(storedCart);
  }
  return [];
}

function saveCart(cart) {
  localStorage.setItem(apiCart, JSON.stringify(cart));
}

function addToCart(product, quantity) {
  const cart = getCart();
  let existing = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      existing = cart[i];
    }
  }
  if (existing) {
    existing.quantity += quantity;
  } else {
    let imageUrl = "";
    if (product.image && product.image.url) {
      imageUrl = product.image.url;
    } cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imageUrl,
      quantity: quantity
    });
  }

  saveCart(cart);
}

// --- Geting id from URL ---
function getId() {
  const text = window.location.search;
  if (!text) return null;
  const value = text.split("=");
  if (value.length > 1) return value[1];
  return null;
}

async function fetchProduct(id) {
  const response = await fetch(apiUrl + "/" + id);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const data = await response.json();
  return data.data;
}

async function getProductInfoPage() {
  const id = getId();
  const title = document.querySelector(".productinfo-heading");
  const description = document.querySelector(".productinfo p");
  const img = document.querySelector(".productinfo-image img");
  const addButton = document.querySelector("button.add");
  const quantitySelect = document.querySelector("#number");
  if (!id) {
    title.textContent = "Product not found";
    return;
  }
  try {
    const product = await fetchProduct(id);
    title.textContent = product.title;
    description.textContent = product.description;
    if (product.image && product.image.url) {
      img.src = product.image.url;
    } else {
      img.src = "";
    }
    addButton.addEventListener("click", function () {
      let qty = 1;
      if (quantitySelect && quantitySelect.value) {
        qty = Number(quantitySelect.value);
      }
      addToCart(product, qty);
      addButton.textContent = "Added!";
      addButton.style.backgroundColor = "green";
    });
  } catch (error) {
    title.textContent = "Error loading product";
  }
}

// --- Initial loading ---
getProductInfoPage();