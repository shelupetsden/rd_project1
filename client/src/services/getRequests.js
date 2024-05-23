import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001',//process.env.REACT_APP_SERVER_URL,
    withCredentials: true
});


export function makeRequest(url, options) {
    return api(url, options)
        .then(res => res.data)
        .catch(error => Promise.reject(error?.response?.data?.message ?? "Error"));
}

export function makeRequestUpdate(url, body, options) {
    return api.put(url, body, options)
        .then(res => res.data)
        .catch(error => Promise.reject(error?.response?.data?.message ?? "Error"));
}