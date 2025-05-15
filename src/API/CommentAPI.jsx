import axiosClient from './axiosClient'

const CommentAPI = {

    get_comment: (id) => {
        const url = `/api/comment/${id}`
        return axiosClient.get(url)
    },

    post_comment: (data, id) => {
        const url = `/api/comment/${id}`
        return axiosClient.post(url, data)
    },

    check_can_review: (id_product, id_user) => {
        const url = `/api/comment/check/${id_product}/${id_user}`
        return axiosClient.get(url)
    }

}

export default CommentAPI
