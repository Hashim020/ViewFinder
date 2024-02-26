import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import nodemailer from 'nodemailer';
import otpgenerator from 'otp-generator';
import { generateRandomUsername } from '../utils/utils.js';



//@desc Auth user/set token
// route POST /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.isBlocked) {
            res.status(401).json({ message: 'User is blocked' });
            return;
        }

        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});





//@desc Register a new user
// route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, gender, username, birthdate } = req.body;


    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
        res.status(400);
        throw new Error('Username already exists');
    }


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

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({
            message: 'OTP sent successfully. Please check your email for confirmation.',
            otp: otp,
            userData: { name, email, gender, username, birthdate, password }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send OTP. Please try again later.');
    }
});



//@desc Register a new user
// route POST /api/users
// @access public

const registerOtpVerifiedUser = asyncHandler(async (req, res) => {
    const { name, email, password, gender, username, birthdate } = req.body;


    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }


    const user = await User.create({
        name,
        email,
        password,
        gender,
        username,
        birthdate,
        isVerified: true,
    });

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            success: "true"

        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});



const googleRegister = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, profileImageName } = req.body;
    const NAME = firstName + lastName;
    const userExists = await User.findOne({ email });
    if (userExists) {
        generateToken(res, userExists._id);
        console.log("kjasjdkfffffffffffff");
        res.status(201).json({
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            profileImageName: profileImageName,
        });
    } else {
        let userName = generateRandomUsername(NAME);
        let userNameExist = await User.findOne({ userName });
        console.log("kkkkkkkkkk");

        while (userNameExist) {
            userName = generateRandomUsername(NAME);
            userNameExist = await User.findOne({ userName });
        }
        const user = await User.create({
            name: NAME,
            email: email,
            password: NAME,
            username: userName,
            profileImageName: profileImageName,
            isVerified: true,
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageName: user.profileImageName,
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    }
});






//@desc LogOut user/set token
// route POST /api/users/Logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'Successfully Logged Out' })
})



//@desc Get User Details
// route get /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id, { password: 0 });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});



//@desc Update User Profile
// route POST /api/users/auth
// @access public
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.file) {
            user.profileImageName = req.file.filename;
        }
        if (req.body.gender) {
            user.gender = req.body.gender;
        }
        if (req.body.dateOfBirth) {
            user.birthdate = req.body.dateOfBirth;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImageName: updatedUser.profileImageName,
            gender: updatedUser.gender,
            dateOfBirth: updatedUser.birthdate,
            success:"true",
        });
    } else {
        res.status(400);
        throw new Error('User not found');
    }
});



const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;


    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = otpgenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILID,
            pass: process.env.PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAILID,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ success: true, otp });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});


// @desc    Confirm Reset Password
// @route   POST /api/user/confirmResetPassword
// @access  Public
const confirmResetPW = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;


    const user = await User.findOne({ email });


    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }


    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
});





export {
    authUser,
    registerUser,
    registerOtpVerifiedUser,
    googleRegister,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    confirmResetPW,
}








