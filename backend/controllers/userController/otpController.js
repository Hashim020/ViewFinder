import otpgenerator from 'otp-generator';
import nodemailer from 'nodemailer';





const editProfileSendOtp = async (req,res)=>{
    try {
        const { email } = req.query;
        console.log(email);
        const otp = otpgenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAILID,
                pass: process.env.PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.PASSWORD,
            to: email,
            subject: 'OTP for account confirmation',
            text: `Your OTP is: ${otp}. Please enter this OTP to confirm your account.`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({
            message: 'OTP sent successfully. Please check your email for confirmation.',
            otp: otp,
            success: "true",
        });
    } catch (error) {
        
    }
}


export{
    editProfileSendOtp
}