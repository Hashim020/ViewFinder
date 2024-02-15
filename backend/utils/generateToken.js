import jwt from 'jsonwebtoken';

const generateToken=(res,userId)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })

    res.cookie('jwt',token,{
        httponly:true,
        secure:process.env.NODE_ENV !== 'DEVELOPMENT',
        sameSite: 'strict',
        maxAge:30*24*60*60*1000
    })
}     


export default generateToken;