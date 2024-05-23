// import {useAsync} from "../../customhooks/hooks.js";
// import {getAllComments} from "../../services/comments.js";
// import {useMemo} from "react";
//
// const {loading, error, value: comments = []} = useAsync(getAllComments);
//
// const commentsByParentId = useMemo(() => {
//     if (comments == null) return [];
//     const group = {};
//     comments.forEach(comment_ => {
//             group[comment_.parentId] ||= []
//             group[comment_.parentId].push(comment_);
//         }
//     )
//     return group;
// }, [comments])
//
// export function rootComment() {
//     return commentsByParentId[null];
// }
//
// export function getReplier(parentId) {
//     return commentsByParentId[parentId];
// }