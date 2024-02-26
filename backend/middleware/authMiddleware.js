import jwt from 'jsonwebtoken';

import AsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect =AsyncHandler(async(req,res,next)=>{
    let token;

    token=req.cookies.jwt;

    if(token){
        try {
            let decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user= await User.findById(decoded.userId).select('-password');

            next()
        } catch (error) {
            res.status(401);
            throw new Error ('Not Authorized, Invalid Token')
        }
    }else{
        res.status(401);
        throw new Error("Not Authorized, No Token")
    }
})



export{

    protect
}