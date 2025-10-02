// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://reports.whalesharkengineering.com.ng/api/',  

});

export default API;
