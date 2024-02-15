import jwt from 'jsonwebtoken'
import  asyncHandler from 'express-async-handler'

const protect=asyncHandler(async(req,res,next)=>{
    let token;
    token=req.cookies.jwtAdmin
    // console.log("token",token);

    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET_ADMIN)
            next();
            
        } catch (error) {

            res.status(401);
            throw new Error("Not Authorized ,invalid token")
            
        }
    }else{

        res.status(401);
        throw new Error("Not Authorized no token")

    }
})

export {protect}