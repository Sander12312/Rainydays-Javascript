'use strict';
const apiCart = "rainydays_cart_v1";

//---State---
let allProducts = [];
let currentGender = "all";
let currentTag = "all";
let currentLabel = "Bestsellers!";

//---DOM---
const container = document.querySelector(".card-container") ;
const mainNav = document.querySelector(".main-nav");
const heading = document.querySelector("main h2");


//---functions---
//--- The Cart---
function getCart() {
  const storedCart = localStorage.getItem(apiKey) ;
  return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(apiCart, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  const price = Math.round(product.price);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Math.round(price),
      image: product.image?.url || "",
      quantity: 1
    });
  }
  saveCart(cart);
}
function showLoading() {
  container.innerHTML = "Loading products..." ;
}

function showError(message) {
  container.innerHTML = `Error: ${message}`;
}

//--- Product cards---
function makeProductsCard(list) {
  container.innerHTML = "";

  list.forEach(product => {
    const price = product.price;
    container.innerHTML += `
      <div class="card">
        <a href="product/index.html?id=${product.id}" class="jacket">
          <img src="${product.image?.url || ""}" alt="${product.title}" class="jacket">
        </a>
        <div class="card-content">
          <h3>${product.title}</h3>
          <p class="price">${price} NOK</p>
          <button class="card-button" data-id="${product.id}">Buy now</button>
        </div>
      </div>
    `;
  }) ;

//---Event listeners---
//--- Add to cart button---
  document.querySelectorAll(".card-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = allProducts.find(product => product.id === btn.dataset.id);
      addToCart(product);
      cardButton.textContent = "Added!" ;
      cardButton.style.backgroundColor = "green";
    });
  });
}

//---initial loading---
//--- filter products by gender---
function applyFilters() {
  let ProductFilter = [...allProducts] ;
  if (currentGender !== "all") {
    ProductFilter = ProductFilter.filter((product) => (product.gender || "").toLowerCase() === currentGender);
  }
  updateHeading();
  makeProductsCard(ProductFilter);
}
//--- Uppdating the header
function updateHeading() {
  if (!heading) return;
  heading.textContent = currentLabel;
}

//--- Main navigation---
if (mainNav) {
  mainNav.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const buttonText = button.textContent.trim().toLowerCase();
    event.preventDefault();
    if (buttonText === "male" || buttonText === "female" ) {
      currentGender = buttonText;
      currentTag = "all";
      currentLabel = buttonText === "male" ? "Male jackets" : "Female jackets";
      applyFilters();
      return;
    }
    currentGender = "all";
    currentTag = "all";
    currentLabel = "Bestsellers!";
    applyFilters();
  });
}

//--- getting the products from the json file---
const apiUrl = "https://v2.api.noroff.dev/rainy-days";
async function fetchProducts() {
  showLoading();
  try {
    const response = await fetch(apiUrl) ;
    if (!response.ok) {
      throw new Error("response is not okay!"); 
    }
    const data = await response.json();
    allProducts = data.data;
    applyFilters();
  } catch (error) {
    showError(`failed to fetch the data`, error);
  }
}

fetchProducts();
