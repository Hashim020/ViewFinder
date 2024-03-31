import { useNavigate, Outlet, BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChakraProvider } from '@chakra-ui/react'
import usePreventZoom from "./config/PreventZoom";

function App() {
  usePreventZoom()
  return (
    <>
   
      <ChakraProvider>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide} />
        <Outlet />
      </ChakraProvider>
      
    </>
  );
}

export default App;
