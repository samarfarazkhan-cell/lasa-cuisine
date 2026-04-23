console.log("JS FILE LOADED");

// ===== CART =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== FOOD DATA =====
let foods = [];
async function loadFoods() {
    let container = document.getElementById("food-container");
    container.innerHTML = "Loading...";

    try {
        let res = await fetch("http://localhost:8080/foods");
        foods = await res.json();

        container.innerHTML = "";

        foods.forEach(food => {
            let card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="http://localhost:8080${food.image}"
                     style="width:100%; height:150px; object-fit:cover; border-radius:10px;">

                <h3>${food.name}</h3>
                <p>₹${food.price}</p>

                <div class="qty">
                    <button onclick="decreaseQty('${food.name}')">➖</button>
                    <span id="qty-${food.name}">0</span>
                    <button onclick="increaseQty('${food.name}', ${food.price})">➕</button>
                </div>
            `;

            container.appendChild(card);
        });

        updateUI();

    } catch {
        container.innerHTML = "❌ Backend error";
    }
}
// ===== INCREASE =====
function increaseQty(name, price) {
    let item = cart.find(i => i.item === name);

    if (item) {
        item.qty += 1;
    } else {
        cart.push({ item: name, price: price, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateUI();
}

// ===== DECREASE =====
function decreaseQty(name) {
    let item = cart.find(i => i.item === name);

    if (item) {
        item.qty -= 1;

        if (item.qty <= 0) {
            cart = cart.filter(i => i.item !== name);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateUI();
}

// ===== UPDATE UI =====
function updateUI() {
    foods.forEach(food => {
        let el = document.getElementById(`qty-${food.name}`);
        let item = cart.find(i => i.item === food.name);

        if (el) {
            el.innerText = item ? item.qty : 0;
        }
    });
}

// ===== CART COUNT =====
function updateCartCount() {
    let cartCount = document.getElementById("cart-count");
    if (cartCount) {
        let total = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.innerText = total;
    }
}

// ===== SEARCH =====
function searchFood() {
    let input = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "" : "none";
    });
}

// ===== DARK MODE =====
function toggleDark() {
    console.log("clicked"); // debug

    document.body.classList.toggle("dark");

    let btn = document.getElementById("darkBtn");

    if (document.body.classList.contains("dark")) {
        btn.innerText = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        btn.innerText = "🌙";
        localStorage.setItem("theme", "light");
    }
}

// load theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// ===== INIT =====
loadFoods();
updateCartCount();
