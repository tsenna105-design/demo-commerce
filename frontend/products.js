// ======================================
// PRODUCTS PAGE
// ======================================

const API_URL = "http://localhost:5000/api/products";
const STORAGE_KEY = "cart";

// ======================================
// HTML ELEMENTS
// ======================================

const searchInput = document.getElementById("searchInput");
const productGrid = document.querySelector(".product-grid");
const categoryButtons = document.querySelectorAll(".category-btn");

// ======================================
// CART
// ======================================

let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ======================================
// LOAD PRODUCTS FROM BACKEND
// ======================================

let products = [];

async function loadProducts() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        if (!data.success) {

            alert("Failed to load products.");

            return;
        }

        products = data.products;

        displayProducts(products);

    } catch (error) {

        console.error("Error loading products:", error);

        alert(
            "Unable to connect to the server. Make sure the backend is running."
        );

    }

}

// ======================================
// DISPLAY PRODUCTS
// ======================================

function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p>No products found.</p>
        `;

        return;
    }

    productList.forEach(product => {

        const price =
            product.discount_price !== null
                ? product.discount_price
                : product.price;
const image = product.image
    ? `images/${product.image.split("/").pop()}`
    : "https://via.placeholder.com/180"
        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <img
                src="${image}"
                alt="${product.product_name}"
            >

            <h3>${product.product_name}</h3>

            <p class="category">
                ${getCategoryName(product.category_id)}
            </p>

            <p class="price">
                KSh ${Number(price).toFixed(2)}
            </p>

            <button class="add-to-cart">
                Add To Cart
            </button>

        `;

        // Add To Cart button

        const addButton =
            card.querySelector(".add-to-cart");

        addButton.addEventListener("click", function(event) {

            event.stopPropagation();

            addToCart(product);

        });

        productGrid.appendChild(card);

    });

}

// ======================================
// CATEGORY NAMES
// ======================================

function getCategoryName(categoryId) {

    const categories = {

        1: "Spray",
        2: "Bakery",
        3: "Dairy",
        4: "Groceries",
        5: "Electronics"

    };

    return categories[categoryId] || "Other";

}

// ======================================
// ADD TO CART
// ======================================

function addToCart(product) {

    const existingProduct =
        cart.find(item => item.product_id === product.id);

    const price =
        product.discount_price !== null
            ? Number(product.discount_price)
            : Number(product.price);

    // Product already exists

    if (existingProduct) {

        existingProduct.quantity++;

    }

    // New product

    else {

        cart.push({

            product_id: product.id,

            name: product.product_name,

            price: price,

            quantity: 1

        });

    }

    // Save cart

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
    );

    alert(
        product.product_name +
        " added to cart."
    );

}

// ======================================
// SEARCH
// ======================================

searchInput.addEventListener("keyup", function() {

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const filteredProducts =
        products.filter(product => {

            return product.product_name
                .toLowerCase()
                .includes(searchValue);

        });

    displayProducts(filteredProducts);

});

// ======================================
// CATEGORY FILTER
// ======================================

categoryButtons.forEach(button => {

    button.addEventListener("click", function() {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const selectedCategory =
            button.textContent.toLowerCase().trim();

        if (selectedCategory === "all") {

            displayProducts(products);

            return;

        }

        const filteredProducts =
            products.filter(product => {

                return getCategoryName(product.category_id)
                    .toLowerCase() === selectedCategory;

            });

        displayProducts(filteredProducts);

    });

});

// ======================================
// LOGOUT
// ======================================

const logoutBtn =
    document.querySelector('a[href="login.html"]');

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(event) {

        event.preventDefault();

        const answer =
            confirm("Are you sure you want to logout?");

        if (answer) {

            window.location.href = "login.html";

        }

    });

}

// ======================================
// LOAD PAGE
// ======================================

loadProducts();

console.log(
    "Products Page Loaded Successfully!"
);