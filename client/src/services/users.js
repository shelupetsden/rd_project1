import {makeRequest} from "./getRequests.js";

export function getUserById(id) {
    return makeRequest(`users/${id}`, {method: 'GET'});
}

export function getAllUsers() {
    return makeRequest('users', {method: 'GET'});
}

export const getUserId = () => {
    return document.cookie.match(/userId=(?<id>[^;]+);?$/).groups.id
};