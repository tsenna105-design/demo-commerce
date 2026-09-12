// ======================================
// WISHLIST PAGE
// ======================================

// Storage Keys
const WISHLIST_KEY = "wishlist";
const CART_KEY = "cart";

// Load Data
let wishlist =
JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

let cart =
JSON.parse(localStorage.getItem(CART_KEY)) || [];

// HTML Elements
const wishlistGrid =
document.getElementById("wishlistGrid");

const searchWishlist =
document.getElementById("searchWishlist");

// ======================================
// DISPLAY WISHLIST
// ======================================

function displayWishlist(products = wishlist){

    wishlistGrid.innerHTML = "";

    if(products.length === 0){

        wishlistGrid.innerHTML = `

            <div class="empty-message">

                <h2>❤ Your Wishlist is Empty</h2>

                <p>Add products you love to your wishlist.</p>

            </div>

        `;

        return;

    }

    products.forEach((product,index)=>{

        wishlistGrid.innerHTML += `

        <div class="wishlist-card">

            <img
            src="${product.image}"
            alt="${product.name}">

            <h3>${product.name}</h3>

            <p>KSh ${product.price.toFixed(2)}</p>

            <div class="buttons">

                <button
                class="cart-btn"
                onclick="addToCart(${index})">

                    <i class="fas fa-cart-plus"></i>

                    Add to Cart

                </button>

                <button
                class="remove-btn"
                onclick="removeWishlist(${index})">

                    <i class="fas fa-trash"></i>

                    Remove

                </button>

            </div>

        </div>

        `;

    });

}

displayWishlist();

// ======================================
// SEARCH
// ======================================

searchWishlist.addEventListener("keyup",function(){

    const value =
    searchWishlist.value.toLowerCase();

    const filtered =
    wishlist.filter(product=>{

        return product.name
        .toLowerCase()
        .includes(value);

    });

    displayWishlist(filtered);

});

// ======================================
// ADD TO CART
// ======================================

function addToCart(index){

    const product = wishlist[index];

    const existing =
    cart.find(item=>item.id===product.id);

    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            ...product,

            quantity:1

        });

    }

    localStorage.setItem(

        CART_KEY,

        JSON.stringify(cart)

    );

    alert(product.name + " added to cart.");

}

// ======================================
// REMOVE FROM WISHLIST
// ======================================

function removeWishlist(index){

    const answer =
    confirm("Remove this item from wishlist?");

    if(answer){

        wishlist.splice(index,1);

        localStorage.setItem(

            WISHLIST_KEY,

            JSON.stringify(wishlist)

        );

        displayWishlist();

    }

}

// ======================================
// LOGOUT
// ======================================

const logout =
document.querySelector(
'a[href="../login/login.html"]'
);

logout.addEventListener("click",function(event){

    event.preventDefault();

    const answer =
    confirm("Are you sure you want to logout?");

    if(answer){

        window.location.href =
        "../login/login.html";

    }

});

// ======================================
// PAGE READY
// ======================================

console.log("Wishlist Loaded Successfully");