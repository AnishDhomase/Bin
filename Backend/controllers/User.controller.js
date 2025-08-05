import { User } from "../models/User.model.js";
import {validationResult} from 'express-validator'
export const Signup = async(req,res,next)=>{
    
           
const errors = validationResult(req);

if(!errors.isEmpty()){
         return res.status(400).json(({
            errors:errors.array()[0].msg
         }));
}


const {username,email,password,pic} = req.body;

if(!username || !email || !password){
    throw new Error('All fields are required');
}

const userexist = await User.findOne({email});

if(userexist){
    return res.status(404).json({ message: "User already exist" });
}

const user = await User.create({
    username,
    email,
    password, 
    pic
})

 
const token  = await user.generateToken();

return res.status(200).json({
     message: "Registration successfull",
     user,
     token,
})


}