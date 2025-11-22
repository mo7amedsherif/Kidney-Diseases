
const mongoose = require("mongoose");
const User = require("../module/user.model");
const responseFormatter = require("../utils/responseFormatter");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");  
        if (user) {
            res.status(200).json(responseFormatter(true, "User profile fetched successfully", user));
        } else {
            res.status(404).json(responseFormatter(false, "User not found"));
        }   
    } catch (error) {
        res.status(500).json(responseFormatter(false, "Server Error"));
    }   
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json(responseFormatter(false, "User already exists"));
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, gender, role });
        if (user) {
            res.status(201).json(responseFormatter(true, "User registered successfully", {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                token: generateToken(user._id)
            }));
        } else {
            res.status(400).json(responseFormatter(false, "Invalid user data"));
        }
    } catch (error) {
        res.status(500).json(responseFormatter(false, "Server Error"));
    }
}   ;

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json(responseFormatter(true, "User logged in successfully", {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email, 
                gender: user.gender,
                token: generateToken(user._id)
            }));
        } else {
            res.status(401).json(responseFormatter(false, "Invalid email or password"));
        }   
    } catch (error) {
        res.status(500).json(responseFormatter(false, "Server Error"));
    }   
};

module.exports = {
    getUserProfile,
    registerUser,
    loginUser
};

