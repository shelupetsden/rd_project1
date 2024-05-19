import {makeRequests} from "./makeRequests.js";

export function getAllComments() {
    return makeRequests("/comments");
}