
document.addEventListener("DOMContentLoaded", function () {

    const featuredProducts =
        document.getElementById("featuredProducts");

    loadFeaturedProducts();

    async function loadFeaturedProducts() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/products"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load products"
                );
            }

            const products = data.products || [];

            const featured = products.filter(
                product =>
                    Number(product.featured) === 1 &&
                    String(product.status).toLowerCase() === "active"
            );

            displayFeaturedProducts(featured);

        } catch (error) {

            console.error(
                "Featured products error:",
                error
            );

            featuredProducts.innerHTML = `
                <p>Unable to load featured products.</p>
            `;
        }
    }

    function displayFeaturedProducts(products) {

        if (products.length === 0) {

            featuredProducts.innerHTML = `
                <p>No featured products available.</p>
            `;

            return;
        }

        featuredProducts.innerHTML = "";

        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className = "product-card";

            const imagePath =
                product.image
                    ? product.image
                    : "images/placeholder.jpg";

            const price =
                product.discount_price !== null
                    ? Number(product.discount_price)
                    : Number(product.price);

            card.innerHTML = `

                <img
                    src="${imagePath}"
                    alt="${product.product_name}"
                    onerror="this.src='images/placeholder.jpg'"
                >

                <h3>
                    ${product.product_name}
                </h3>

                <p>
                    KSh ${price.toFixed(2)}
                </p>

                <button
                    class="add-to-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            `;

            featuredProducts.appendChild(card);

        });

        document
            .querySelectorAll(".add-to-cart")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            Number(this.dataset.id);

                        addToCart(productId, products);

                    }
                );

            });
    }

    function addToCart(productId, products) {

        const product =
            products.find(
                item => Number(item.id) === productId
            );

        if (!product) {
            return;
        }

        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        const existing =
            cart.find(
                item =>
                    Number(item.product_id) === productId
            );

        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({

                product_id: product.id,
                product_name: product.product_name,
                price:
                    product.discount_price !== null
                        ? Number(product.discount_price)
                        : Number(product.price),
                image: product.image,
                quantity: 1

            });

        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        alert(
            `${product.product_name} added to cart`
        );
    }

});