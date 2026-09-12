const db = require("../config/db");

const createOrder = (orderData, callback) => {
    const {
        user_id,
        subtotal,
        shipping_fee,
        total,
        payment_method,
        items
    } = orderData;

    const orderSql = `
        INSERT INTO orders
        (user_id, subtotal, shipping_fee, total, payment_method, payment_status, order_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        orderSql,
        [
            user_id,
            subtotal,
            shipping_fee,
            total,
            payment_method,
            "pending",
            "pending"
        ],
        (err, result) => {
            if (err) {
                return callback(err);
            }

            const orderId = result.insertId;

            const itemValues = items.map(item => [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ]);

            const itemSql = `
                INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES ?
            `;

            db.query(itemSql, [itemValues], (err) => {
                if (err) {
                    return callback(err);
                }

                callback(null, orderId);
            });
        }
    );
};

module.exports = { createOrder };