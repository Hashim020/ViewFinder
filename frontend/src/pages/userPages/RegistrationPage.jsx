import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../Slices/userApiSlice.js';
import { useDisclosure } from '@chakra-ui/react';
import SignUpModal from '../../components/modal/SignUpModal.jsx';
import { CircularProgress } from '@chakra-ui/react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useGoogleRegisterMutation } from '../../Slices/userApiSlice';
import { setCredentials } from '../../Slices/authSlice.js';

const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [googelLogin] = useGoogleRegisterMutation()

  const [additionalInfo, setAdditionalInfo] = useState({
    gender: "",
    birthdate: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !username.trim()) {
      toast.error("Please fill in all the fields");
      return;
    }
    onOpen();
  };

  const handleSignUp = async (additionalInfo) => {
    const gender = additionalInfo.gender;
    const birthdate = additionalInfo.birthdate;
    const password = additionalInfo.password;

    setAdditionalInfo(additionalInfo);
    try {
      const res = await register({ name, email, password, gender, username, birthdate }).unwrap();
      console.log(res);
      navigate('/verifyOtp', { state: { response: res } });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate('/Home')
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
      navigate('/');

    } catch (err) { }
  }




  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
        <h3 className="my-4 text-2xl font-semibold text-gray-700">Sign Up</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-sm font-semibold text-gray-500">Full Name</label>
            <input type="text" id="name" autoFocus value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="username" className="text-sm font-semibold text-gray-500">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" />
          </div>
          <div>
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
                Next
              </button>
            )}
          </div>
          <p className='text-sm font-semibold text-gray-500'> Already have an account? <Link to="/" className="pl-2 font-medium text-sky-500 hover:underline dark:text-primary-500"> Log In </Link> </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-px bg-gray-400 w-14"></span>
            <span className="font-normal text-gray-500">or signUp with</span>
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
      <SignUpModal isOpen={isOpen} onClose={onClose} handleSignUp={handleSignUp} />
    </div>
  );
};

export default RegistrationPage;
