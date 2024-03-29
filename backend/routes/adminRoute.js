import Express from "express";
const router = Express.Router();
// import { upload } from '../multer.js'
import {protect} from '../middleware/adminAuthMiddleware.js'


import {
    authAdmin,
    adminRegister,
    logoutAdmin,
    getAllUser,
    blockUnblockUser,
    pagination
} from "../controllers/adminController.js";


router.post('/', adminRegister);
router.post('/auth', authAdmin);
router.post('/logout',logoutAdmin);
router.post('/get-user',protect,getAllUser);
router.post('/userBlockUnblock',protect,blockUnblockUser);
router.get('/users-pagenationcall',protect,pagination);





export default router