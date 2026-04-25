console.log("JS FILE LOADED");

// ===== CART =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== FOOD DATA =====
let foods = [];

// 🔹 helper (safe id)
function getId(name){
    return name.replaceAll(" ","_");
}

// ===== LOAD FOODS =====
async function loadFoods() {
    let container = document.getElementById("food-container");

    container.innerHTML = "<p style='text-align:center;'>Loading 🍽️...</p>";

    try {
        let res = await fetch("http://localhost:8080/foods");

        if(!res.ok) throw new Error("Server error");

        foods = await res.json();

        renderFoods(foods);

    } catch (err) {
        container.innerHTML = "<p style='color:red;text-align:center;'>❌ Backend not running</p>";
        console.error(err);
    }
}

// ===== RENDER =====
function renderFoods(list){
    let container = document.getElementById("food-container");
    container.innerHTML = "";

    list.forEach(food => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="http://localhost:8080${food.image}"
                 style="width:100%; height:150px; object-fit:cover; border-radius:10px;">

            <h3>${food.name}</h3>
            <p>₹${food.price}</p>

            <div class="qty">
                <button onclick="decreaseQty('${food.name}')">➖</button>
                <span id="qty-${getId(food.name)}">0</span>
                <button onclick="increaseQty('${food.name}', ${food.price})">➕</button>
            </div>
        `;

        container.appendChild(card);
    });

    updateUI();
}

// ===== INCREASE =====
function increaseQty(name, price) {
    let item = cart.find(i => i.item === name);

    if (item) item.qty++;
    else cart.push({ item: name, price, qty: 1 });

    saveCart();
}

// ===== DECREASE =====
function decreaseQty(name) {
    let item = cart.find(i => i.item === name);

    if (item) {
        item.qty--;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.item !== name);
        }
    }

    saveCart();
}

// ===== SAVE =====
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateUI();
}

// ===== UPDATE UI =====
function updateUI() {
    foods.forEach(food => {
        let el = document.getElementById(`qty-${getId(food.name)}`);
        let item = cart.find(i => i.item === food.name);

        if (el) el.innerText = item ? item.qty : 0;
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

// ===== SEARCH (DATA BASED) =====
function searchFood(value) {
    let filtered = foods.filter(f =>
        f.name.toLowerCase().includes(value.toLowerCase())
    );

    renderFoods(filtered);
}

// 🔹 debounce (smooth typing)
let timer;
function handleSearch(){
    clearTimeout(timer);

    timer = setTimeout(()=>{
        let val = document.getElementById("search").value;
        searchFood(val);
    },300);
}

// ===== DARK MODE =====
function toggleDark() {
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

// 🔹 Load theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// ===== INIT =====
loadFoods();
updateCartCount();