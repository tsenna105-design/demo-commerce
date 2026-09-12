const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    createUser
} = require("../models/userModel");


// ===============================
// REGISTER CUSTOMER
// ===============================

const register = async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            email,
            phone,
            password
        } = req.body;
        if (!first_name || !last_name || !email || !password) {

            return res.status(400).json({

                success: false,
                message: "First name, last name, email and password are required"

            });

        }

    
        findUserByEmail(email, async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,
                    message: "Database error"

                });

            }

            // Email already exists
            if (results.length > 0) {

                return res.status(409).json({

                    success: false,
                    message: "An account with this email already exists"

                });

            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create customer
            createUser(

                {
                    first_name,
                    last_name,
                    email,
                    phone,
                    password: hashedPassword,
                    profile_image: null
                },

                (err, result) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({

                            success: false,
                            message: "Failed to create account"

                        });

                    }

                    return res.status(201).json({

                        success: true,
                        message: "Account created successfully",
                        user_id: result.insertId

                    });

                }

            );

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

};


// ===============================
// LOGIN CUSTOMER
// ===============================

const login = async (req, res) => {

    try {

        const {

            email,
            password

        } = req.body;

        // Check required fields
        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and password are required"

            });

        }

        // Find customer by email
        findUserByEmail(email, async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,
                    message: "Database error"

                });

            }

            // User not found
            if (results.length === 0) {

                return res.status(401).json({

                    success: false,
                    message: "Invalid email or password"

                });

            }

            const user = results[0];

            // Compare password
            const passwordMatch = await bcrypt.compare(

                password,
                user.password

            );

            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,
                    message: "Invalid email or password"

                });

            }

            // ===============================
            // CREATE JWT TOKEN
            // ===============================

            const token = jwt.sign(

                {
                    id: user.id,
                    email: user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );

            // ===============================
            // LOGIN SUCCESS
            // ===============================

            return res.status(200).json({

                success: true,

                message: "Login successful",

                token,

                user: {

                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    profile_image: user.profile_image,
                    is_verified: user.is_verified

                }

            });

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

};


// ===============================
// EXPORT CONTROLLERS
// ===============================

module.exports = {

    register,
    login

};