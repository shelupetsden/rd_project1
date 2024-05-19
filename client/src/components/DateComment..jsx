import moment from "moment";

export const DateComment = ({date}) => {
    return moment(date).fromNow();
}