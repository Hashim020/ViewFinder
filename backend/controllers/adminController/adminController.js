import AsyncHandler from "express-async-handler";
import Admin from "../../models/adminModel.js"
import generateAdminToken from "../../utils/generateAdminToken.js";
import User from '../../models/userModel.js'


//@desc Auth admin/set token
// route POST /api/admin/auth
// @access public
const authAdmin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        generateAdminToken(res, admin._id);

        res.json({
            _id: admin._id,
            email: admin.email,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


//@desc Register a new user
// route POST /api/amdin
// @access public
const adminRegister = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const adminExists = await Admin.findOne({ email: email })

    if (adminExists) {
        res.status(400);
        throw new Error('User allready exist')
    }

    const admin = await Admin.create({
        name,
        email,
        password
    })

    if (admin) {
        generateAdminToken(res, admin._id)
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data')
    }
});



//@desc LogOut user/set token
// route POST /api/admin/Logout
// @access public
const logoutAdmin = AsyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'Successfully Admin Logged Out' })
});



//@desc Auth admin/GETUSER
//route POST /api/admin/get-user
//@access Private

const getAllUser = AsyncHandler(async (req, res) => {
    const userData = await User.find({}).sort({ createdAt: 1 });
    console.log(userData);
    if (userData) {
        res.status(200).json(userData);
    } else {
        res.status(400);
        throw new Error("Error in fetching data");
    }
});


//@desc Auth admin/Add User
//route DELETE /api/admin/add-user
//@access Private
const blockUnblockUser = AsyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
});


const pagination = async (req, res) => {
    console.log("alkdjsfffff");
    try {
        const { page, perPage } = req.query;
        const totalCount = await User.countDocuments();
        const totalPages = Math.ceil(totalCount / parseInt(perPage));
        const skip = Math.max(0, totalCount - (parseInt(page) * parseInt(perPage))); 
        const users = await User.find()
            .skip(skip)
            .limit(parseInt(perPage))
            .sort({ createdAt: -1 });
        res.json({ users, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const searchUserData = async (req, res) => {
    try {
        const { searchTerm, page, perPage } = req.query;
        const regex = new RegExp(searchTerm, 'i');
        const query = {
            $or: [
                { username: regex },
                { name: regex },
                { email: regex },
                { gender: regex },
            ]
        };

        const totalCount = await User.countDocuments(query);
        const totalPages = Math.ceil(totalCount / parseInt(perPage));

        const options = {
            limit: parseInt(perPage) || 10,
            skip: Math.max(0, totalCount - (parseInt(page) * parseInt(perPage))), 
        };

        const users = await User.find(query, null, options);

        res.status(200).json({ users, totalPages });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};









export {
    authAdmin,
    adminRegister,
    logoutAdmin,
    getAllUser,
    blockUnblockUser,
    pagination,
    searchUserData
}