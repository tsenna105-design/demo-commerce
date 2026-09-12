
document.addEventListener("DOMContentLoaded", function () {

    const receiptData = localStorage.getItem("receipt");

    if (!receiptData) {
        alert("No receipt found.");
        window.location.href = "orders.html";
        return;
    }

    let receipt;

    try {
        receipt = JSON.parse(receiptData);
    } catch (error) {
        console.error("Receipt data error:", error);

        localStorage.removeItem("receipt");

        alert("Receipt data is invalid.");
        window.location.href = "orders.html";
        return;
    }

    if (!receipt || !receipt.order_id) {
        alert("Invalid receipt.");
        window.location.href = "orders.html";
        return;
    }

    displayReceipt(receipt);

    function displayReceipt(receipt) {

        const orderNumber = document.getElementById("orderNumber");

        if (orderNumber) {
            orderNumber.textContent = `#${receipt.order_id}`;
        }

        const orderDate = document.getElementById("orderDate");

        if (orderDate) {
            orderDate.textContent =
                receipt.date || new Date().toLocaleString();
        }

        const paymentMethod =
            document.getElementById("paymentMethod");

        if (paymentMethod) {
            paymentMethod.textContent =
                receipt.paymentMethod || "N/A";
        }

        const paymentStatus =
            document.getElementById("paymentStatus");

        if (paymentStatus) {
            paymentStatus.textContent = "Pending";
        }

        const receiptItems =
            document.getElementById("receiptItems");

        if (receiptItems) {

            receiptItems.innerHTML = "";

            if (!receipt.items || receipt.items.length === 0) {

                receiptItems.innerHTML = `
                    <p>No products found.</p>
                `;

            } else {

                receipt.items.forEach(item => {

                    const quantity =
                        Number(item.quantity) || 0;

                    const price =
                        Number(item.price) || 0;

                    const itemTotal =
                        quantity * price;

                    const itemElement =
                        document.createElement("div");

                    itemElement.className =
                        "receipt-item";

                    itemElement.innerHTML = `
                        <div class="item-details">

                            <strong>
                                ${item.name || "Product"}
                            </strong>

                            <span>
                                ${quantity} × KSh ${price.toFixed(2)}
                            </span>

                        </div>

                        <strong>
                            KSh ${itemTotal.toFixed(2)}
                        </strong>
                    `;

                    receiptItems.appendChild(itemElement);
                });
            }
        }

        const subtotal =
            Number(receipt.subtotal) || 0;

        const vat =
            Number(receipt.vat) || 0;

        const total =
            Number(receipt.total) || 0;

        const subtotalElement =
            document.getElementById("subtotal");

        if (subtotalElement) {
            subtotalElement.textContent =
                `KSh ${subtotal.toFixed(2)}`;
        }

        const shippingElement =
            document.getElementById("shipping");

        if (shippingElement) {
            shippingElement.textContent =
                "KSh 0.00";
        }

        const vatElement =
            document.getElementById("vat");

        if (vatElement) {
            vatElement.textContent =
                `KSh ${vat.toFixed(2)}`;
        }

        const grandTotalElement =
            document.getElementById("grandTotal");

        if (grandTotalElement) {
            grandTotalElement.textContent =
                `KSh ${total.toFixed(2)}`;
        }
    }

    const printBtn =
        document.getElementById("printBtn");

    if (printBtn) {
        printBtn.addEventListener("click", function () {
            window.print();
        });
    }

    const ordersBtn =
        document.getElementById("ordersBtn");

    if (ordersBtn) {
        ordersBtn.addEventListener("click", function () {
            window.location.href = "orders.html";
        });
    }

    const homeBtn =
        document.getElementById("homeBtn");

    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            window.location.href = "home.html";
        });
    }

});

