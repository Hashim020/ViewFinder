import React from 'react'
import App from '../App.jsx';
import { Route, Routes } from 'react-router-dom'


//-------------------Admin ---------------------------
import AdminLoginPage from '../pages/adminPages/AdminLoginPage.jsx';
import AdminHome from '../pages/adminPages/AdminHome.jsx';
import AdminUserManagement from '../pages/adminPages/AdminUserManagement.jsx';
import AdminPostManagement from '../pages/adminPages/AdminPostManagement.jsx';
import AdminContestManagement from '../pages/adminPages/AdminContestManagement.jsx';


//------------------User-------------------------------

import PrivateRoute from '../components/userComponents/PrivateRoute.jsx';
import LoginPage from '../pages/userPages/LoginPage.jsx';
import RegistrationPage from '../pages/userPages/RegistrationPage.jsx';
import ForgotPassword from '../pages/userPages/ForgotPassword.jsx';
import VerifyOtpReg from '../pages/userPages/VerifyOtpReg.jsx';
import ConfirmResetPW from '../pages/userPages/ConfirmResetPW.jsx';
import HomePage from '../pages/userPages/HomePage.jsx';
import ProfilePage from '../pages/userPages/ProfilePage.jsx';
import OtherUserProfile from '../pages/userPages/OtherUserProfile.jsx';
import SearchUser from '../pages/userPages/SearchUser.jsx';
import Settings from '../pages/userPages/Settings.jsx';
import Chatpage from '../pages/userPages/ChatPage.jsx';
import Contests from '../pages/userPages/Contests.jsx';
import ViewContest from '../pages/userPages/ViewContest.jsx';
import Notifications from '../pages/userPages/Notifications.jsx';




const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<App />}>
                {/* Route user */}
                <Route path='/' element={<LoginPage />} />
                <Route path='/signup' element={<RegistrationPage />} />
                <Route path='/restPassword' element={<ForgotPassword />} />
                <Route path='/verifyOtp' element={<VerifyOtpReg />} />
                <Route path='/confirmResetPassword' element={<ConfirmResetPW />} />
                {/* pirvate Route user */}
                <Route path='' element={<PrivateRoute />}>
                    <Route path='/Home' element={<HomePage />} />
                    <Route path='/myProfile' element={<ProfilePage />} />
                    <Route path='/otheruserProfile/:userId' element={<OtherUserProfile />} />
                    <Route path='/search-user' element={<SearchUser />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/settings/change-password' element={<Settings />} />
                    <Route path='/Messaging' element={<Chatpage />} />
                    <Route path='/Contests' element={<Contests />} />
                    <Route path='/Contests-view/:contestId' element={<ViewContest />} />
                    <Route path='/notifications' element={<Notifications />} />
                </Route>
                {/* Admin Route */}
                <Route path='/contest-management' element={<AdminContestManagement />} />
                <Route path='/admin' element={<AdminLoginPage />} />
                <Route path='/admin/Home' element={<AdminHome />} />
                <Route path='/admin/user-management' element={<AdminUserManagement />} />
                <Route path='/admin/post-management' element={<AdminPostManagement />} />
            </Route>
        </Routes>
    )
}



export default Routers