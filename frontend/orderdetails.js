
document.addEventListener("DOMContentLoaded", function () {

    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");
    const orderContent = document.getElementById("orderContent");
    const orderItems = document.getElementById("orderItems");
    const backBtn = document.getElementById("backBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");
    const orderId = localStorage.getItem("selectedOrderId");

    if (!token) {
        alert("Please login to view your order.");
        window.location.href = "login.html";
        return;
    }

    if (!orderId) {
        alert("No order selected.");
        window.location.href = "orders.html";
        return;
    }

    loadOrder(orderId);

    async function loadOrder(id) {

        try {

            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load order."
                );
            }

            displayOrder(data.order, data.items);

        } catch (error) {

            console.error("Order details error:", error);

            loading.style.display = "none";

            errorMessage.textContent =
                error.message || "Failed to load order.";

            errorMessage.style.display = "block";
        }
    }

    function displayOrder(order, items) {

        loading.style.display = "none";
        orderContent.style.display = "block";

        const orderStatus = String(
            order.order_status || "pending"
        ).toLowerCase();

        const paymentStatus = String(
            order.payment_status || "pending"
        ).toLowerCase();

        updateDeliveryProgress(orderStatus);

        document.getElementById("orderNumber").textContent =
            `Order #${order.id}`;

        document.getElementById("orderDate").textContent =
            new Date(order.created_at).toLocaleString();

        const orderStatusElement =
            document.getElementById("orderStatus");

        orderStatusElement.textContent = orderStatus;

        orderStatusElement.className =
            `status-${orderStatus}`;

        document.getElementById("paymentMethod").textContent =
            order.payment_method || "N/A";

        const paymentStatusElement =
            document.getElementById("paymentStatus");

        paymentStatusElement.textContent =
            paymentStatus;

        paymentStatusElement.className =
            `status-${paymentStatus}`;

        orderItems.innerHTML = "";

        if (!items || items.length === 0) {

            orderItems.innerHTML = `
                <tr>
                    <td colspan="4">
                        No products found for this order.
                    </td>
                </tr>
            `;

        } else {

            items.forEach(item => {

                const quantity =
                    Number(item.quantity) || 0;

                const price =
                    Number(item.price) || 0;

                const total =
                    quantity * price;

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>
                        <div class="product-info">

                            <img
                                src="${
                                    item.image ||
                                    "https://via.placeholder.com/55"
                                }"
                                alt="${item.product_name}"
                            >

                            <span class="product-name">
                                ${item.product_name}
                            </span>

                        </div>
                    </td>

                    <td>
                        ${quantity}
                    </td>

                    <td>
                        KSh ${price.toFixed(2)}
                    </td>

                    <td>
                        KSh ${total.toFixed(2)}
                    </td>
                `;

                orderItems.appendChild(row);
            });
        }

        document.getElementById("subtotal").textContent =
            `KSh ${Number(order.subtotal || 0).toFixed(2)}`;

        document.getElementById("shipping").textContent =
            `KSh ${Number(order.shipping_fee || 0).toFixed(2)}`;

        document.getElementById("grandTotal").textContent =
            `KSh ${Number(order.total || 0).toFixed(2)}`;
    }

    function updateDeliveryProgress(status) {

        const steps = [
            "pending",
            "processing",
            "shipped",
            "delivered"
        ];

        const currentIndex =
            steps.indexOf(status);

        document
            .querySelectorAll(".progress-step")
            .forEach(step => {

                step.classList.remove("completed");
                step.classList.remove("current");

                const stepStatus =
                    step.dataset.status;

                const stepIndex =
                    steps.indexOf(stepStatus);

                if (
                    currentIndex !== -1 &&
                    stepIndex < currentIndex
                ) {
                    step.classList.add("completed");
                }

                if (
                    stepIndex === currentIndex
                ) {
                    step.classList.add("current");
                }
            });

        const progressLine =
            document.querySelector(".progress-line");

        if (progressLine) {

            progressLine.classList.remove("completed");

            if (currentIndex > 0) {
                progressLine.classList.add("completed");
            }
        }
    }

    backBtn.addEventListener("click", function () {
        window.location.href = "orders.html";
    });

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedOrderId");

        window.location.href = "login.html";
    });

});