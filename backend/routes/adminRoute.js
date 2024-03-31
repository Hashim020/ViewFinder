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
    pagination,
    searchUserData
} from "../controllers/adminController/adminController.js";

import {
    getPostWithPaginations,
    postListUnlist,
    getPostReports
} from '../controllers/adminController/adminPostController.js'

router.post('/', adminRegister);
router.post('/auth', authAdmin);
router.post('/logout',logoutAdmin);
router.post('/get-user',protect,getAllUser);
router.post('/userBlockUnblock',protect,blockUnblockUser);
router.get('/users-pagenationcall',protect,pagination);
router.get('/users-search',protect,searchUserData);



router.get('/posts-pagenationcall',protect,getPostWithPaginations);
router.put('/posts-unlistlist:postId',protect,postListUnlist);
router.get('/posts-reports/:postid', getPostReports);




export default router