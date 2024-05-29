export default function reducer(state, action) {

    //TODO add error handler
    switch (action.type) {
        case 'POPULATE_COMMENTS':
        case "DELETE_COMMENT_SUCCESS":
        case "UPDATE_COMMENT_SUCCESS":
        case "CREATE_COMMENT_SUCCESS":
            // initial state
            return {...state, comments: action.payload};
        case "DELETE_COMMENT_FAIL":
        case "UPDATE_COMMENT_FAIL":
        case "CREATE_COMMENT_FAIL":
        case "GET_CURRENT_USER_ERROR":
            return {...state}
        case "GET_CURRENT_USER_SUCCESS":
            return {...state, user: action.payload};
        default:
            return {...state}
    }
}