import otpgenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import User from '../../models/userModel.js'




const editProfileSendOtp = async (req, res) => {
    try {
        const { email } = req.query;
        
        const otp = otpgenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
       
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

        user.otp = otp;
        await user.save();
        res.status(200).json({
            message: 'OTP sent successfully. Please check your email for confirmation.',
            success: "true",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyOtpChangeEmail = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { otp } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (otp === user.otp) {
            
            return res.status(200).json({ message: 'OTP verified successfully', success: "true" });
        } else {
            return res.status(400).json({ message: 'Invalid OTP', success: "false" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export{
    editProfileSendOtp,
    verifyOtpChangeEmail
}