const db = require("../config/db");
const bcrypt = require("bcrypt");

const getProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            profile_image,
            is_verified,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user: results[0]
        });
    });
};


const updateProfile = (req, res) => {

    const userId = req.user.id;

    const {
        first_name,
        last_name,
        phone
    } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({
            success: false,
            message: "First name and last name are required."
        });
    }

    const sql = `
        UPDATE users
        SET
            first_name = ?,
            last_name = ?,
            phone = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            first_name,
            last_name,
            phone || null,
            userId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.json({
                success: true,
                message: "Profile updated successfully"
            });
        }
    );
};


const changePassword = async (req, res) => {

    const userId = req.user.id;

    const {
        currentPassword,
        newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Current password and new password are required."
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "New password must be at least 6 characters."
        });
    }

    try {

        const sql = `
            SELECT password
            FROM users
            WHERE id = ?
        `;

        db.query(sql, [userId], async (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect."
                });
            }

            const hashedPassword = await bcrypt.hash(
                newPassword,
                10
            );

            const updateSql = `
                UPDATE users
                SET
                    password = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [hashedPassword, userId],
                (updateErr) => {

                    if (updateErr) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error"
                        });
                    }

                    return res.json({
                        success: true,
                        message: "Password changed successfully."
                    });
                }
            );
        });

    } catch (error) {

        console.error("Password change error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    changePassword
};