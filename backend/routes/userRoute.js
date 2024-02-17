import Express from "express";
const Router = Express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    registerOtpVerifiedUser,
    forgotPassword,
    confirmResetPW,
    googleRegister
} from "../controllers/userController.js";


Router.post('/signup', registerUser);
Router.post('/google-signup', googleRegister);
Router.post('/login', authUser);
Router.post('/logout', logoutUser);
Router.post('/signup-verified', registerOtpVerifiedUser);
Router.post('/forgot-password', forgotPassword);
Router.post('/confirmResetPassword', confirmResetPW);

export default Router;  