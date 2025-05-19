import axiosClient from './axiosClient'

const ChatbotAPI = {
    sendMessage: (data) => {
        const url = '/api/Chatbot/chat'
        return axiosClient.post(url, data)
    }
}

export default ChatbotAPI
