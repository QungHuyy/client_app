import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import ChatbotAPI from '../API/ChatbotAPI';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Xin chào! Tôi là trợ lý ảo của H&A. Tôi có thể giúp gì cho bạn?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Gửi tin nhắn đến API
      const response = await ChatbotAPI.sendMessage({ message: inputMessage });
      
      // Thêm phản hồi từ bot vào danh sách
      const botMessage = { text: response.reply, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Thêm thông báo lỗi
      const errorMessage = { 
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.', 
        sender: 'bot' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Nút mở chatbot */}
      <button 
        className="chatbot-toggle-btn" 
        onClick={toggleChatbot}
      >
        {isOpen ? (
          <i className="fa fa-times"></i>
        ) : (
          <i className="fa fa-comments"></i>
        )}
      </button>

      {/* Cửa sổ chatbot */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>H&A Trợ lý ảo</h3>
            <button className="close-btn" onClick={toggleChatbot}>
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || inputMessage.trim() === ''}
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
