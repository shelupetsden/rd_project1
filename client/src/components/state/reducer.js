export default function commentReducer(state = comments, action) {

    switch (action.type) {
        case 'POPULATE_COMMENTS':
            return {...state, comments: action.payload};
        case "DELETE_COMMENT_SUCCESS":
            console.log(state)
            return {comments: action.payload};
        case "DELETE_COMMENT_FAIL":
            return {...state}
        case "UPDATE_COMMENT_SUCCESS":
            return {comments: action.payload};
        case "UPDATE_COMMENT_FAIL":
            return {...state};
    }
}