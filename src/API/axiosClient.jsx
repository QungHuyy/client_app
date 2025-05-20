// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#requestconfig` for the full list of configs
const axiosClient = axios.create({
    baseURL: 'http://localhost:8000', //cổng local http://localhost:8000 cỏng render https://server-app-bv0n.onrender.com
    headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
    // Handle token here ...
    return config;
})
axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Xử lý lỗi HTTP
    console.error("API Error:", error.response || error);

    // Trả về lỗi để component có thể xử lý
    if (error.response) {
        // Lỗi từ server (status code không phải 2xx)
        console.error("Server error:", error.response.status, error.response.data);
    } else if (error.request) {
        // Không nhận được phản hồi từ server
        console.error("No response from server:", error.request);
    } else {
        // Lỗi khi thiết lập request
        console.error("Request error:", error.message);
    }

    throw error;
});
export default axiosClient;