import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';

//user Components
import PrivateRoute from './components/userComponents/PrivateRoute.jsx';
import LoginPage from './pages/userPages/LoginPage.jsx';
import RegistrationPage from './pages/userPages/RegistrationPage.jsx';
import ForgotPassword from './pages/userPages/ForgotPassword.jsx';
import VerifyOtpReg from './pages/userPages/VerifyOtpReg.jsx';
import ConfirmResetPW from './pages/userPages/ConfirmResetPW.jsx';
import HomePage from './pages/userPages/HomePage.jsx';
import ProfilePage from './pages/userPages/ProfilePage.jsx';
import OtherUserProfile from './pages/userPages/OtherUserProfile.jsx';
import SearchUser from './pages/userPages/SearchUser.jsx';
import Settings from './pages/userPages/Settings.jsx';
// admin Components
import AdminLoginPage from './pages/adminPages/AdminLoginPage.jsx';
import AdminHome from './pages/adminPages/AdminHome.jsx';
import AdminUserManagement from './pages/adminPages/AdminUserManagement.jsx';
import AdminPostManagement from './pages/adminPages/AdminPostManagement.jsx';




const router = createBrowserRouter(
  createRoutesFromElements(
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
      </Route>
      {/* Admin Route */}
      <Route path='/admin' element={<AdminLoginPage />} />
      <Route path='/admin/Home' element={<AdminHome />} />
      <Route path='/admin/user-management' element={<AdminUserManagement />} />
      <Route path='/admin/post-management' element={<AdminPostManagement />} />
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  </Provider>
);
