const db = require("../config/db");

// Get all active products
const getAllProducts = (callback) => {
    const sql = `
        SELECT
            id,
            category_id,
            sku,
            product_name,
            brand,
            description,
            price,
            discount_price,
            stock,
            low_stock_level,
            image,
            featured,
            status,
            rating,
            review_count
        FROM products
        WHERE status = 'active'
        ORDER BY id ASC
    `;

    db.query(sql, callback);
};

module.exports = {
    getAllProducts
};