import axios from 'axios';
import axiosRetry from 'axios-retry';

const axiosApiRetry = axios.create({
  baseURL: 'https://cloudfront.api.xn--42c6cjhs2b6b5k.com/v1'
});

axiosRetry(axiosApiRetry, { 
  retries: 3 ,
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; 
  }
})

export default axiosApiRetry;