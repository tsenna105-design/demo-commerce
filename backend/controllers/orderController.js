const { createOrder } = require("../models/orderModel");

const placeOrder = (req, res) => {
    const {
        user_id,
        subtotal,
        shipping_fee,
        total,
        payment_method,
        items
    } = req.body;

    if (
        !user_id ||
        !items ||
        items.length === 0 ||
        !payment_method
    ) {
        return res.status(400).json({
            success: false,
            message: "Missing required order details"
        });
    }

    createOrder(
        {
            user_id,
            subtotal,
            shipping_fee,
            total,
            payment_method,
            items
        },
        (err, orderId) => {
            if (err) {
                console.error("Error creating order:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create order"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                order_id: orderId
            });
        }
    );
};

module.exports = { placeOrder };