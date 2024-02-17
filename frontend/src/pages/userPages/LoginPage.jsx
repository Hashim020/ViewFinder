import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../Slices/userApiSlice';
import { setCredentials } from '../../Slices/authSlice';
import { CircularProgress } from '@chakra-ui/react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useGoogleRegisterMutation } from '../../Slices/userApiSlice';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [googelLogin] = useGoogleRegisterMutation()


  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { userInfo } = useSelector((state) => { return state.auth });

  useEffect(() => {
    if (userInfo) {
      navigate('/Home ')
    }
  }, [navigate, userInfo]);


  const googelAuth = async (data) => {
    try {
      console.log(data)
      const {
        email,
        family_name: lastName,
        given_name: firstName,
        sub: googleId,
        picture: profileImageURL,
      } = data

      const userData = {
        firstName,
        lastName,
        email,
        googleId,
        profileImageName: profileImageURL,
      }

      const res = await googelLogin(userData).unwrap()
      console.log(res)
      dispatch(setCredentials({ ...res }))
      navigate('/')
    } catch (err) { }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/')
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
        <h3 className="my-4 text-2xl font-semibold text-gray-700">Welcome Back</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
            <input
              type="email"
              id="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
              <Link to="/restPassword" className="text-sm text-blue-600 hover:underline focus:text-blue-800">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
            />
          </div>
          {isLoading ? (
            <CircularProgress
              isIndeterminate
              color="green.500"
              thickness="4px"
              size="48px"
              trackColor="transparent"
            />
          ) : (
            <button
              type="submit"
              className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
            >
              Log in
            </button>
          )}
          <p className='text-sm font-semibold text-gray-500'>
            Don’t have an account yet?
            <Link to="/signup" className="pl-2 font-medium text-sky-500 hover:underline dark:text-primary-500">
              Sign Up
            </Link>
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-px bg-gray-400 w-14"></span>
            <span className="font-normal text-gray-500">or login with</span>
            <span className="h-px bg-gray-400 w-14"></span>
          </div>
          <GoogleOAuthProvider clientId="207507060713-rk0uhm6ocbq42rq7e1p5bsu7ov4ct1rh.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={credentialResponse => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log(decoded);
                googelAuth(decoded);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </GoogleOAuthProvider>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;