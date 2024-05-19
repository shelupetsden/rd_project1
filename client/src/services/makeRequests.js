import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001',//process.env.REACT_APP_SERVER_URL,
    withCredentials: true
});


export function makeRequests(url, options) {
    return api(url, options)
        .then(res => res.data)
        .catch(err => Promise.reject(err?.response?.data?.data?.error?.message || 'Error'));
}