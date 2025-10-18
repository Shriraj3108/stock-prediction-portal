import axios from "axios";


const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})


// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config){
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)


// Response Interceptor
axiosInstance.interceptors.response.use(
    //If the response is already success i.e. without 401 auth or other interceptor error 
    // we simply let the response go to the fronend.
    function(response){
        return response;
    },
    // Handle failed responses
    async function(error){
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest.retry){
            // If original request is not retry request we  will set it to true i.e. we got the error 
            // and we want to retry the request.
            originalRequest.retry = true;

            //Now we will send the request to refresh token API endpoint i.e. to server to get the new access token.
            const refreshToken = localStorage.getItem('refreshToken')
            try{
                const response = await axiosInstance.post('/token/refresh/', {refresh: refreshToken})
                localStorage.setItem('accessToken', response.data.access)

                //Now we again add the access token back to the  Authorization Header of the original request.
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`
                return axiosInstance(originalRequest)

            }
            catch(error){
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            }
        }
        return Promise.reject(error);
    }
)



export default axiosInstance;