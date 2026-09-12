const { getAllProducts } = require("../models/productModel");

// ======================================
// GET ALL PRODUCTS
// ======================================

const getProducts = (req, res) => {

    getAllProducts((err, results) => {

        if (err) {
            console.error("Error fetching products:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products"
            });
        }

        return res.status(200).json({
            success: true,
            products: results
        });

    });

};

module.exports = {
    getProducts
};