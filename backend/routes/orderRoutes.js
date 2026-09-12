
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, (req, res) => {
    const { payment_method, cart } = req.body;
    const user_id = req.user.id;

    if (!payment_method) {
        return res.status(400).json({
            success: false,
            message: "Payment method is required"
        });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction error:", err);

            return res.status(500).json({
                success: false,
                message: "Could not start order transaction"
            });
        }

        const productIds = cart.map(item => item.product_id);

        const productSQL = `
            SELECT
                id,
                product_name,
                price,
                discount_price,
                stock
            FROM products
            WHERE id IN (?)
            FOR UPDATE
        `;

        db.query(productSQL, [productIds], (err, products) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({
                        success: false,
                        message: "Failed to check products"
                    });
                });
            }

            if (products.length !== cart.length) {
                return db.rollback(() => {
                    res.status(400).json({
                        success: false,
                        message: "One or more products no longer exist"
                    });
                });
            }

            let subtotal = 0;
            const orderItems = [];

            for (const item of cart) {
                const product = products.find(
                    p => Number(p.id) === Number(item.product_id)
                );

                if (!product) {
                    return db.rollback(() => {
                        res.status(400).json({
                            success: false,
                            message: "Product not found"
                        });
                    });
                }

                const quantity = Number(item.quantity);

                if (!Number.isInteger(quantity) || quantity <= 0) {
                    return db.rollback(() => {
                        res.status(400).json({
                            success: false,
                            message: "Invalid product quantity"
                        });
                    });
                }

                if (product.stock < quantity) {
                    return db.rollback(() => {
                        res.status(400).json({
                            success: false,
                            message: `${product.product_name} has only ${product.stock} item(s) left in stock`
                        });
                    });
                }

                const price = product.discount_price !== null
                    ? Number(product.discount_price)
                    : Number(product.price);

                const itemTotal = price * quantity;

                subtotal += itemTotal;

                orderItems.push([
                    product.id,
                    quantity,
                    price
                ]);
            }

            const shipping_fee = 0;
            const vat = subtotal * 0.16;
            const total = subtotal + shipping_fee + vat;

            const orderSQL = `
                INSERT INTO orders
                (
                    user_id,
                    address_id,
                    subtotal,
                    shipping_fee,
                    total,
                    payment_method,
                    payment_status,
                    order_status
                )
                VALUES (?, NULL, ?, ?, ?, ?, ?, ?)
            `;

            const orderValues = [
                user_id,
                subtotal,
                shipping_fee,
                total,
                payment_method,
                "pending",
                "pending"
            ];

            db.query(orderSQL, orderValues, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({
                            success: false,
                            message: "Failed to create order"
                        });
                    });
                }

                const orderId = result.insertId;

                const itemValues = orderItems.map(item => [
                    orderId,
                    item[0],
                    item[1],
                    item[2]
                ]);

                const itemSQL = `
                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        quantity,
                        price
                    )
                    VALUES ?
                `;

                db.query(itemSQL, [itemValues], err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                success: false,
                                message: "Failed to save order items"
                            });
                        });
                    }

                    let completed = 0;
                    let failed = false;

                    cart.forEach(item => {
                        const stockSQL = `
                            UPDATE products
                            SET stock = stock - ?
                            WHERE id = ? AND stock >= ?
                        `;

                        db.query(
                            stockSQL,
                            [
                                Number(item.quantity),
                                Number(item.product_id),
                                Number(item.quantity)
                            ],
                            (err, result) => {
                                if (failed) {
                                    return;
                                }

                                if (err || result.affectedRows !== 1) {
                                    failed = true;

                                    return db.rollback(() => {
                                        res.status(500).json({
                                            success: false,
                                            message: "Failed to update product stock"
                                        });
                                    });
                                }

                                completed++;

                                if (completed === cart.length) {
                                    db.commit(err => {
                                        if (err) {
                                            return db.rollback(() => {
                                                res.status(500).json({
                                                    success: false,
                                                    message: "Failed to complete order"
                                                });
                                            });
                                        }

                                        res.status(201).json({
                                            success: true,
                                            message: "Order created successfully",
                                            order_id: orderId,
                                            subtotal: subtotal.toFixed(2),
                                            shipping_fee: shipping_fee.toFixed(2),
                                            vat: vat.toFixed(2),
                                            total: total.toFixed(2)
                                        });
                                    });
                                }
                            }
                        );
                    });
                });
            });
        });
    });
});

router.get("/user", authMiddleware, (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            subtotal,
            shipping_fee,
            total,
            payment_method,
            payment_status,
            order_status,
            created_at,
            updated_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Order history error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch order history"
            });
        }

        res.json({
            success: true,
            orders: results
        });
    });
});

router.get("/:orderId", authMiddleware, (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    const orderSQL = `
        SELECT
            id,
            user_id,
            subtotal,
            shipping_fee,
            total,
            payment_method,
            payment_status,
            order_status,
            created_at,
            updated_at
        FROM orders
        WHERE id = ? AND user_id = ?
    `;

    db.query(orderSQL, [orderId, userId], (err, orders) => {
        if (err) {
            console.error("Order details error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch order"
            });
        }

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const order = orders[0];

        const itemsSQL = `
            SELECT
                oi.product_id,
                oi.quantity,
                oi.price,
                p.product_name,
                p.image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;

        db.query(itemsSQL, [orderId], (err, items) => {
            if (err) {
                console.error("Order items error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch order items"
                });
            }

            res.json({
                success: true,
                order: order,
                items: items
            });
        });
    });
});

module.exports = router;
