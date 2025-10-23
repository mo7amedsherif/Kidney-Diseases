const mongoose = require("mongoose");
//schema design for user collection in mongodb
userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true },
    lastName:{
        type:String,
        required:true },
    email:{
        type:String,
        required:true,
        unique:true },
    password:{
        type:String,
        required:true },
    confirmPassword:{
        type:String,
        required:true },
    gender:{
        type:String,
        // required:true,
        // enum:['male','female'] 
        }
});    

module.exports=mongoose.model('User',userSchema);