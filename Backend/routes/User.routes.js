import express from 'express'
import {body}  from 'express-validator'
import { Signup } from '../controllers/User.controller.js';
const router = express.Router();

router.post('/signup',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('username').isLength({min:3}).withMessage("name must be atleast 3 character"),
    body('password').isLength({min:5}).withMessage("name must be atleast 5 character"),
],Signup)








export default router;


