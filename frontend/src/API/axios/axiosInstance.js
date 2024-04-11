import axios from 'axios';

const baseURL = "http://3.110.35.122:5000";
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});



export default instance;
