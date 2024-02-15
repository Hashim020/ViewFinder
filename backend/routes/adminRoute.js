import Express from "express";
const router = Express.Router();
// import { upload } from '../multer.js'
import {protect} from '../middleware/adminAuthMiddleware.js'


import {
    authAdmin,
    adminRegister,
    logoutAdmin,
    getAllUser,
    updateUserData,
    deleteUser,
    addNewUser
} from "../controllers/adminController.js";
router.post('/', adminRegister);
router.post('/auth', authAdmin);
router.post('/logout',logoutAdmin);
router.post('/get-user',protect,getAllUser);
router.put('/update-user',protect,updateUserData);
router.delete('/delete-user',protect,deleteUser);
router.post('/add-user',protect,addNewUser);





export default router