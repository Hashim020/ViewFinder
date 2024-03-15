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
  getFollowing
} from "../controllers/userController/userController.js";
import {
  createPost,
  getUserPosts,
  getAllUsersPost,
  likeUnlikePost,
  postComment,
  getPostComments,
  editPost,
  getPostForMadal
} from "../controllers/userController/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import checkBlockedAndClearToken from "../middleware/userMiddleware/authAndBlockMiddleware.js";
import { editProfileSendOtp } from "../controllers/userController/otpController.js";




Router.post('/signup', registerUser);
Router.post('/google-signup', googleRegister);
Router.post('/login', authUser);
Router.post('/logout', logoutUser);
Router.post('/signup-verified', registerOtpVerifiedUser);
Router.post('/forgot-password', forgotPassword);
Router.post('/confirmResetPassword', confirmResetPW);
Router.route('/profile').get(protect, checkBlockedAndClearToken, getUserProfile).put(protect, checkBlockedAndClearToken, updateUserProfile);
Router.post("/save-post", protect, checkBlockedAndClearToken, createPost);
Router.post("/getuser-post", protect, checkBlockedAndClearToken, getUserPosts);
Router.get("/getotheruser-profile/:userId", protect, checkBlockedAndClearToken, getOtherUserProfile);
Router.put("/profile-picture", protect, checkBlockedAndClearToken, updateProfilePicture);
Router.put("/profileCover-picture", protect, checkBlockedAndClearToken, updateProfileCoverPicture);
Router.get("/otp-generateForeditProfile", protect, checkBlockedAndClearToken, editProfileSendOtp);
Router.get("/getall-posts", protect, checkBlockedAndClearToken, getAllUsersPost);
Router.post("/post-LikeUnlike", protect, checkBlockedAndClearToken, likeUnlikePost);
Router.post("/post-Comment", protect, checkBlockedAndClearToken, postComment);
Router.get("/get-comment/:postId", protect, checkBlockedAndClearToken, getPostComments);
Router.put("/edit-post/:id", protect, checkBlockedAndClearToken, editPost);
Router.post("/follow-user", protect, checkBlockedAndClearToken, followUser);
Router.post("/unfollow-user", protect, checkBlockedAndClearToken, unfollowUser);
Router.post("/user-search", protect, checkBlockedAndClearToken, userSearch);
Router.post("/get-followers", protect, checkBlockedAndClearToken, getFollowers);
Router.post("/get-following", protect, checkBlockedAndClearToken, getFollowing);
Router.get("/get-singlePost/:postId", protect, checkBlockedAndClearToken, getPostForMadal);



export default Router;