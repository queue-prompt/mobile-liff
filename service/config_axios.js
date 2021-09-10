import axios from 'axios';

const axiosApi = axios.create({
  // baseURL: 'https://cloudfront.api.xn--42c6cjhs2b6b5k.com/v1'
  baseURL: 'https://api.xn--42c6cjhs2b6b5k.com/v1'
});


export default axiosApi;
