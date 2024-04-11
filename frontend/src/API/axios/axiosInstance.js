import axios from 'axios';

const baseURL = "https://www.hashimlive.online/";
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});



export default instance;
