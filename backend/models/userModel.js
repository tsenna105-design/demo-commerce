const db = require("../config/db");

const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

const createUser = (userData, callback) => {
    const sql = `
        INSERT INTO users
        (first_name, last_name, email, phone, password, profile_image, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone || null,
        userData.password,
        userData.profile_image || null,
        0
    ];

    db.query(sql, values, callback);
};

module.exports = {
    findUserByEmail,
    createUser
};