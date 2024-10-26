
const {v4: uuidv4} = require("uuid")
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    phone:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
})

userSchema.pre("validate", function() {
    this.uid = uuidv4();
})

const User = mongoose.model('User',userSchema);

module.exports = User;