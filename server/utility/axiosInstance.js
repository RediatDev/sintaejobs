const axios = require('axios');

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:7898/api', // Ensure to use http:// or https://
});

module.exports = {axiosInstance}