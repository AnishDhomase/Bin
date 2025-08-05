import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
         minlength: [ 3, 'First name must be at least 3 characters long' ],

    },

    email:{
    type:String,
        required:true,
        unique: true,
       
    },

    password:{
    type:String,
        required:true,
         minlength: [ 6, 'Email must be at least 5 characters long' ],
    },
    pic:{
    type:String,
    default:"/img/image.png"
    }
})

UserSchema.methods.generateToken =  function(){
  try {
        return jwt.sign({
            userId:this._id.toString(),
            email:this.email,
        },process.env.JWT_KEY,{
            expiresIn:"24h"
        })
  } catch (error) {
    
  }
}

UserSchema.pre("save", async function(next){
    const user = this;
    if(!user.isModified('password')){
        next();
    }

    try {
        const salt =  bcrypt.genSaltSync(10);
        const hashpassword = await bcrypt.hash(user.password,salt);
        user.password = hashpassword;
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export const User = mongoose.model("User",UserSchema);