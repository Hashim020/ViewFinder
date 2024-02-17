import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'

//user Components
import PrivateRoute from './components/PrivateRoute.jsx';
import LoginPage from './pages/userPages/LoginPage.jsx';
import RegistrationPage from './pages/userPages/RegistrationPage.jsx';
import ForgotPassword from './pages/userPages/ForgotPassword.jsx';
import VerifyOtpReg from './pages/userPages/VerifyOtpReg.jsx';
import ConfirmResetPW from './pages/userPages/ConfirmResetPW.jsx';
import HomePage from './pages/userPages/HomePage.jsx';
import ProfilePage from './pages/userPages/ProfilePage.jsx'

// admin Components

import AdminLoginPage from './pages/adminPages/AdminLoginPage.jsx';
import UserManagementScreen from './pages/adminPages/UserManagementScreen.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<LoginPage />} />
      <Route path='/signup' element={<RegistrationPage />} />
      <Route path='/restPassword' element={<ForgotPassword />} />
      <Route path='/verifyOtp' element={<VerifyOtpReg />} />
      <Route path='/confirmResetPassword' element={<ConfirmResetPW />} />
      {/* pirvate Route */}
      <Route path='' element={<PrivateRoute />}>
      <Route path='/Home' element={<HomePage />} />
      <Route path='/myProfile' element={<ProfilePage />} />
      </Route>
      {/* Admin Route */}
      <Route path='/adminLogin' element={<AdminLoginPage />} />
      <Route path='/admin/get-user' element={<UserManagementScreen />} />
      
      

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
