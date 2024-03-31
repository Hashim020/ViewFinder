import Express from "express";
const Router = Express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  registerOtpVerifiedUser,
  forgotPassword,
  confirmResetPW,
  googleRegister,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateProfileCoverPicture,
  getOtherUserProfile,
  followUser,
  unfollowUser,
  userSearch,
  getFollowers,
  getFollowing,
  changePasswordSettings
} from "../controllers/userController/userController.js";


import {
  createPost,
  getUserPosts,
  getAllUsersPost,
  likeUnlikePost,
  postComment,
  getPostComments,
  editPost,
  getPostForMadal,
  getLikedUsers,
  reportPost
} from "../controllers/userController/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import checkBlockedAndClearToken from "../middleware/userMiddleware/authAndBlockMiddleware.js";
import { editProfileSendOtp } from "../controllers/userController/otpController.js";


import {
  allUsers,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  sendMessage,
  allMessages
} from '../controllers/userController/chatController.js'


import {
  createContest
} 
from '../controllers/userController/contestController.js' 




Router.post('/signup', registerUser);
Router.post('/google-signup', googleRegister);
Router.post('/login', authUser);
Router.post('/logout', logoutUser);
Router.post('/signup-verified', registerOtpVerifiedUser);
Router.post('/forgot-password', forgotPassword);
Router.post('/confirmResetPassword', confirmResetPW);
Router.route('/profile').get(protect, checkBlockedAndClearToken, getUserProfile).put(protect, checkBlockedAndClearToken, updateUserProfile);
Router.post("/change-PasswordSettings", protect, checkBlockedAndClearToken,changePasswordSettings)
Router.post("/save-post", protect, checkBlockedAndClearToken, createPost);
Router.post("/getuser-post", protect, checkBlockedAndClearToken, getUserPosts);
Router.get("/getotheruser-profile/:userId", protect, checkBlockedAndClearToken, getOtherUserProfile);
Router.put("/profile-picture", protect, checkBlockedAndClearToken, updateProfilePicture);
Router.put("/profileCover-picture", protect, checkBlockedAndClearToken, updateProfileCoverPicture);
Router.get("/otp-generateForeditProfile", protect, checkBlockedAndClearToken, editProfileSendOtp);
Router.get("/getall-posts", protect, checkBlockedAndClearToken, getAllUsersPost);
Router.post("/post-LikeUnlike", protect, checkBlockedAndClearToken, likeUnlikePost);
Router.post("/post-Comment", protect, checkBlockedAndClearToken, postComment);
Router.put("/post-report", protect, checkBlockedAndClearToken, reportPost);
Router.get("/get-comment/:postId", protect, checkBlockedAndClearToken, getPostComments);
Router.put("/edit-post/:id", protect, checkBlockedAndClearToken, editPost);
Router.post("/follow-user", protect, checkBlockedAndClearToken, followUser);
Router.post("/unfollow-user", protect, checkBlockedAndClearToken, unfollowUser);
Router.post("/user-search", protect, checkBlockedAndClearToken, userSearch);
Router.get("/get-followers/:userId", protect, checkBlockedAndClearToken, getFollowers);
Router.get("/get-following/:userId", protect, checkBlockedAndClearToken, getFollowing);
Router.get("/get-singlePost/:postId", protect, checkBlockedAndClearToken, getPostForMadal);
Router.get("/get-likedusers/:postId", protect, checkBlockedAndClearToken, getLikedUsers);


// =====================================chat=================================================

Router.get("/messaging-getusers", protect, checkBlockedAndClearToken, allUsers );
Router.post("/chat/", protect, checkBlockedAndClearToken,accessChat );
Router.get("/chat/", protect, checkBlockedAndClearToken,fetchChats );
Router.post("/chat/group", protect, checkBlockedAndClearToken,createGroupChat);
Router.put("/chat/group-rename", protect, checkBlockedAndClearToken,renameGroup);
Router.put("/chat/group-add", protect, checkBlockedAndClearToken,addToGroup);
Router.put("/chat/group-remove", protect, checkBlockedAndClearToken,removeFromGroup);
// ======================================messaging services=======================
Router.post("/chat/message/", protect, checkBlockedAndClearToken,sendMessage);
Router.get("/chat/message/:chatId", protect, checkBlockedAndClearToken,allMessages);


// ==================================constest===========================================

Router.post('/Contest/create',protect,checkBlockedAndClearToken,createContest);


export default Router;