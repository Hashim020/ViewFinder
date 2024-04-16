import axios from 'axios';
import Cookies from 'js-cookie'; 

const baseURL = "https://www.hashimlive.online";
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const token = Cookies.get('jwt'); 

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
