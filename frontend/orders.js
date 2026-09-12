const token = localStorage.getItem("token");

if (!token) {
    alert("Please login to view your orders.");
    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", function () {
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");
    const emptyOrders = document.getElementById("emptyOrders");
    const ordersContainer = document.getElementById("ordersContainer");
    const logoutBtn = document.getElementById("logoutBtn");

    const userData = localStorage.getItem("user");

    if (!userData) {
        alert("Please login to view your orders.");
        window.location.href = "login.html";
        return;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    if (!user || !user.id) {
        alert("Invalid user session. Please login again.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    loadOrders(user.id);

    async function loadOrders(userId) {
        try {
            const response = await fetch(
                "http://localhost:5000/api/orders/user",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            loading.style.display = "none";

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to load orders.");
            }

            if (!data.orders || data.orders.length === 0) {
                emptyOrders.style.display = "block";
                return;
            }

            displayOrders(data.orders);

        } catch (error) {
            console.error("Order history error:", error);

            loading.style.display = "none";
            errorMessage.textContent =
                "Failed to load your orders: " + error.message;
            errorMessage.style.display = "block";
        }
    }

    function displayOrders(orders) {
        ordersContainer.innerHTML = "";

        orders.forEach(order => {
            const orderCard = document.createElement("div");
            orderCard.className = "order-card";

            const orderDate = new Date(order.created_at).toLocaleString();

            const orderStatus = String(
                order.order_status || "pending"
            ).toLowerCase();

            const paymentStatus = String(
                order.payment_status || "pending"
            ).toLowerCase();

            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-number">
                            Order #${order.id}
                        </div>
                        <div class="order-date">
                            ${orderDate}
                        </div>
                    </div>

                    <span class="status ${orderStatus}">
                        ${orderStatus}
                    </span>
                </div>

                <div class="order-details">

                    <div class="detail-box">
                        <span>Subtotal</span>
                        <strong>
                            KSh ${Number(order.subtotal || 0).toFixed(2)}
                        </strong>
                    </div>

                    <div class="detail-box">
                        <span>Shipping</span>
                        <strong>
                            KSh ${Number(order.shipping_fee || 0).toFixed(2)}
                        </strong>
                    </div>

                    <div class="detail-box">
                        <span>Payment Method</span>
                        <strong>
                            ${order.payment_method || "N/A"}
                        </strong>
                    </div>

                    <div class="detail-box">
                        <span>Payment Status</span>
                        <strong>
                            ${paymentStatus}
                        </strong>
                    </div>

                </div>

                <div class="order-footer">
                    <div class="total">
                        Total: KSh ${Number(order.total || 0).toFixed(2)}
                    </div>

                    <button
                        class="view-btn"
                        data-order-id="${order.id}"
                    >
                        View Details
                    </button>
                </div>
            `;

            ordersContainer.appendChild(orderCard);
        });

        document.querySelectorAll(".view-btn").forEach(button => {
            button.addEventListener("click", function () {
                const orderId = this.dataset.orderId;

                localStorage.setItem("selectedOrderId", orderId);

                window.location.href = "orderdetails.html";
            });
        });
    }

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
})