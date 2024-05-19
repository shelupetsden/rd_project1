import {makeRequests} from "./makeRequests.js";

export function getUserById(id) {
    return makeRequests(`users/${id}`);
}

export function getAllUsers() {
    return makeRequests('users');
}