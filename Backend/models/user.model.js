
const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true 
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true 
        },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            default:"male"
        },
        age:{
            type: Number,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user' 
        }
    },
    {
        timestamps: true // . بيضيف تاريخ الإنشاء والتعديل أوتوماتيك
    }
);

module.exports = mongoose.model('User', userSchema);