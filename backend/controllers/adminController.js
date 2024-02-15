import AsyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js"
import generateAdminToken from "../utils/generateAdminToken.js";
import User from '../models/userModel.js'


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
})

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
    const userData = await User.find({}, { name: 1, email: 1, profileImage: 1 });
    if (userData) {
        res.status(200).json(userData);
    } else {
        res.status(400);
        throw new Error("Error in fetching data");
    }
});


//@desc Auth admin/UPDATEUSER
//route PUT /api/admin/update-user
//@access Private

const updateUserData = AsyncHandler(async (req, res) => {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
        });
    } else {
        res.status(400);
        throw new Error("user not found");
    }
});


//@desc Auth admin/Delete User
//route DELETE /api/admin/delete-user
//@access Private

const deleteUser = AsyncHandler(async (req, res) => {
    const userId = req.body.userId;
    const deleted = await User.findByIdAndDelete(userId);
  
    if (deleted) {
      res
        .status(200)
        .json({ success: true, message: "User Deleted Succesfully" });
    } else {
      res.status(404).json({ success: false, message: "USER delete Failed" });
    }
  });
  
  //@desc Auth admin/Add User
  //route DELETE /api/admin/add-user
  //@access Private
  
  const addNewUser = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400);
  
      throw new Error("User alredy exists");
    } else {
      const user = await User.create({
        name,
        email,
        password,
      });
      if (user) {
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
  });
 
  










export {
    authAdmin,
    adminRegister,
    logoutAdmin,
    getAllUser,
    updateUserData,
    deleteUser,
    addNewUser,
}