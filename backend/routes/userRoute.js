import Express from "express";
const Router = Express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    registerUserOtpVerify,
    forgotPassword,
    confirmResetPW
} from "../controllers/userController.js";


Router.post('/signup', registerUser);
Router.post('/login', authUser);
Router.post('/logout', logoutUser);
Router.post('/signup-verified', registerUserOtpVerify);
Router.post('/forgot-password', forgotPassword);
Router.post('/confirmResetPassword', confirmResetPW);

export default Router;  