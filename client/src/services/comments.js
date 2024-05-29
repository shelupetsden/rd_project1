import {makeRequest, makeRequestCreate, makeRequestUpdate} from "./getRequests.js";

export function getAllComments() {
    return makeRequest('/comments', {method: 'GET'});
}

export function deleteComment(id) {
    return makeRequest('/comments/' + id, {method: 'DELETE'});
}

export function updateComment(id, comment) {
    return makeRequestUpdate('/comments/' + id, comment, {
        headers: {'Content-Type': 'application/json'},
        method: 'PUT'
    });
}

export function createComment(comment) {
    console.log(comment)
    return makeRequestCreate('/comments', comment, {
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
    });
}