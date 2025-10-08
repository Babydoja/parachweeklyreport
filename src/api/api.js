// src/api.js
import axios from 'axios';
// 'https://reports.whalesharkengineering.com.ng/api/'
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  
  //  baseURL:'https://reports.whalesharkengineering.com.ng/api/' ,
});

export default API;





