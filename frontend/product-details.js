// ======================================
// PRODUCT DETAILS
// ======================================

// Images

const mainImage =
document.getElementById("mainImage");

const thumbnails =
document.querySelectorAll(".thumb");

thumbnails.forEach(image=>{

    image.addEventListener("click",()=>{

        mainImage.src = image.src;

        thumbnails.forEach(img=>{

            img.classList.remove("active");

        });

        image.classList.add("active");

    });

});

// ======================================
// QUANTITY
// ======================================

const quantity =
document.getElementById("quantity");

document.getElementById("plus")

.addEventListener("click",()=>{

    quantity.value++;

});

document.getElementById("minus")

.addEventListener("click",()=>{

    if(quantity.value > 1){

        quantity.value--;

    }

});

// ======================================
// ADD TO CART
// ======================================

document.getElementById("addCart")

.addEventListener("click",()=>{

    let cart =

    JSON.parse(

    localStorage.getItem("cart")

    ) || [];

    const product={

        id:1,

        name:document.getElementById("productName").innerText,

        price:Number(

            document.getElementById("productPrice")

            .innerText

            .replace("KSh","")

            .replace(",","")

            .trim()

        ),

        quantity:Number(quantity.value),

        image:mainImage.src

    };

    const existing=

    cart.find(item=>item.id===product.id);

    if(existing){

        existing.quantity+=product.quantity;

    }

    else{

        cart.push(product);

    }

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    alert("Product added to cart.");

});

// ======================================
// WISHLIST
// ======================================

document.getElementById("addWishlist")

.addEventListener("click",()=>{

    let wishlist=

    JSON.parse(

    localStorage.getItem("wishlist")

    ) || [];

    const product={

        id:1,

        name:document.getElementById("productName").innerText,

        price:Number(

            document.getElementById("productPrice")

            .innerText

            .replace("KSh","")

            .replace(",","")

            .trim()

        ),

        image:mainImage.src

    };

    if(!wishlist.find(item=>item.id===product.id)){

        wishlist.push(product);

    }

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

    alert("Added to wishlist ❤️");

});

// ======================================
// BUY NOW
// ======================================

document.getElementById("buyNow")

.addEventListener("click",()=>{

    window.location.href=

    "checkout.html";

});

// ======================================
// LOGOUT
// ======================================

const logout=document.querySelector(

'a[href="login.html"]'

);

logout.addEventListener("click",(e)=>{

    e.preventDefault();

    if(confirm("Are you sure you want to logout?")){

        window.location.href=

        "login.html";

    }

});

console.log("Product Details Loaded Successfully");