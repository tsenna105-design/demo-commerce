const STORAGE_KEY = "cart";

let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const orderItems = document.getElementById("orderItems");
const subtotalElement = document.getElementById("subtotal");
const vatElement = document.getElementById("vat");
const totalElement = document.getElementById("total");
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");
const paymentMethod = document.getElementById("paymentMethod");
const completeOrder = document.getElementById("completeOrder");

function displayOrder() {
    orderItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach(product => {
        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 0;
        const itemTotal = price * quantity;

        subtotal += itemTotal;

        orderItems.innerHTML += `
            <div class="order-item">
                <span>${product.name} × ${quantity}</span>
                <span>KSh ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    const vat = subtotal * 0.16;
    const grandTotal = subtotal + vat;

    subtotalElement.textContent = "KSh " + subtotal.toFixed(2);
    vatElement.textContent = "KSh " + vat.toFixed(2);
    totalElement.textContent = "KSh " + grandTotal.toFixed(2);
}

displayOrder();

completeOrder.addEventListener("click", async () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    if (customerName.value.trim() === "") {
        alert("Enter customer name.");
        customerName.focus();
        return;
    }

    if (customerEmail.value.trim() === "") {
        alert("Enter customer email.");
        customerEmail.focus();
        return;
    }

    if (customerPhone.value.trim() === "") {
        alert("Enter customer phone number.");
        customerPhone.focus();
        return;
    }

    if (paymentMethod.value === "") {
        alert("Select a payment method.");
        paymentMethod.focus();
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        alert("Please login before completing your order.");
        window.location.href = "login.html";
        return;
    }

    completeOrder.disabled = true;
    completeOrder.textContent = "Processing Order...";

    try {

        const token = localStorage.getItem("token");

if (!token) {
    alert("Please login before completing your order.");
    window.location.href = "login.html";
    return;
}
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: user.id,
                payment_method: paymentMethod.value,
                cart: cart.map(product => ({
                    product_id: product.product_id,
                    quantity: product.quantity,
                    price: Number(product.price)
                }))
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to create order.");
        }

        let subtotal = 0;

        cart.forEach(product => {
            const price = Number(product.price) || 0;
            const quantity = Number(product.quantity) || 0;

            subtotal += price * quantity;
        });

        const vat = subtotal * 0.16;
        const total = subtotal + vat;

        const receipt = {
            receiptNumber: "RCPT" + Date.now(),
            order_id: data.order_id,
            date: new Date().toLocaleString(),
            customerName: customerName.value.trim(),
            customerEmail: customerEmail.value.trim(),
            customerPhone: customerPhone.value.trim(),
            paymentMethod: paymentMethod.value,
            items: cart,
            subtotal: subtotal,
            vat: vat,
            total: total
        };

        localStorage.setItem("receipt", JSON.stringify(receipt));
        localStorage.removeItem(STORAGE_KEY);

        alert("Order Completed Successfully!");

        window.location.href = "receipt.html";

    } catch (error) {
        console.error("Order Error:", error);

        alert("Failed to complete order: " + error.message);

        completeOrder.disabled = false;
        completeOrder.textContent = "Complete Order";
    }
});