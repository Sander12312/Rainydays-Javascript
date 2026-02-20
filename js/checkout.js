const CART_KEY = "rainydays_cart_v1";
const container = document.querySelector(".cart-container");

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <section class="cart-item" data-id="${item.id}">
        <div class="image">
          <img src="${item.image}" alt="${item.title}" class="image">
        </div>
        <div class="cartpage-info">
          <h3>${item.title}</h3>
          <h3>${item.price} NOK</h3>

          <select class="qty">
            ${[1,2,3,4,5].map(n =>
              `<option value="${n}" ${n === item.quantity ? "selected" : ""}>${n}</option>`
            ).join("")}
          </select>

          <button class="remove-items">X Remove</button>
        </div>
      </section>
    `;
  });

  container.innerHTML += `
    <div class="payment">
      <h3>Summary</h3>
      <p>Total: ${total} NOK</p>
      <a href="/checkout/confirmation/index.html">
        <button class="payment-button">Pay</button>
      </a>
    </div>
  `;

  container.querySelectorAll(".remove-items").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".cart-item").dataset.id;
      saveCart(getCart().filter(item => item.id !== id));
      renderCart();
    });
  });

  container.querySelectorAll(".qty").forEach(select => {
    select.addEventListener("change", e => {
      const id = e.target.closest(".cart-item").dataset.id;
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      item.quantity = Number(e.target.value);
      saveCart(cart);
      renderCart();
    });
  });
}

renderCart();