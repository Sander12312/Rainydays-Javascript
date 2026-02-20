'use strict';
const apiCart = "rainydays_cart_v1";
const container = document.querySelector(".cart-container");

//---Functions---
//---cart---
function getCart() {
  const storedCart = localStorage.getItem(apiCart
  );
  return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(apiCart, JSON.stringify(cart)) ;
}

function makeCart() {
  const cart = getCart();
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty. Please add some products</p>";
    return ;
  }
  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

//---the productcard---
    container.innerHTML += `
      <section class="cart-item" data-id="${item.id}">
        <div class="image">
          <img src="${item.image}" alt="${item.title}" class="image">
        </div>
        <div class="cartpage-info">
          <h3>${item.title}</h3>
          <h3>${item.price} NOK</h3>

          <select class="qty">
            ${[1,2,3,4,5].map(number =>
              `<option value="${number}" ${number === item.quantity ? "selected" : ""}>${number}</option>`
            ).join("")}
          </select>

          <button class="remove-items">X Remove</button>
        </div>
      </section>
    `;
  });
//---payment container ---
  container.innerHTML += `
    <div class="payment">
      <h3>Summary</h3>
      <p>Total: ${totalPrice.toFixed(2)} NOK</p>
      <a href="/checkout/confirmation/index.html">
        <button class="payment-button">Pay</button>
      </a>
    </div>
  `;

//---event listeners---

//--- remove itemss---
  container.querySelectorAll(".remove-items").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".cart-item").dataset.id ;
      saveCart(getCart().filter(item => item.id !== id));
      makeCart();
    });
  });
}
//---initial loading---
makeCart() ;