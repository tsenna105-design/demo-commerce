// ========================================
// CART PAGE
// ========================================

// Local Storage Key
const STORAGE_KEY = "cart";

// ========================================
// LOAD CART
// ========================================

let cart =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const cartBody =
    document.getElementById("cartBody");

const subtotalElement =
    document.getElementById("subtotal");

const vatElement =
    document.getElementById("vat");

const discountElement =
    document.getElementById("discount");

const grandTotalElement =
    document.getElementById("grandTotal");

const cartCount =
    document.getElementById("cartCount");

// ========================================
// DISPLAY CART
// ========================================

function displayCart() {

    cartBody.innerHTML = "";

    let subtotal = 0;

    let totalItems = 0;

    // ====================================
    // EMPTY CART
    // ====================================

    if (cart.length === 0) {

        cartBody.innerHTML = `

            <tr>

                <td colspan="5">

                    Your cart is empty.

                </td>

            </tr>

        `;

    }

    // ====================================
    // DISPLAY PRODUCTS
    // ====================================

    cart.forEach(function (product, index) {

        const total =
            product.price * product.quantity;

        subtotal += total;

        totalItems += product.quantity;

        cartBody.innerHTML += `

            <tr>

                <td>

                    ${product.name}

                </td>

                <td>

                    KSh ${product.price.toFixed(2)}

                </td>

                <td>

                    <div class="quantity">

                        <button
                            onclick="decreaseQuantity(${index})">
                            -
                        </button>

                        <span>
                            ${product.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                </td>

                <td>

                    KSh ${total.toFixed(2)}

                </td>

                <td>

                    <button
                        class="remove-btn"
                        onclick="removeProduct(${index})">

                        Remove

                    </button>

                </td>

            </tr>

        `;

    });

    // ====================================
    // CALCULATE TOTALS
    // ====================================

    const vat =
        subtotal * 0.16;

    const discount = 0;

    const grandTotal =
        subtotal + vat - discount;

    // ====================================
    // UPDATE SUMMARY
    // ====================================

    subtotalElement.textContent =
        "KSh " + subtotal.toFixed(2);

    vatElement.textContent =
        "KSh " + vat.toFixed(2);

    discountElement.textContent =
        "KSh " + discount.toFixed(2);

    grandTotalElement.textContent =
        "KSh " + grandTotal.toFixed(2);

    cartCount.textContent =
        totalItems;

    // ====================================
    // SAVE CART
    // ====================================

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
    );

}

// ========================================
// INCREASE QUANTITY
// ========================================

function increaseQuantity(index) {

    cart[index].quantity++;

    displayCart();

}

// ========================================
// DECREASE QUANTITY
// ========================================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }

    displayCart();

}

// ========================================
// REMOVE PRODUCT
// ========================================

function removeProduct(index) {

    const answer =
        confirm(
            "Remove this product from cart?"
        );

    if (answer) {

        cart.splice(index, 1);

        displayCart();

    }

}

// ========================================
// CONTINUE SHOPPING
// ========================================

const continueShopping =
    document.getElementById("continueShopping");

if (continueShopping) {

    continueShopping.addEventListener(
        "click",
        function () {

            window.location.href =
                "products.html";

        }
    );

}

// ========================================
// CHECKOUT
// ========================================

const checkout =
    document.getElementById("checkout");

if (checkout) {

    checkout.addEventListener(
        "click",
        function (event) {

            if (cart.length === 0) {

                event.preventDefault();

                alert(
                    "Your cart is empty."
                );

                return;

            }

            window.location.href =
                "checkout.html";

        }
    );

}

// ========================================
// LOGOUT
// ========================================

const logout =
    document.querySelector(
        'a[href="login.html"]'
    );

if (logout) {

    logout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const answer =
                confirm(
                    "Are you sure you want to logout?"
                );

            if (answer) {

                window.location.href =
                    "login.html";

            }

        }
    );

}

// ========================================
// START CART
// ========================================

displayCart();

console.log(
    "Cart Loaded Successfully",
    cart
);