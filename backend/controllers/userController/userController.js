import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js'
import generateToken from '../../utils/generateToken.js'
import nodemailer from 'nodemailer';
import otpgenerator from 'otp-generator';
import { generateRandomUsername } from '../../utils/utils.js';
import cloudinary from "../../config/cloudinary.js";
import Post from '../../models/postModel.js'



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
            role: "User"
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
    const fullName = firstName + lastName;

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (user.isBlocked) {
                return res.status(401).json({ message: 'User is blocked' });
            }

            generateToken(res, user._id);
            console.log("User exists and logged in.");

            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageName: profileImageName,
            });
        } else {
            let userName = generateRandomUsername(fullName);
            let userNameExist = await User.findOne({ userName });

            while (userNameExist) {
                userName = generateRandomUsername(fullName);
                userNameExist = await User.findOne({ userName });
            }

            user = new User({
                name: fullName,
                email: email,
                password: fullName, 
                username: userName,
                profileImageName: {
                    public_id: 'YOUR_PUBLIC_ID_HERE', 
                    url: profileImageName, 
                },
                isVerified: true,
            });

            await user.save(); 

            generateToken(res, user._id);
            console.log("New user created and logged in.");

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageName: user.profileImageName.url, 
            });
        }
    } catch (error) {
        return res.status(400).json({ message: "Invalid user data", error });
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
            success: "true",
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


const updateProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { image } = req.body

    const result = await cloudinary.uploader.upload(image, {
        folder: "ProfilePic",
    });

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.profileImageName = {
        public_id: result.public_id,
        url: result.secure_url
    };

    await user.save();

    res.status(200).json({ success: true, message: 'Profile picture updated successfully', data: user.profileImageName });
});


const updateProfileCoverPicture = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { image } = req.body;

    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "ProfileCoverPic",
        });

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.profileCoverPicture = {
            public_id: result.public_id,
            url: result.secure_url
        };

        await user.save();

        res.status(200).json({ success: true, message: 'Profile picture updated successfully', data: user.profileImageName });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile picture' });
    }
});

const getOtherUserProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const userPosts = await Post.find({ userId }).sort({ createdAt: 'desc' }).exec();

        res.json({ user, posts: userPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const followUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const currentUser = await User.findById(req.user._id);
    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(userId)) {
        return res.status(400).json({ message: 'User is already being followed' });
    }

    currentUser.following.push(userId);
    await currentUser.save();

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    res.status(200).json({ message: 'User followed successfully' });
});



const unfollowUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const currentUser = await User.findById(req.user._id);

    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.following.includes(userId)) {
        return res.status(400).json({ message: 'User is not currently being followed' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
    await currentUser.save();

    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
    await userToUnfollow.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
});


const userSearch = asyncHandler(async (req, res) => {
    try {
        const { searchTerm } = req.body;
        console.log(req.body);
        const users = await User.find({
            $or: [
                { username: { $regex: searchTerm, $options: 'i' } },
                { name: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});



const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate({
            path: 'followers',
            select: 'name username _id profileImageName.url',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followers = user.followers.map(follower => ({
            id: follower._id,
            name: follower.name,
            username: follower.username,
            profileImageUrl: follower.profileImageName?.url || '',
        }));

        res.status(200).json({ followers });
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params; 

    try {
        const user = await User.findById(userId).populate({
            path: 'following',
            select: 'name username _id profileImageName.url', 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const following = user.following.map(followedUser => ({
            id: followedUser._id,
            name: followedUser.name,
            username: followedUser.username,
            profileImageUrl: followedUser.profileImageName?.url || '', 
        }));

        res.status(200).json({ following });
    } catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


const changePasswordSettings = asyncHandler(async (req, res) => {
    console.log("dsoifhasflkasdjflaskdfkalsdfksdfkjkasfh")
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; 
  
    const user = await User.findById(userId);
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    if (!(await user.matchPassword(currentPassword))) {
      res.status(400);
      throw new Error('Invalid current password');
    }
  
    user.password = newPassword;
    await user.save();
  
    res.status(200).json({ message: 'Password updated successfully',success:"true" });
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
    updateProfilePicture,
    updateProfileCoverPicture,
    getOtherUserProfile,
    followUser,
    unfollowUser,
    userSearch,
    getFollowers,
    getFollowing,
    changePasswordSettings
}








